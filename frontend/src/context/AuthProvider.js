"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSessionValue, removeSession } from "@/utils/session";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getSessionValue("accessToken");
    const sessionUser = getSessionValue("user");

    if (token && sessionUser) {
      try {
        const parsed = JSON.parse(sessionUser);
        setUser(parsed);

        if (parsed.role === "patient") {
          router.push("/patient");
        } else if (parsed.role === "doctor") {
          router.push("/doctor/dashboard");
        }
      } catch {
        // corrupt session – clear and go to login
        removeSession("accessToken");
        removeSession("user");
        router.push("/login");
      }
    }

    setLoading(false);
  }, []);

  const logout = async () => {
    await removeSession("accessToken");
    await removeSession("user");
    await removeSession("userProfile");
    setUser(null);
    router.push("/login");
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
