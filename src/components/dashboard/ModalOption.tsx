export function ModalOption({
  active,
  label,
  value,
  color,
  onClick,
}: {
  active: boolean;
  label: string;
  value: number;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: active ? `2px solid ${color}` : "1px solid #e2e8f0",
        background: active ? "#f8fafc" : "#fff",
        borderRadius: 18,
        padding: 16,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <span
        style={{
          display: "block",
          color: "#64748b",
          fontSize: 12,
          fontWeight: 900,
          marginBottom: 6,
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color,
          fontSize: 26,
          fontWeight: 950,
        }}
      >
        {value.toLocaleString("pt-BR")}
      </strong>
    </button>
  );
}