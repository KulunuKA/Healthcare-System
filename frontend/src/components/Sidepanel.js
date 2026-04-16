import { Cross, ShieldCheck, Calendar, Video } from "lucide-react";

const FEATURES = [
  {
    Icon: ShieldCheck,
    title: "Secure medical records",
    desc: "All data is encrypted end-to-end with HIPAA-compliant infrastructure",
  },
  {
    Icon: Calendar,
    title: "Real-time appointments",
    desc: "Book, reschedule or cancel visits seamlessly anytime",
  },
  {
    Icon: Video,
    title: "Instant consultations",
    desc: "Connect with your doctor via video or secure message",
  },
];

export default function SidePanel() {
  return (
    <div
      className="w-1/2 bg-[var(--dark-navy)] p-10 flex flex-col justify-between relative overflow-hidden flex-shrink-0 border-r border-gray-200"
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: "rgba(18,146,238,0.15)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "-60px",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background: "rgba(18,146,238,0.1)",
          pointerEvents: "none",
        }}
      />

      {/* Brand */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            background: "var(--primary-blue)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Cross size={22} color="#fff" strokeWidth={2.5} />
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "22px",
            color: "#fff",
            fontWeight: 600,
            marginBottom: "6px",
          }}
        >
          MediConnect
        </h2>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.3px" }}>
          Integrated Health Platform
        </p>
      </div>

      {/* Features */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {FEATURES.map(({ Icon, title, desc }) => (
          <div
            key={title}
            style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "22px" }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(18,146,238,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: "2px",
              }}
            >
              <Icon size={15} color="var(--primary-blue)" />
            </div>
            <div>
              <p className="text-white text-xl font-medium">
                {title}
              </p>
              <p className="text-gray-500 text-base line-height-5">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p style={{ position: "relative", zIndex: 1, fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
        © 2026 MediConnect. All rights reserved.
      </p>
    </div>
  );
}