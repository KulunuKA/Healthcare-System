"use client";
import { registerPatientAPI } from "@/services/patient.service";
import { setSession } from "@/utils/session";
import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";

const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const router = useRouter();

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
  return (
    <PatientContext.Provider value={{ registerPatient }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => useContext(PatientContext);
