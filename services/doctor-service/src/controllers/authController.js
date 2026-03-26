const { asyncHandler, response } = require("@hc/shared");
const { register, login } = require("../services/authService");

const registerRoute = asyncHandler(async (req, res) => {
  const { email, password, fullName, specialty } = req.body || {};
  const result = await register({ email, password, fullName, specialty });
  return response.sendSuccess(res, { statusCode: 201, message: "registered", data: result });
});

const loginRoute = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  const result = await login({ email, password });
  return response.sendSuccess(res, { message: "logged in", data: result });
});

module.exports = { registerRoute, loginRoute };

