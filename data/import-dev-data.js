const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Movie = require("./../Model/movieModel");

dotenv.config({ path: "./config.env" });

//Database Mongoose connection
mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    console.log("DB connected successfully!");
  })
  .catch((err) => {
    console.log("DB not connected, ERROR Occured");
  });

const movies = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8"));

const deleteMovies = async () => {
  try {
    await Movie.deleteMany();
    console.log("Movie Deleted successfully!");
  } catch (err) {
    console.error(err.message);
  }
  process.exit();
};

const importMovies = async () => {
  try {
    await Movie.create(movies);
    console.log("Imported Movies Successfully");
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

console.log(process.argv);

if (process.argv[2] === "--import") {
  importMovies();
}

if (process.argv[2] === "--delete") {
  deleteMovies();
}
