"use client";
import {
  patientAPI,
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
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const getToken = () => getSessionValue("accessToken");

  // ─── Auth ────────────────────────────────────────
  const registerPatient = async (patientData) => {
    try {
      const response = await patientAPI.register(patientData);

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

  const getPatientProfile = async () => {
    const t = getSessionValue("accessToken");
    if (!t) throw new Error("missing token");
    setLoading(true);
    try {
      const res = await patientAPI.getProfile(t);
      if (res?.data?.success) {
        setProfile(res.data.profile);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const updatePatientProfile = async (payload) => {
    const t = getSessionValue("accessToken");
    if (!t) throw new Error("missing token");
    setSaving(true);
    try {
      const res = await patientAPI.updateProfile( payload);
      if (res?.data?.success) {
        setProfile(res.data.profile);
      }
      return res;
    } finally {
      setSaving(false);
    }
  };

  return (
    <PatientContext.Provider
      value={{
        registerPatient,
        appointments,
        doctors,
        loadingAppointments,
        loadingDoctors,
        profile,
        setProfile,
        loading,
        saving,
        getPatientProfile,
        updatePatientProfile,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => useContext(PatientContext);
