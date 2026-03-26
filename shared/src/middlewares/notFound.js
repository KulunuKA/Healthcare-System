const logger = require("../logger");

function notFound(req, res, next) {
  logger.warn("route not found", { method: req.method, path: req.originalUrl });
  res.status(404).json({
    success: false,
    message: "Not Found",
  });
}

module.exports = notFound;

