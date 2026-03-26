const jwt = require("jsonwebtoken");

function createJwtAuthMiddleware({ jwtSecret, publicRouteMatcher }) {
  return function jwtAuth(req, res, next) {
    try {
      if (publicRouteMatcher?.(req)) return next();
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ success: false, message: "Missing Authorization header" });
      }
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : authHeader;
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
      return next();
    } catch (e) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  };
}

module.exports = { createJwtAuthMiddleware };

