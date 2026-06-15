import React from "react";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "grid", gap: 7 }}>
      <span
        style={{
          color: "#334155",
          fontSize: 12.5,
          fontWeight: 900,
        }}
      >
        {label}
      </span>

      {children}
    </label>
  );
}