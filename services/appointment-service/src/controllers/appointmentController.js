const axios = require("axios");
const config = require("../config");
const Appointment = require("../models/Appointment");
const { asyncHandler, response, AppError } = require("@hc/shared");
const {
  buildAppointmentPublicView,
  canAccess,
} = require("../services/appointmentHelpers");

// helper to send internal notification using configured values (read at call time, not module load time)
async function sendNotification(receiptId, type, message) {
  const notifUrl = config.NOTIFICATION_SERVICE_URL || process.env.NOTIFICATION_SERVICE_URL;
  const token = config.INTERNAL_SERVICE_TOKEN || config.INTERNAL_TOKEN || process.env.INTERNAL_TOKEN || process.env.NOTIFICATION_INTERNAL_TOKEN;
  
  if (!notifUrl) {
    console.warn('sendNotification: NOTIFICATION_SERVICE_URL not set');
    return null;
  }
  if (!token) {
    console.warn('sendNotification: INTERNAL_SERVICE_TOKEN/INTERNAL_TOKEN not set');
    return null;
  }
  
  const url = `${notifUrl.replace(/\/$/, '')}/internal/notifications`;
  try {
    console.log('sendNotification: posting to', url, 'for receiptId:', receiptId, 'type:', type);
    const resp = await axios.post(url, { receiptId, type, message }, { 
      headers: { 'x-internal-token': token },
      timeout: 5000
    });
    console.log('sendNotification: success', { status: resp.status });
    return resp.data;
  } catch (err) {
    console.error('sendNotification: failed', {
      url,
      status: err?.response?.status,
      data: err?.response?.data,
      message: err?.message
    });
    return null;
  }
}

function createAppointmentController({ appointmentSseBroadcaster }) {
  const searchDoctors = asyncHandler(async (req, res) => {
    const specialty = req.query.specialty;
    if (!config.DOCTOR_SERVICE_URL)
      throw new AppError("DOCTOR_SERVICE_URL not configured", 500);
    const url = `${config.DOCTOR_SERVICE_URL}/doctors${specialty ? `?specialty=${encodeURIComponent(specialty)}` : ""}`;
    const result = await axios.get(url, { timeout: 5000 });
    const doctors =
      result.data?.data?.doctors || result.data?.data || result.data;
    return response.sendSuccess(res, {
      message: "doctors found",
      data: { doctors },
    });
  });

  const bookAppointment = asyncHandler(async (req, res) => {
    const { doctorId, startAt, reason, notes } = req.body || {};

    if (!doctorId) throw new AppError("doctorId is required", 400);
    if (!startAt) throw new AppError("startAt is required", 400);

    let appointment;
    try {
      appointment = await Appointment.create({
        patientId: req.user.sub,
        doctorId,
        startAt: new Date(startAt),
        isTelemedicineRequest: false,
        reason: reason || "",
        notes: notes || "",
        status: "scheduled",
        events: [{ type: "booked", detail: "Appointment scheduled" }],
      });

      // Notify patient about successful booking (asynchronously, best-effort)
      try {
        const patientId = appointment.patientId || req.user?.sub;
        if (patientId) {
          await sendNotification(
            patientId,
            'appointment_booked',
            `Your appointment with doctor ${doctorId} has been scheduled for ${appointment.startAt || 'the selected time'}`
          );
        }
      } catch (e) {
        console.error('notify after booking failed', e);
      }

      appointmentSseBroadcaster?.publish(appointment._id, {
        status: appointment.status,
        appointmentId: appointment._id,
      });

      return response.sendSuccess(res, {
        statusCode: 201,
        message: "appointment booked",
        data: { appointment: buildAppointmentPublicView(appointment) },
      });
    } catch (error) {
      // on failure, attempt to notify user if we have id
      try {
        const patientId = req.user?.id || req.user?._id || req.body?.patientId;
        if (patientId) {
          await sendNotification(patientId, "appointment_failed", `Failed to book your appointment: ${error.message || 'unknown error'}`);
        }
      } catch (e) {
        console.error("notify on failure failed", e);
      }

      throw error;
    }
  });

  const cancelAppointment = asyncHandler(async (req, res) => {
    const appointmentId = req.params.appointmentId;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new AppError("Appointment not found", 404);
    if (!canAccess({ user: req.user, appointment }))
      throw new AppError("Forbidden", 403);
    if (appointment.status === "cancelled")
      return response.sendSuccess(res, {
        message: "already cancelled",
        data: { appointmentId },
      });

    appointment.status = "cancelled";
    appointment.statusUpdatedAt = new Date();
    appointment.events.push({
      type: "cancelled",
      detail: "Appointment cancelled",
    });
    await appointment.save();

    appointmentSseBroadcaster?.publish(appointment._id, {
      status: appointment.status,
      appointmentId: appointment._id,
    });

    return response.sendSuccess(res, {
      message: "appointment cancelled",
      data: { appointmentId },
    });
  });

  const listMyAppointments = asyncHandler(async (req, res) => {
    const role = req.user.role;
    let filter = {};
    if (role === "patient") filter = { patientId: req.user.sub };
    else if (role === "doctor") filter = { doctorId: req.user.sub };
    else if (role === "admin") filter = {};
    else throw new AppError("Forbidden", 403);

    const appts = await Appointment.find(filter)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const appointmentsWithDoctors = await Promise.all(
      appts.map(async (appt) => {
        try {
          const doctorUrl = `${config.DOCTOR_SERVICE_URL}/doctors/${appt.doctorId}`;
          const doctorRes = await axios
            .get(doctorUrl, { timeout: 5000 })
            .catch(() => null);
          const doctorData = doctorRes?.data?.data || null;
          console.log(`Fetched doctor ${appt.doctorId}:`, doctorData);
          return buildAppointmentPublicView(appt, doctorData);
        } catch (err) {
          console.error(
            `Failed to fetch doctor ${appt.doctorId}:`,
            err.message,
          );
          return buildAppointmentPublicView(appt, null);
        }
      }),
    );

    return response.sendSuccess(res, {
      message: "appointments",
      data: { appointments: appointmentsWithDoctors },
    });
  });

  const statusStream = asyncHandler(async (req, res) => {
    const appointmentId = req.params.appointmentId;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new AppError("Appointment not found", 404);
    if (!canAccess({ user: req.user, appointment }))
      throw new AppError("Forbidden", 403);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    res.write(
      `event: snapshot\ndata: ${JSON.stringify({ status: appointment.status })}\n\n`,
    );

    appointmentSseBroadcaster?.subscribe(appointmentId, res);
  });

  return {
    searchDoctors,
    bookAppointment,
    cancelAppointment,
    listMyAppointments,
    statusStream,
  };
}

module.exports = { createAppointmentController };
