const { AppError } = require("../errors");
const { sendError } = require("../response");
const logger = require("../logger");

function errorHandler(err, req, res, next) {
  const requestId = req.requestId;
  if (requestId) {
    logger.error("request failed", { requestId, err: err?.message });
  }

  if (err instanceof AppError) {
    return sendError(res, {
      statusCode: err.statusCode,
      message: err.message,
      details: err.details,
    });
  }

  return sendError(res, {
    statusCode: 500,
    message: "Internal Server Error",
    details: process.env.NODE_ENV === "production" ? undefined : err?.message,
  });
}

module.exports = errorHandler;

