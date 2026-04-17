import Link from "next/link";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const base =
  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-blue)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary: "text-white hover:opacity-90",
  outline:
    "border border-[var(--primary-blue)] bg-transparent font-medium text-[var(--primary-blue)] shadow-none transition-colors duration-200 hover:bg-[var(--hero-bg)]",
};

export default function Button({
  href,
  variant = "primary",
  className,
  style,
  children,
  ...props
}) {
  const mergedClassName = cx(base, variants[variant], className);
  const mergedStyle =
    variant === "primary"
      ? { backgroundColor: "var(--primary-blue)", ...style }
      : style;

  if (href) {
    return (
      <Link
        href={href}
        className={mergedClassName}
        style={mergedStyle}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={mergedClassName} style={mergedStyle} {...props}>
      {children}
    </button>
  );
}

