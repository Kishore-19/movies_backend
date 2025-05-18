const CustomError = require("./../util/CustomError");
const devErrors = (error, req, res) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};
const castErrorHandler = (err) => {
  const message = `Invalid error for ${err.path} :${err.value}`;
  return new CustomError(message, 400);
};

const duplicateKeyHandleError = (err) => {
  const name = err.keyValue.name;
  const message = `Movie is already is there with name ${name}. Please use another name`;
  console.log(name);

  return new CustomError(message, 400);
};

const validationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map((value) => value.message);
  console.log(errors);
  const errorMessages = errors.join(". ");
  console.log(errorMessages);
  const msg = `Invalid input data:${errorMessages}`;
  return new CustomError(msg, 400);
};
const prodErrors = (error, req, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Somwthing went wrong try again later",
    });
  }
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    devErrors(error, req, res);
  } else if (process.env.NODE_ENV === "production") {
    if (error.name === "CastError") error = castErrorHandler(error);
    if (error.code === 11000) error = duplicateKeyHandleError(error);
    if (error.name === "ValidationError") error = validationErrorHandler(error);
    prodErrors(error, req, res);
  }
};
