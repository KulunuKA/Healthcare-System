const { asyncHandler, response } = require("@hc/shared");
const tmRequestService = require("../services/telemedicineRequest.service");
const axios = require('axios');
const config = require('../config');

const NOTIF_SERVICE_URL = config.NOTIFICATION_SERVICE_URL || process.env.NOTIFICATION_SERVICE_URL;
const INTERNAL_TOKEN = config.INTERNAL_SERVICE_TOKEN || config.INTERNAL_TOKEN || process.env.INTERNAL_TOKEN || process.env.NOTIFICATION_INTERNAL_TOKEN;

async function sendNotification(receiptId, type, message) {
  if (!NOTIF_SERVICE_URL || !INTERNAL_TOKEN) return;
  try {
    const url = `${NOTIF_SERVICE_URL.replace(/\/$/, '')}/internal/notifications`;
    await axios.post(url, { receiptId, type, message }, { headers: { 'x-internal-token': INTERNAL_TOKEN } });
  } catch (e) {
    console.error('telemedicine: failed to send notification', e?.response?.data || e.message);
  }
}

//should send notification to doc
const createRequest = asyncHandler(async (req, res) => {
  const { doctorId, reason, notes } = req.body || {};
  const data = await tmRequestService.createRequest({
    patientId: req.user.sub,
    doctorId,
    reason,
    notes,
  });

  // notify doctor (best-effort)
  try {
    if (doctorId) {
      const msg = `New telemedicine request from ${req.user.sub}${reason ? `: ${reason}` : ''}`;
      await sendNotification(doctorId, 'telemedicine_request', msg);
    }
  } catch (e) {
    console.error('notify doctor failed', e);
  }

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

const listForAdmin = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const list = await tmRequestService.listForAdmin({
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

//should send notification to patient
const accept = asyncHandler(async (req, res) => {
  const { scheduledAt } = req.body || {};
  const data = await tmRequestService.acceptRequest({
    requestId: req.params.id,
    doctorId: req.user.sub,
    scheduledAt,
  });

  // notify patient (best-effort)
  try {
    const patientId = data?.patientId || data?.patient || req.body?.patientId;
    if (patientId) {
      const msg = `Your telemedicine request has been accepted and scheduled for ${scheduledAt || data.scheduledAt || 'the specified time'}`;
      await sendNotification(patientId, 'telemedicine_accepted', msg);
    }
  } catch (e) {
    console.error('notify patient on accept failed', e);
  }

  return response.sendSuccess(res, {
    message: "Request accepted; meeting link created",
    data: { request: data },
  });
});

//should send notification to patient
const reject = asyncHandler(async (req, res) => {
  const data = await tmRequestService.rejectRequest({
    requestId: req.params.id,
    doctorId: req.user.sub,
  });

  // notify patient (best-effort)
  try {
    const patientId = data?.patientId || data?.patient || req.body?.patientId;
    if (patientId) {
      const msg = `Your telemedicine request has been rejected by the doctor.`;
      await sendNotification(patientId, 'telemedicine_rejected', msg);
    }
  } catch (e) {
    console.error('notify patient on reject failed', e);
  }

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

const markPaid = asyncHandler(async (req, res) => {
  const data = await tmRequestService.markPaidByPatient({
    requestId: req.params.id,
    patientId: req.user.sub,
  });
  return response.sendSuccess(res, {
    message: "Payment recorded",
    data: { request: data },
  });
});

module.exports = {
  createRequest,
  listMine,
  listForDoctor,
  listForAdmin,
  getById,
  accept,
  reject,
  cancel,
  complete,
  markPaid,
};
