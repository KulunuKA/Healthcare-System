"use client";
import { registerPatientAPI } from "@/services/patient.service";
import { createContext , useContext} from "react";

const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const registerPatient = async (patientData) => {
    try {
      const response = await registerPatientAPI(patientData);
      return response.data;
    } catch (error) {
      console.error("Error registering patient:", error);
      throw (
        error.response.data || error.message || "Failed to register patient"
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
