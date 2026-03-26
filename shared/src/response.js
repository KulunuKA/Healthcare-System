function sendSuccess(res, { statusCode = 200, message = "ok", data } = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function sendError(res, { statusCode = 500, message = "Internal Server Error", details } = {}) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
}

module.exports = { sendSuccess, sendError };

