import axiosInstance from "./axiosInstance";

export function registerPatientAPI(patientData) {
  return axiosInstance.post("/patients/register", patientData);
}