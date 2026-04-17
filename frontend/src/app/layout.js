import { PatientProvider } from "@/context/PatientProvider";
import { AuthProvider } from "@/context/AuthProvider";
import { DoctorProvider } from "@/context/DoctorProvider";
import "./globals.css";
import LayoutClient from "./LayoutClient";

export const metadata = {
  title: "Smart Healthcare Platform",
  description: "AI-enabled healthcare appointment and Tele-medicine platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen" suppressHydrationWarning>
        <LayoutClient>
          <AuthProvider>
            <DoctorProvider>
              <PatientProvider>{children}</PatientProvider>
            </DoctorProvider>
          </AuthProvider>
        </LayoutClient>
      </body>
    </html>
  );
}
