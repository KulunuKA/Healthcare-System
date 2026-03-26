const Appointment = require("../models/Appointment");
const { asyncHandler, response, AppError } = require("@hc/shared");

function createInternalAppointmentController({ appointmentSseBroadcaster }) {
  const decision = asyncHandler(async (req, res) => {
    const appointmentId = req.params.appointmentId;
    const { doctorId, status } = req.body || {};
    if (!doctorId) throw new AppError("doctorId is required", 400);
    if (!["accepted", "rejected"].includes(status)) throw new AppError("status must be accepted|rejected", 400);

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new AppError("Appointment not found", 404);
    if (String(appointment.doctorId) !== String(doctorId)) {
      throw new AppError("doctorId does not match appointment", 403);
    }

    appointment.status = status;
    appointment.statusUpdatedAt = new Date();
    appointment.events.push({ type: "doctor_decision", detail: String(status) });
    await appointment.save();

    appointmentSseBroadcaster?.publish(appointment._id, {
      status: appointment.status,
      appointmentId: appointment._id,
      decision: status,
    });

    return response.sendSuccess(res, { message: "appointment updated", data: { appointmentId, status } });
  });

  const internalGetAppointment = asyncHandler(async (req, res) => {
    const appointmentId = req.params.appointmentId;
    const appointment = await Appointment.findById(appointmentId).lean();
    if (!appointment) throw new AppError("Appointment not found", 404);
    return response.sendSuccess(res, { message: "appointment", data: appointment });
  });

  return { decision, internalGetAppointment };
}

module.exports = { createInternalAppointmentController };

