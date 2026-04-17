import axiosInstance from "./axiosInstance";

const API_BASE_URL = "/api/patients";

const headers = {
  "Content-Type": "application/json",
  Authorization: "",
};

const options = {
  headers: headers,
};

export function registerPatientAPI(patientData) {
  return axiosInstance.post(`${API_BASE_URL}/auth/register`, patientData);
}