"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSessionValue, removeSession } from "@/utils/session";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);


  // useEffect(() => {
  //   const token = getSessionValue("accessToken");
  //   const user = getSessionValue("user");

  //   if (token) {
  //     setUser(user);
  //     if (user.role === "patient") {
  //       router.push("/patient");
  //     }
  //   } else {
  //     router.push("/login"); // redirect unauthenticated users
  //   }

  //   setLoading(false);
  // }, []);

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

export const useAuth = () => useContext(AuthContext)
