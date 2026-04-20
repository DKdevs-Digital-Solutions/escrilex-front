import React from "react";

function getInitial(name?: string) {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase();
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }

  const colors = [
    "#2563eb",
    "#16a34a",
    "#9333ea",
    "#ea580c",
    "#dc2626",
    "#0891b2",
    "#7c3aed",
  ];

  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({ name }: { name?: string }) {
  const bg = stringToColor(name || "");

  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        background: bg,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: 14,
        letterSpacing: "0.02em",
        flexShrink: 0,
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
      }}
    >
      {getInitial(name)}
    </div>
  );
}