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
        error?.response?.data?.message || error?.message || "Failed to register patient"
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
      const token = getToken();
      const response = await getDoctorsBySpecialtyAPI(token, specialty);
      console.log("Doctors response:", response);

      // Handle both response structures: array directly or nested in { doctors } object
      let doctorsList = response.data?.data;
      console.log("Doctors data extracted:", doctorsList);

      if (
        doctorsList &&
        typeof doctorsList === "object" &&
        !Array.isArray(doctorsList)
      ) {
        // If it's an object with a doctors property, extract the array
        doctorsList = doctorsList.doctors || [];
        console.log("Extracted from nested object:", doctorsList);
      }
      doctorsList = Array.isArray(doctorsList) ? doctorsList : [];
      console.log("Final doctors list:", doctorsList);
      setDoctors(doctorsList);
      return doctorsList;
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
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
      console.log("Appointments response:", response);

      // Handle both response structures: array directly or nested in { appointments } object
      let appointmentsList = response.data?.data;
      console.log("Appointments data extracted:", appointmentsList);

      if (
        appointmentsList &&
        typeof appointmentsList === "object" &&
        !Array.isArray(appointmentsList)
      ) {
        // If it's an object with an appointments property, extract the array
        appointmentsList = appointmentsList.appointments || [];
        console.log("Extracted from nested object:", appointmentsList);
      }
      appointmentsList = Array.isArray(appointmentsList)
        ? appointmentsList
        : [];
      console.log("Final appointments list:", appointmentsList);

      // Log each appointment to see doctor data
      appointmentsList.forEach((appt) => {
        console.log(`Appointment ${appt.id}:`, {
          doctorId: appt.doctorId,
          doctor: appt.doctor,
          reason: appt.reason,
          notes: appt.notes,
        });
      });

      setAppointments(appointmentsList);
      return appointmentsList;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
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
