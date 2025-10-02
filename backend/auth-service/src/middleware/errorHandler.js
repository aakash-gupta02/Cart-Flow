function errorHandler(err, req, res, next) {
  console.error("Error 💥", err);

  // Handle operational errors (our custom AppError)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Handle JSON parsing errors
  if (err.type === 'entity.parse.failed' || err.message?.includes('JSON')) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format",
    });
  }

  // Handle MongoDB validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
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