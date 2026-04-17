export const metadata = {
  title: "Authentication | Smart Healthcare Platform",
};

export default function AuthLayout({ children }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 text-[#2f2d6b]">
      {children}
    </div>
  );
}
