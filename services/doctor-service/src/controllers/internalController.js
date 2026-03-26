const { asyncHandler, response } = require("@hc/shared");
const doctorService = require("../services/doctorService");
const { AppError } = require("@hc/shared");

const internalVerifyDoctor = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;
  if (!doctorId) throw new AppError("doctorId required", 400);
  const result = await doctorService.verifyDoctor(doctorId);
  return response.sendSuccess(res, { message: "doctor verified", data: result });
});

module.exports = { internalVerifyDoctor };

