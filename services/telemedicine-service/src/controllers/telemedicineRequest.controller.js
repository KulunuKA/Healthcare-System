const { asyncHandler, response } = require("@hc/shared");
const tmRequestService = require("../services/telemedicineRequest.service");

const createRequest = asyncHandler(async (req, res) => {
  const { doctorId, reason, notes } = req.body || {};
  const data = await tmRequestService.createRequest({
    patientId: req.user.sub,
    doctorId,
    reason,
    notes,
  });
  return response.sendSuccess(res, {
    statusCode: 201,
    message: "Telemedicine request created",
    data: { request: data },
  });
});

const listMine = asyncHandler(async (req, res) => {
  const list = await tmRequestService.listForPatient(req.user.sub);
  return response.sendSuccess(res, {
    message: "ok",
    data: { requests: list },
  });
});

const listForDoctor = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const list = await tmRequestService.listAllForDoctor(req.user.sub, {
    status: status || undefined,
  });
  return response.sendSuccess(res, {
    message: "ok",
    data: { requests: list },
  });
});

const getById = asyncHandler(async (req, res) => {
  const data = await tmRequestService.getByIdForUser(req, req.params.id);
  return response.sendSuccess(res, {
    message: "ok",
    data: { request: data },
  });
});

const accept = asyncHandler(async (req, res) => {
  const { scheduledAt } = req.body || {};
  const data = await tmRequestService.acceptRequest({
    requestId: req.params.id,
    doctorId: req.user.sub,
    scheduledAt,
  });
  return response.sendSuccess(res, {
    message: "Request accepted; meeting link created",
    data: { request: data },
  });
});

const reject = asyncHandler(async (req, res) => {
  const data = await tmRequestService.rejectRequest({
    requestId: req.params.id,
    doctorId: req.user.sub,
  });
  return response.sendSuccess(res, {
    message: "Request rejected",
    data: { request: data },
  });
});

const cancel = asyncHandler(async (req, res) => {
  const data = await tmRequestService.cancelRequest({
    requestId: req.params.id,
    patientId: req.user.sub,
  });
  return response.sendSuccess(res, {
    message: "Request cancelled",
    data: { request: data },
  });
});

const complete = asyncHandler(async (req, res) => {
  const data = await tmRequestService.completeRequest({
    requestId: req.params.id,
    doctorId: req.user.sub,
  });
  return response.sendSuccess(res, {
    message: "Session marked completed",
    data: { request: data },
  });
});

module.exports = {
  createRequest,
  listMine,
  listForDoctor,
  getById,
  accept,
  reject,
  cancel,
  complete,
};
