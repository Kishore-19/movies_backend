const express = require("express");
const morgan = require("morgan");
const movieRouter = require("./Routes/moviesRoutes");
const authRouter = require("./Routes/authRoutes");
const app = express();
const CustomError = require("./util/CustomError");
const globalErrorHandler = require("./Controller/errorController");

const logger = (req, res, next) => {
  console.log("logger get executed");
  next();
};

app.use(express.json());
app.use(express.static("./public"));
// morgan middle used for dev logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// // Middleware adding for logger
// app.use(logger);
// // Using Middleware requestedAt property added
// app.use((req, res, next) => {
//   req.requestedAt = new Date().toISOString();
//   next();
// });

// here routing url is used as middleware
app.use("/api/v1/movies", movieRouter);
app.use("/api/v1/users", authRouter);
app.all("*", (req, res, next) => {
  const error = new CustomError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
  next(error);
});

console.log(process.env);
app.use(globalErrorHandler);

module.exports = app;
