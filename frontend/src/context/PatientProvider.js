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
        setSession("ç", data.token);
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

  return (
    <PatientContext.Provider
      value={{
        registerPatient,
        loginPatient,
        fetchDoctorsBySpecialty,
        bookAppointment,
        fetchPatientAppointments,
        cancelAppointment,
        appointments,
        doctors,
        loadingAppointments,
        loadingDoctors,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => useContext(PatientContext);
