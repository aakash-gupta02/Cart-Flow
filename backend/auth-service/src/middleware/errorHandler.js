function errorHandler(err, req, res, next) {
  console.error("Error 💥", err);

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // For unexpected errors (like coding bugs, db crashes, etc.)
  return res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again later.",
  });
}

export default errorHandler;