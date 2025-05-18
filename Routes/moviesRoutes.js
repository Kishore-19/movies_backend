const express = require("express");

const router = express.Router();

const {
  getAllMovies,
  createmovie,
  getMovieById,
  updateMovie,
  deleteMovie,
  checkId,
  getHighRating,
  getMovieStats,
  getMoviesByGeners,
} = require("../Controller/moviesController");

// router.param("id", checkId);
// router.route("/high-rated").get(getHighRating, getAllMovies);

router.route("/").get(getAllMovies).post(createmovie);

router.route("/movie-stats").get(getMovieStats);
router.route("/movie-by-genres/:genres").get(getMoviesByGeners);

router.route("/:id").get(getMovieById).patch(updateMovie).delete(deleteMovie);

module.exports = router;
