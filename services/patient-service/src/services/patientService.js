const { AppError } = require("@hc/shared");
const Patient = require("../models/Patient");
const MedicalRecord = require("../models/MedicalRecord");

async function getProfile(patientId) {
  const patient = await Patient.findById(patientId).select("_id email role profile verifiedDoctors").lean();
  if (!patient) throw new AppError("Patient not found", 404);
  return {
    id: patient._id,
    email: patient.email,
    role: patient.role,
    profile: patient.profile,
    verifiedDoctors: patient.verifiedDoctors || [],
  };
}

async function updateProfile(patientId, profile) {
  const patient = await Patient.findByIdAndUpdate(
    patientId,
    { $set: { profile } },
    { new: true }
  );
  if (!patient) throw new AppError("Patient not found", 404);
  return getProfile(patientId);
}

async function getMedical(patientId) {
  const record = await MedicalRecord.findOne({ patientId }).lean();
  if (!record) throw new AppError("Medical record not found", 404);
  return {
    medicalHistory: record.medicalHistory || [],
    documents: record.documents || [],
    prescriptions: record.prescriptions || [],
  };
}

async function uploadReports(patientId, files) {
  if (!files?.length) throw new AppError("No files uploaded", 400);
  const docs = files.map((f) => ({
    originalName: f.originalname,
    filename: f.filename,
    path: f.path,
    uploadedAt: f.uploadedAt || new Date(),
  }));

  const record = await MedicalRecord.findOneAndUpdate(
    { patientId },
    { $push: { documents: { $each: docs } } },
    { new: true, upsert: true }
  );

  return {
    documents: record.documents || [],
  };
}

async function addPrescription({ patientId, doctorId, medications, notes }) {
  if (!doctorId) throw new AppError("doctorId is required", 400);
  if (!Array.isArray(medications) || medications.length === 0) {
    throw new AppError("medications[] is required", 400);
  }

  const record = await MedicalRecord.findOneAndUpdate(
    { patientId },
    {
      $push: {
        prescriptions: {
          doctorId,
          issuedAt: new Date(),
          medications: medications.map((m) => ({
            name: m.name,
            dosage: m.dosage || "",
          })),
          notes: notes || "",
        },
      },
    },
    { new: true, upsert: true }
  );

  return { prescriptions: record.prescriptions || [] };
}

module.exports = {
  getProfile,
  updateProfile,
  getMedical,
  uploadReports,
  addPrescription,
};

