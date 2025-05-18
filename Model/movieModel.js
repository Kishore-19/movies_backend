const mongoose = require("mongoose");
const fs = require("fs");
const validator = require("validator");

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required field!"],
      unique: true,
      trim: true,
      validate: [validator.isAlpha, "Name should have only alphabatics"],
    },
    description: String,
    duration: {
      type: Number,
      required: [true, "Duration is required field!"],
      trim: true,
    },
    ratings: {
      type: Number,
      validate: {
        validator: function (value) {
          return value > 1 && value <= 10;
        },
        message: "Rating ({VALUE}) should above 1 and below 10",
      },
    },
    totalRating: {
      type: Number,
    },
    releaseYear: {
      type: Number,
      required: [true, "ReleaseYear is required field"],
    },
    releaseDate: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    genres: {
      type: [String],
      required: [true, "genres is required field"],
      enum: {
        values: ["Horror", "Action", "Sci-Fi", "Thriller"],
        message: "This genre not existing in the list",
      },
    },
    directors: {
      type: [String],
      required: [true, "directors is required field"],
    },
    coverImage: {
      type: String,
      required: [true, "cover Image id required Field"],
    },
    actors: {
      type: [String],
      required: [true, "Actors is required field"],
    },
    price: {
      type: Number,
      required: [true, "price is required field"],
    },
    createdBy: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

movieSchema.virtual("DurationHours").get(function () {
  return this.duration / 60;
});

movieSchema.pre("save", function (next) {
  console.log(this);
  this.createdBy = "Kishore V";
  next();
});

movieSchema.post("save", function (doc, next) {
  const content = `A new movie document with name ${doc.name} has been created by ${doc.createdBy}\n`;
  fs.writeFile("./Logs/log.txt", content, (err) => {
    console.error(err);
  });
  next();
});

movieSchema.pre(/^find/, function (next) {
  this.find({ releaseDate: { $lte: Date.now() } });
  this.startTime = Date.now();
  next();
});

movieSchema.post(/^find/, function (docs, next) {
  this.find({ releaseDate: { $lte: Date.now() } });
  this.endTime = Date.now();

  const content = `Query took ${
    this.endTime - this.startTime
  } milliseconds to fetch the documents.\n`;
  fs.writeFileSync("./Logs/log.txt", content, { flag: "a" }, (err) => {
    console.log(err.message);
  });

  next();
});

movieSchema.pre("aggregate", function (next) {
  console.log(
    this.pipeline().unshift({ $match: { releaseDate: { $lte: new Date() } } })
  );
  next();
});

const Movie = mongoose.model("movie", movieSchema);

module.exports = Movie;
