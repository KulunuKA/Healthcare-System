"use client";

import { Loader2 } from "lucide-react";

export default function Button({
  children,
  onClick,
  variant = "primary",
  loading = false,
  disabled = false,
  type = "button",
  fullWidth = false,
  className = "",
}) {
  const base = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: fullWidth ? "100%" : "auto",
    padding: "11px 20px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "inherit",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    border: "none",
    transition: "all 0.18s ease",
    letterSpacing: "0.2px",
    opacity: disabled || loading ? 0.7 : 1,
  };

  const variants = {
    primary: {
      background: "var(--primary-blue)",
      color: "#fff",
    },
    outline: {
      background: "#fff",
      color: "var(--dark-navy)",
      border: "1.5px solid #e2e8f0",
    },
    danger: {
      background: "#e24b4a",
      color: "#fff",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          if (variant === "primary") e.currentTarget.style.background = "#0e82d6";
          if (variant === "outline") e.currentTarget.style.borderColor = "#bbc6d8";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          if (variant === "primary") e.currentTarget.style.background = "var(--primary-blue)";
          if (variant === "outline") e.currentTarget.style.borderColor = "#e2e8f0";
        }
      }}
      onMouseDown={(e) => {
        if (!disabled && !loading) e.currentTarget.style.transform = "scale(0.98)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : null}
      {children}
    </button>
  );
}