function buildAppointmentPublicView(appt) {
  return {
    id: appt._id,
    patientId: appt.patientId,
    doctorId: appt.doctorId,
    startAt: appt.startAt,
    status: appt.status,
    statusUpdatedAt: appt.statusUpdatedAt,
  };
}

function canAccess({ user, appointment }) {
  if (!user?.role) return false;
  if (user.role === "admin") return true;
  if (user.role === "patient") return String(appointment.patientId) === String(user.sub);
  if (user.role === "doctor") return String(appointment.doctorId) === String(user.sub);
  return false;
}

module.exports = { buildAppointmentPublicView, canAccess };

