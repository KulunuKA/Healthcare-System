const jwt = require("jsonwebtoken");
const { AppError } = require("@hc/shared");
const config = require("../config");

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(new AppError("Missing Authorization header", 401));
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : authHeader;
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }
}

module.exports = { requireAuth };

