"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSessionValue, removeSession, setSession } from "@/utils/session";
import { patientAPI } from "@/services/patient.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getSessionValue("accessToken");
    const user = getSessionValue("user");

    if (token || user) {
      try {
        setUser(user ? JSON.parse(user) : null);
      } catch (e) {
        setUser(user);
      }
      // if (user.role === "patient") {
      //   router.push("/patient");
      // }
    } else {
      router.push("/login"); // redirect unauthenticated users
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await patientAPI.login(email, password);
      const result = response.data.data;
      await setSession("accessToken", result.token);
      await setSession("user", JSON.stringify(result.user));
      setUser(result.user);
      if (result.user.role === "patient") {
        router.push("/patient");
      }
    } catch (error) {
      throw error?.response?.data?.message || error?.message || "Login failed";
    }
  };

  const logout = async () => {
    await removeSession("accessToken");
    await removeSession("user");
    await removeSession("userProfile");
    setUser(null);
    router.push("/login");
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, setUser, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
