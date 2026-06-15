export function MiniInfo({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 13,
        background: "rgba(255,255,255,.09)",
        border: "1px solid rgba(255,255,255,.12)",
      }}
    >
      <span
        style={{
          color: "rgba(255,255,255,.72)",
          fontSize: 12.5,
          fontWeight: 800,
        }}
      >
        {label}
      </span>

      <strong style={{ color: "#fff", fontSize: 14 }}>{value}</strong>
    </div>
  );
}