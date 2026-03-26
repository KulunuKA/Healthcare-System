const jwt = require("jsonwebtoken");
const config = require("../config");
const { AppError } = require("@hc/shared");

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(new AppError("Missing Authorization header", 401));

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : authHeader;
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (e) {
    return next(new AppError("Invalid or expired token", 401));
  }
}

function requireRole(roles) {
  return function roleGuard(req, res, next) {
    if (!req.user?.role) return next(new AppError("Forbidden", 403));
    const ok = Array.isArray(roles) ? roles.includes(req.user.role) : req.user.role === roles;
    if (!ok) return next(new AppError("Forbidden", 403));
    return next();
  };
}

module.exports = { requireAuth, requireRole };

