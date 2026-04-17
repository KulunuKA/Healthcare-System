"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSessionValue, setSession } from "@/utils/session";
import {
  registerDoctorAPI,
  loginDoctorAPI,
  getDoctorProfileAPI,
  updateDoctorProfileAPI,
  setAvailabilityAPI,
  appointmentDecisionAPI,
  getDoctorAppointmentsAPI,
  issuePrescriptionAPI,
  viewPatientReportsAPI,
} from "@/services/doctor.service";
import { useAuth } from "./AuthProvider";

const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const getToken = () => getSessionValue("accessToken");

  // ─── Auth ────────────────────────────────────────
  const registerDoctor = async (data) => {
    try {
      const response = await registerDoctorAPI(data);
      if (response.data?.success !== false) {
        const result = response.data.data;
        await setSession("accessToken", result.token);
        const userObj = {
          id: result.doctor?._id || result.doctor?.id,
          email: result.doctor?.email,
          fullName: result.doctor?.fullName,
          specialty: result.doctor?.specialty,
          role: "doctor",
        };
        await setSession("user", JSON.stringify(userObj));
        setUser(userObj);
        router.push("/doctor/dashboard");
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message || "Registration failed";
    }
  };

  const loginDoctor = async ({ email, password }) => {
    try {
      const response = await loginDoctorAPI({ email, password });
      if (response.data?.success !== false) {
        const result = response.data.data;
        await setSession("accessToken", result.token);
        const userObj = {
          id: result.doctor?.id || result.doctor?._id,
          email: result.doctor?.email,
          fullName: result.doctor?.fullName,
          specialty: result.doctor?.specialty,
          verified: result.doctor?.verified,
          role: "doctor",
        };
        await setSession("user", JSON.stringify(userObj));
        setUser(userObj);
        router.push("/doctor/dashboard");
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message || "Login failed";
    }
  };

  // ─── Profile ─────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    setLoadingProfile(true);
    try {
      const token = getToken();
      const res = await getDoctorProfileAPI(token);
      setProfile(res.data.data);
      return res.data.data;
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      throw err;
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  const updateProfile = async (data) => {
    try {
      const token = getToken();
      const res = await updateDoctorProfileAPI(token, data);
      setProfile(res.data.data);
      return res.data.data;
    } catch (err) {
      console.error("Failed to update profile:", err);
      throw err;
    }
  };

  // ─── Availability ────────────────────────────────
  const updateAvailability = async (slots) => {
    try {
      const token = getToken();
      const res = await setAvailabilityAPI(token, slots);
      setProfile(res.data.data);
      return res.data.data;
    } catch (err) {
      console.error("Failed to set availability:", err);
      throw err;
    }
  };

  // ─── Appointments ────────────────────────────────
  const decideAppointment = async (appointmentId, status) => {
    try {
      const token = getToken();
      const res = await appointmentDecisionAPI(token, appointmentId, status);
      // Refresh appointments after decision
      await fetchDoctorAppointments();
      return res.data;
    } catch (err) {
      console.error("Appointment decision failed:", err);
      throw err;
    }
  };

  const fetchDoctorAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    try {
      const token = getToken();
      const res = await getDoctorAppointmentsAPI(token);
      setAppointments(res.data.data || []);
      return res.data.data || [];
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      throw err;
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  // ─── Prescriptions ──────────────────────────────
  const issuePrescription = async ({ patientId, medications, notes }) => {
    try {
      const token = getToken();
      const res = await issuePrescriptionAPI(token, {
        patientId,
        medications,
        notes,
      });
      return res.data;
    } catch (err) {
      console.error("Issue prescription failed:", err);
      throw err;
    }
  };

  // ─── Patient Reports ────────────────────────────
  const fetchPatientReports = async (patientId) => {
    try {
      const token = getToken();
      const res = await viewPatientReportsAPI(token, patientId);
      return res.data.data;
    } catch (err) {
      console.error("Fetch patient reports failed:", err);
      throw err;
    }
  };

  return (
    <DoctorContext.Provider
      value={{
        profile,
        loadingProfile,
        appointments,
        loadingAppointments,
        registerDoctor,
        loginDoctor,
        fetchProfile,
        updateProfile,
        updateAvailability,
        decideAppointment,
        fetchDoctorAppointments,
        issuePrescription,
        fetchPatientReports,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctor = () => useContext(DoctorContext);
