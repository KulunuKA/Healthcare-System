const { register, login } = require("../services/authService");
const { sendSuccess } = require("@hc/shared").response;
const { AppError } = require("@hc/shared");
const { asyncHandler } = require("@hc/shared");

const registerRoute = asyncHandler(async (req, res) => {
  const { email, password, fullName, phone, role } = req.body || {};
  const result = await register({
    email,
    password,
    role,
    profile: {
      fullName: fullName || "",
      phone: phone || "",
    },
  });
  return sendSuccess(res, { statusCode: 201, message: "registered", data: { token: result.token, user: { role: result.patient.role , profile: result.patient.profile } } });
});

const loginRoute = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  const result = await login({ email, password });
  return sendSuccess(res, { statusCode: 200, message: "logged in", data: result });
});

module.exports = { registerRoute, loginRoute };

