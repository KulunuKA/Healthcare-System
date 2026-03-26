const { asyncHandler, response } = require("@hc/shared");
const telemedicineService = require("../services/telemedicineService");

function createTelemedicineController() {
  const startSession = asyncHandler(async (req, res) => {
    const { appointmentId } = req.body || {};
    const data = await telemedicineService.startSession({ userSub: req.user.sub, appointmentId });
    return response.sendSuccess(res, { statusCode: 201, message: "session started", data });
  });

  const endSession = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const data = await telemedicineService.endSession({ sessionId });
    return response.sendSuccess(res, { message: data?.ended ? "session ended" : "session ended", data });
  });

  return { startSession, endSession };
}

module.exports = { createTelemedicineController };

