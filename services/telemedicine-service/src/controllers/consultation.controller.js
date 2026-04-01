const consultationService = require("../services/consultation.service");

const createConsultation = async (req, res) => {
  try {
    const result = await consultationService.createConsultation(req.body);
    res.status(201).json({
      success: true,
      message: "Consultation created successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getConsultationByAppointmentId = async (req, res) => {
  try {
    const result = await consultationService.getConsultationByAppointmentId(
      req.params.appointmentId
    );

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

const startConsultation = async (req, res) => {
  try {
    const result = await consultationService.startConsultation(req.params.id);

    res.status(200).json({
      success: true,
      message: "Consultation started successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const endConsultation = async (req, res) => {
  try {
    const result = await consultationService.endConsultation(req.params.id);

    res.status(200).json({
      success: true,
      message: "Consultation completed successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const addPrescription = async (req, res) => {
  try {
    const result = await consultationService.addPrescription(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Prescription updated successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createConsultation,
  getConsultationByAppointmentId,
  startConsultation,
  endConsultation,
  addPrescription
};