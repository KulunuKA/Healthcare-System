const Consultation = require("../models/consultation.model");

const createConsultation = async (data) => {
  return await Consultation.create(data);
};

const findByAppointmentId = async (appointmentId) => {
  return await Consultation.findOne({ appointmentId });
};

const findById = async (id) => {
  return await Consultation.findById(id);
};

const updateById = async (id, updateData) => {
  return await Consultation.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });
};

module.exports = {
  createConsultation,
  findByAppointmentId,
  findById,
  updateById
};