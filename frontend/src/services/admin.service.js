import axiosInstance from "./axiosInstance";

const TELEMEDICINE_API_BASE = "/api/telemedicine";

export function getAdminTelemedicineRequestsAPI(token, params = {}) {
  return axiosInstance.get(`${TELEMEDICINE_API_BASE}/requests/admin`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
}
