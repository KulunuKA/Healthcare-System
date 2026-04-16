import "./globals.css";

export const metadata = {
  title: "Smart Healthcare Platform",
  description: "AI-enabled healthcare appointment and Tele-medicine platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
