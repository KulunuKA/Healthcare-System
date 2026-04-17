function buildAppointmentPublicView(appt, doctorData = null) {
  console.log(`Building appointment view for ${appt._id}, doctorData:`, doctorData);
  return {
    id: appt._id,
    patientId: appt.patientId,
    doctorId: appt.doctorId,
    doctor: doctorData ? {
      id: doctorData.id || doctorData._id,
      fullName: doctorData.fullName,
      specialty: doctorData.specialty,
      email: doctorData.email,
      verified: doctorData.verified,
      offerTelemedicine: doctorData.offerTelemedicine,
    } : null,
    startAt: appt.startAt,
    status: appt.status,
    statusUpdatedAt: appt.statusUpdatedAt,
    reason: appt.reason,
    notes: appt.notes,
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

