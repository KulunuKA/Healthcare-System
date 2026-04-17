const consultationRepository = require("../repositories/consultation.repository");
const { generateMeetingLink } = require("../utils/generateMeetingLink");

const createConsultation = async (payload) => {
  const { appointmentId, patientId, doctorId } = payload;

  if (!appointmentId || !patientId || !doctorId) {
    throw new Error("appointmentId, patientId, and doctorId are required");
  }

  const existingConsultation =
    await consultationRepository.findByAppointmentId(appointmentId);

  if (existingConsultation) {
    throw new Error("Consultation already exists for this appointment");
  }

  const meetingLink = generateMeetingLink(appointmentId);

  const consultationData = {
    appointmentId,
    patientId,
    doctorId,
    meetingLink,
    status: "scheduled"
  };

  return await consultationRepository.createConsultation(consultationData);
};

const getConsultationByAppointmentId = async (appointmentId) => {
  const consultation =
    await consultationRepository.findByAppointmentId(appointmentId);

  if (!consultation) {
    throw new Error("Consultation not found");
  }

  return consultation;
};

const startConsultation = async (id) => {
  const consultation = await consultationRepository.findById(id);

  if (!consultation) {
    throw new Error("Consultation not found");
  }

  if (consultation.status === "completed") {
    throw new Error("Completed consultation cannot be started again");
  }

  return await consultationRepository.updateById(id, {
    status: "ongoing",
    startedAt: new Date()
  });
};

const endConsultation = async (id) => {
  const consultation = await consultationRepository.findById(id);

  if (!consultation) {
    throw new Error("Consultation not found");
  }

  return await consultationRepository.updateById(id, {
    status: "completed",
    endedAt: new Date()
  });
};

const addPrescription = async (id, payload) => {
  const { prescription, notes } = payload;

  const consultation = await consultationRepository.findById(id);

  if (!consultation) {
    throw new Error("Consultation not found");
  }

  return await consultationRepository.updateById(id, {
    prescription: prescription || consultation.prescription,
    notes: notes || consultation.notes
  });
};

module.exports = {
  createConsultation,
  getConsultationByAppointmentId,
  startConsultation,
  endConsultation,
  addPrescription
};