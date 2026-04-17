const { asyncHandler, response } = require("@hc/shared");
const doctorService = require("../services/doctorService");

const getProfile = asyncHandler(async (req, res) => {
  const profile = await doctorService.getProfile(req.user.sub);
  return response.sendSuccess(res, { message: "profile", data: profile });
});

const updateProfile = asyncHandler(async (req, res) => {
  const updated = await doctorService.updateProfile(req.user.sub, {
    fullName: req.body?.fullName || "",
    specialty: req.body?.specialty || "",
    offerTelemedicine: req.body?.offerTelemedicine,
    verified: req.body?.verified,
  });
  return response.sendSuccess(res, {
    message: "profile updated",
    data: updated,
  });
});

module.exports = { getProfile, updateProfile };
