export const errorHandler = (err, req, res, next) => {
  // Log error details
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR:`, {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal server error"
  });
};
