const crypto = require("crypto");

function requestId(req, res, next) {
  req.requestId =
    req.headers["x-request-id"] || crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  res.setHeader("x-request-id", req.requestId);
  next();
}

module.exports = requestId;

