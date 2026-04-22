import axiosInstance from "./axiosInstance";

const API_BASE_URL = "/api/patients";
const APPOINTMENT_API_BASE = "/api/appointments";
const DOCTOR_API_BASE = "/api/doctors";
const TELEMEDICINE_API_BASE = "/api/telemedicine";
const NOTIFICATION_API_BASE = "/api/notifications";

// ─── Auth ────────────────────────────────────────────
export function registerPatientAPI(patientData) {
  return axiosInstance.post(`${API_BASE_URL}/auth/register`, patientData);
}

export function loginPatientAPI({ email, password }) {
  return axiosInstance.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  });
}

// ─── Doctors ─────────────────────────────────────────
export function getDoctorsBySpecialtyAPI(token, specialty) {
  return axiosInstance.get(`${APPOINTMENT_API_BASE}/doctors/search`, {
    params: { specialty },
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function searchDoctorsAPI(token, query) {
  return axiosInstance.get(`${APPOINTMENT_API_BASE}/doctors/search`, {
    params: { q: query },
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** Resolves a doctor when opening the booking page directly (no in-memory list). */
export function getDoctorByIdAPI(token, doctorId) {
  return axiosInstance.get(`${DOCTOR_API_BASE}/doctors/${doctorId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

// ─── Telemedicine (telemedicine-service) ─────────────────
export function createTelemedicineRequestAPI(token, { doctorId, reason, notes }) {
  return axiosInstance.post(
    `${TELEMEDICINE_API_BASE}/requests`,
    { doctorId, reason, notes },
    { headers: { Authorization: `Bearer ${token}` } },
  );
}

export function getMyTelemedicineRequestsAPI(token) {
  return axiosInstance.get(`${TELEMEDICINE_API_BASE}/requests/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function cancelTelemedicineRequestAPI(token, requestId) {
  return axiosInstance.patch(
    `${TELEMEDICINE_API_BASE}/requests/${requestId}/cancel`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
}

/** Marks telemedicine session as paid (replace with real payment gateway later). */
export function payTelemedicineRequestAPI(token, requestId) {
  return axiosInstance.patch(
    `${TELEMEDICINE_API_BASE}/requests/${requestId}/pay`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
}

// ─── Appointments ────────────────────────────────────
export function bookAppointmentAPI(token, appointmentData) {
  return axiosInstance.post(
    `${APPOINTMENT_API_BASE}/appointments`,
    appointmentData,
    { headers: { Authorization: `Bearer ${token}` } },
  );
}

export function getPatientAppointmentsAPI(token) {
  return axiosInstance.get(`${APPOINTMENT_API_BASE}/appointments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getAppointmentDetailAPI(token, appointmentId) {
  return axiosInstance.get(
    `${APPOINTMENT_API_BASE}/appointments/${appointmentId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
}

export function cancelAppointmentAPI(token, appointmentId) {
  return axiosInstance.post(
    `${APPOINTMENT_API_BASE}/appointments/${appointmentId}/cancel`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
}

export function subscribeToAppointmentUpdatesAPI(token, appointmentId) {
  return `${axiosInstance.defaults.baseURL}${APPOINTMENT_API_BASE}/appointments/${appointmentId}/status/stream?token=${token}`;
}

export const patientAPI = {
  register: (patientData) => {
    return axiosInstance.post(`${API_BASE_URL}/auth/register`, patientData);
  },

  login: (email, password) => {
    return axiosInstance.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
  },

  // ─── Profile ─────────────────────────────────────────
  getProfile: () => {
    return axiosInstance.get(`${API_BASE_URL}/me`);
  },

  updateProfile: (profileData) => {
    return axiosInstance.put(`${API_BASE_URL}/me`, profileData);
  },
  getNotifications: () => {
    return axiosInstance.get(`${NOTIFICATION_API_BASE}/notifications`);
  },
  markNotificationRead: (id) => {
    return axiosInstance.put(
      `${NOTIFICATION_API_BASE}/notifications/${id}/read`,
    );
  },
};
