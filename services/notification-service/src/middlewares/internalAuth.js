const config = require("../config");
const { AppError } = require("@hc/shared");

function internalAuth(req, res, next) {
  const token = req.headers["x-internal-token"];
  if (!token || token !== config.INTERNAL_SERVICE_TOKEN) {
    return next(new AppError("Forbidden: internal token required", 403));
  }
  return next();
}

module.exports = { internalAuth };

