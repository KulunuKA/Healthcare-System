const { asyncHandler, response } = require("@hc/shared");
const patientService = require("../services/patientService");

const getProfile = asyncHandler(async (req, res) => {
  const profile = await patientService.getProfile(req.user.sub);
  return response.sendSuccess(res, { message: "profile", data: profile });
});

const updateProfile = asyncHandler(async (req, res) => {
  const updated = await patientService.updateProfile(req.user.sub, {
    fullName: req.body?.fullName || "",
    phone: req.body?.phone || "",
    gender: req.body?.gender || "",
    dateOfBirth: req.body?.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined,
  });
  return response.sendSuccess(res, { message: "profile updated", data: updated });
});

module.exports = { getProfile, updateProfile };

