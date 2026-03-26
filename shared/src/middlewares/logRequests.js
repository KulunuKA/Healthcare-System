const logger = require("../logger");

function logRequests(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    logger.info("http request", {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
    });
  });
  next();
}

module.exports = logRequests;

