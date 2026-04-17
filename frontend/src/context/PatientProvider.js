"use client";
import {
  registerPatientAPI,
  loginPatientAPI,
  getDoctorsBySpecialtyAPI,
  bookAppointmentAPI,
  getPatientAppointmentsAPI,
  cancelAppointmentAPI,
} from "@/services/patient.service";
import { setSession, getSessionValue } from "@/utils/session";
import { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const getToken = () => getSessionValue("accessToken");

  // ─── Auth ────────────────────────────────────────
  const registerPatient = async (patientData) => {
    try {
      const response = await registerPatientAPI(patientData);

      if (response.status === 201) {
        const data = response.data.data;
        //store token and user info in localStorage or context
        setSession("accessToken", data.token);
        setSession("user", JSON.stringify(data.user));

        //redirect to patient dashboard or home page
        router.push("/patient");
      }
      return response.data;
    } catch (error) {
      console.error("Error registering patient:", error);
      throw (
        error.response.data || error.message || "Failed to register patient"
      );
    }
  };

  const loginPatient = async ({ email, password }) => {
    try {
      const response = await loginPatientAPI({ email, password });
      if (response.status === 200 && response.data?.success !== false) {
        const data = response.data.data;
        setSession("accessToken", data.token);
        setSession("user", JSON.stringify(data.user));
        setUser(data.user);
        router.push("/patient");
      }
      return response.data;
    } catch (error) {
      console.error("Error logging in patient:", error);
      throw error.response?.data || error.message || "Failed to login";
    }
  };

  // ─── Doctors ─────────────────────────────────────
  const fetchDoctorsBySpecialty = useCallback(async (specialty) => {
    setLoadingDoctors(true);
    try {
      const response = await getDoctorsBySpecialtyAPI(specialty);
      setDoctors(response.data.data || []);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching doctors:", error);
      throw error;
    } finally {
      setLoadingDoctors(false);
    }
  }, []);

  // ─── Appointments ────────────────────────────────
  const fetchPatientAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    try {
      const token = getToken();
      const response = await getPatientAppointmentsAPI(token);
      setAppointments(
        Array.isArray(response.data.data) ? response.data.data : [],
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  const bookAppointment = async (appointmentData) => {
    try {
      const token = getToken();
      const response = await bookAppointmentAPI(token, appointmentData);
      await fetchPatientAppointments();
      return response.data;
    } catch (error) {
      console.error("Error booking appointment:", error);
      throw (
        error.response?.data || error.message || "Failed to book appointment"
      );
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const token = getToken();
      const response = await cancelAppointmentAPI(token, appointmentId);
      await fetchPatientAppointments();
      return response.data;
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      throw (
        error.response?.data || error.message || "Failed to cancel appointment"
      );
    }
  };

  return (
    <PatientContext.Provider
      value={{
        registerPatient,
        loginPatient,
        appointments,
        doctors,
        loadingAppointments,
        loadingDoctors,
        fetchPatientAppointments,
        bookAppointment,
        cancelAppointment,
        fetchDoctorsBySpecialty,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => useContext(PatientContext);
