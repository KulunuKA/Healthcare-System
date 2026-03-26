const { asyncHandler, response, AppError } = require("@hc/shared");
const { getPatientContact, sendEmail, sendSmsMock } = require("../services/notificationService");

const appointmentBooked = asyncHandler(async (req, res) => {
  const { appointmentId, patientId, doctorId } = req.body || {};
  if (!appointmentId || !patientId || !doctorId) throw new AppError("appointmentId, patientId, doctorId are required", 400);

  const patient = await getPatientContact(patientId).catch(() => null);
  const email = patient?.email;
  const phone = patient?.profile?.phone;
  const fullName = patient?.profile?.fullName || "Patient";

  const subject = "Appointment booked";
  const text = `Hi ${fullName}, your appointment (${appointmentId}) has been booked.`;

  await Promise.all([
    email ? sendEmail({ to: email, subject, text }) : Promise.resolve(),
    phone ? sendSmsMock({ to: phone, text }) : Promise.resolve(),
  ]);

  return response.sendSuccess(res, { message: "appointment notification triggered" });
});

const paymentSuccess = asyncHandler(async (req, res) => {
  const { appointmentId, patientId, provider } = req.body || {};
  if (!appointmentId || !patientId) throw new AppError("appointmentId and patientId are required", 400);

  const patient = await getPatientContact(patientId).catch(() => null);
  const email = patient?.email;
  const phone = patient?.profile?.phone;
  const fullName = patient?.profile?.fullName || "Patient";

  const subject = "Payment successful";
  const text = `Hi ${fullName}, your payment for appointment (${appointmentId}) was successful${provider ? ` via ${provider}` : ""}.`;

  await Promise.all([
    email ? sendEmail({ to: email, subject, text }) : Promise.resolve(),
    phone ? sendSmsMock({ to: phone, text }) : Promise.resolve(),
  ]);

  return response.sendSuccess(res, { message: "payment notification triggered" });
});

module.exports = { appointmentBooked, paymentSuccess };

