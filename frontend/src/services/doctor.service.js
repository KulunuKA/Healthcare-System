import axiosInstance from "./axiosInstance";

const API_BASE_URL = "/api/doctors";

// ─── Auth ────────────────────────────────────────────
export function loginDoctorAPI({ email, password }) {
  return axiosInstance.post(`${API_BASE_URL}/auth/login`, { email, password });
}

export function registerDoctorAPI({ email, password, fullName, specialty, offerTelemedicine }) {
  return axiosInstance.post(`${API_BASE_URL}/auth/register`, {
    email,
    password,
    fullName,
    specialty,
    offerTelemedicine,
  });
}

// ─── Profile ─────────────────────────────────────────
export function getDoctorProfileAPI(token) {
  return axiosInstance.get(`${API_BASE_URL}/me/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateDoctorProfileAPI(token, data) {
  return axiosInstance.put(`${API_BASE_URL}/me/profile`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ─── Availability ────────────────────────────────────
export function setAvailabilityAPI(token, slots) {
  return axiosInstance.put(
    `${API_BASE_URL}/availability`,
    { slots },
    { headers: { Authorization: `Bearer ${token}` } },
  );
}

// ─── Appointments ────────────────────────────────────
export function appointmentDecisionAPI(token, appointmentId, status) {
  return axiosInstance.post(
    `${API_BASE_URL}/appointments/${appointmentId}/decision`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } },
  );
}

export function getDoctorAppointmentsAPI(token) {
  const APPOINTMENT_API_BASE = "/api/appointments";
  return axiosInstance.get(`${APPOINTMENT_API_BASE}/appointments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ─── Patient Reports ─────────────────────────────────
export function viewPatientReportsAPI(token, patientId) {
  return axiosInstance.get(`${API_BASE_URL}/patients/${patientId}/reports`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ─── Prescriptions ───────────────────────────────────
export function issuePrescriptionAPI(token, { patientId, medications, notes }) {
  return axiosInstance.post(
    `${API_BASE_URL}/prescriptions/issue`,
    { patientId, medications, notes },
    { headers: { Authorization: `Bearer ${token}` } },
  );
}

// ─── Public ──────────────────────────────────────────
export function listDoctorsAPI(specialty) {
  const params = specialty ? { specialty } : {};
  return axiosInstance.get(`${API_BASE_URL}/doctors`, { params });
}
