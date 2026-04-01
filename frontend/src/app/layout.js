import "./globals.css";
import LayoutClient from "./LayoutClient";

export const metadata = {
  title: "Smart Healthcare Platform",
  description: "AI-enabled healthcare appointment and Tele-medicine platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}