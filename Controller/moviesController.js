const fs = require("fs");
const Movie = require("./../Model/movieModel");
const ApiFeature = require("../util/ApiFeature");
const movies = JSON.parse(fs.readFileSync("./data/movies.json"));
const asyncErrorHandler = require("./../util/AsyncErrorHandler");
const CustomError = require("./../util/CustomError");

exports.checkId = (req, res, next, value) => {
  console.log(` Movie ID is ${value}`);
  const movie = movies.find((movie) => movie.id === value);

  if (!movie) {
    return res.status(404).json({
      status: "fail",
      message: `Movie not found with ID ${value}`,
    });
  }
  next();
};

// exports.getHighRating = (req, res, next) => {
//   console.log("Inside getHighRating middleware");

//   req.query.limit = "5";
//   req.query.sort = "-ratings";
//   console.log(req);
//   console.log("mid:", req.query, req.query.sort);
//   next();
// };

exports.getAllMovies = asyncErrorHandler(async (req, res) => {
  const feature = new ApiFeature(Movie.find(), req.query)
    .filter()
    .sort()
    .limitingFields()
    .paginate();

  const movies = await feature.query;
  console.log(movies, movies.length);
  res.status(200).json({
    status: "success",
    length: movies.length,
    data: {
      movies,
    },
  });
});

exports.createmovie = asyncErrorHandler(async (req, res) => {
  const movie = await Movie.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      movie,
    },
  });
});

exports.getMovieById = asyncErrorHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);
  console.log("movie:", movie);
  if (!movie) {
    console.log(" inside movie:", movie);
    const error = new CustomError(
      `Movie of id ${req.params.id} is not found!`,
      404
    );
    return next(error);
  }
  res.status(200).json({
    status: "success",
    data: {
      movie,
    },
  });
});

exports.updateMovie = asyncErrorHandler(async (req, res, next) => {
  const id = req.params.id;

  const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
    new: true,
    // runValidators: true,
  });

  console.log("updat..");

  if (!updatedMovie) {
    const error = new Error(`No movie found with ID: ${id}`);
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({
    status: "Success",
    data: {
      updatedMovie,
    },
  });
});

exports.deleteMovie = asyncErrorHandler(async (req, res) => {
  const id = req.params.id;
  const movie = await Movie.findByIdAndDelete(id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getMovieStats = asyncErrorHandler(async (req, res) => {
  const movies = await Movie.aggregate([
    // match will check the rating is greater than 9 and returns the value
    { $match: { ratings: { $gte: 8 } } }, // stage 1 result
    {
      $group: {
        _id: "$releaseYear",
        avgRatings: { $avg: "$ratings" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        totalPrice: { $sum: "$price" },
        movieCount: { $sum: 1 },
      },
    }, // stage 2 filter : avg for filtered stage 1 results
    {
      $sort: { minPrice: 1 }, // sorting the filter result again
    },
    { $match: { maxPrice: { $gte: 12 } } }, // filtering the sorted result again
  ]);

  res.status(200).json({
    status: "Success",
    count: movies.length,
    data: {
      movies,
    },
  });
});

exports.getMoviesByGeners = asyncErrorHandler(async (req, res) => {
  const genres = req.params.genres;
  const movies = await Movie.aggregate([
    { $unwind: "$genres" },
    {
      $group: {
        _id: "$genres",
        movieCount: { $sum: 1 },
        movies: { $push: "$name" },
      },
    },
    { $addFields: { genre: "$_id" } },
    { $project: { _id: 0 } },
    { $sort: { movieCount: -1 } },
    // { $limit: 3 },
    { $match: { genre: genres } },
  ]);

  res.status(200).json({
    status: "Success",
    count: movies.length,
    data: {
      movies,
    },
  });
});
