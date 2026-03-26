const config = require("../config");
const { AppError } = require("@hc/shared");

function verifyWebhook(req, res, next) {
  const secret = req.headers["x-webhook-secret"];
  if (!secret || secret !== config.WEBHOOK_SECRET) return next(new AppError("Forbidden: invalid webhook secret", 403));
  return next();
}

module.exports = { verifyWebhook };

