const AppError = require("../utils/appError");

const devError = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    errorStack: err.stack,
  });
};

const prodError = (res, err) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

const handleValidationError = (error) => {
  let allErrors = Object.values(error.errors).map((e) => e.message);

  const message = `Invaild input: ${allErrors.join(" ")}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsError = (error) => {
  const message = "Duplicate field";
  return new AppError(message, 11000);
};

const globalErrorController = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    devError(res, err);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.name = err.name;
    error.code = err.code;

    if (error.name === "ValidationError") {
      error = handleValidationError(err);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsError(err);
    }

    prodError(res, error);
  }
};

module.exports = globalErrorController;
