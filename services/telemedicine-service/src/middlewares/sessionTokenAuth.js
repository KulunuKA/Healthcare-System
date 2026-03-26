const jwt = require("jsonwebtoken");
const { AppError } = require("@hc/shared");
const config = require("../config");

function requireSessionToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(new AppError("Missing session Authorization header", 401));
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : authHeader;
  try {
    const decoded = jwt.verify(token, config.TELEMEDICINE_SECRET);
    req.sessionToken = decoded;
    return next();
  } catch {
    return next(new AppError("Invalid or expired session token", 401));
  }
}

function requireSessionIdMatch(paramName = "sessionId") {
  return function match(req, res, next) {
    if (!req.sessionToken?.sessionId) return next(new AppError("Invalid session token payload", 401));
    const expected = req.params[paramName];
    if (expected && String(expected) !== String(req.sessionToken.sessionId)) {
      return next(new AppError("Session token does not match sessionId", 403));
    }
    return next();
  };
}

module.exports = { requireSessionToken, requireSessionIdMatch };

