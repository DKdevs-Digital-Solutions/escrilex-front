import React from "react";

export function DashboardCard({
  title,
  value,
  description,
  icon,
  bg,
  color,
  badge,
  badgeBg,
  loading,
  onClick,
}: any) {
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 20,
        padding: 18,
        background: "#fff",
        border: "2px solid #e2e8f0",
        cursor: "pointer",
        transition: "all 0.18s ease, transform 0.15s ease, box-shadow 0.18s ease",
        boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = `1px solid ${color}`;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(59,130,246,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = "1px solid #e2e8f0";
        e.currentTarget.style.boxShadow = "0 1px 2px rgba(15,23,42,0.04)";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 16,
            background: bg,
            color,
            display: "grid",
            placeItems: "center",
          }}
        >
          {React.cloneElement(icon, { color })}
        </div>

        <span
          style={{
            height: 26,
            padding: "0 9px",
            borderRadius: 999,
            display: "inline-flex",
            alignItems: "center",
            background: badgeBg,
            color,
            fontSize: 11,
            fontWeight: 900,
          }}
        >
          {badge}
        </span>
      </div>

      <strong
        style={{
          display: "block",
          color: "#0f172a",
          fontSize: 30,
          fontWeight: 950,
          letterSpacing: -1,
        }}
      >
        {loading ? "..." : value}
      </strong>

      <div
        style={{
          marginTop: 4,
          color: "#334155",
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        {title}
      </div>

      <p
        style={{
          margin: "5px 0 0",
          color: "#64748b",
          fontSize: 12.5,
          lineHeight: 1.45,
        }}
      >
        {description}
      </p>
    </div>
  );
}