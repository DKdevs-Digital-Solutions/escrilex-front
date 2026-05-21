import {
  avatarStyle,
  mutedTextStyle,
  selectPillStyle,
  statusBadgeStyle,
  textareaCellStyle,
} from "../../../styles/ExpectationMatrix.styled";
import { getInitials } from "./matrixHelpers";

export function renderCell(item: any, column: any, users: any[]) {
  const value = item[column.key];

  if (column.type === "user") {
    const user = users.find((u: any) => u.id === value);

    if (!user) return <span style={mutedTextStyle}>—</span>;

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={avatarStyle}>{getInitials(user.name)}</span>

        <div>
          <strong>{user.name}</strong>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
            {user.sector?.name || user.email}
          </div>
        </div>
      </div>
    );
  }

  if (column.type === "date") {
    return value ? (
      new Date(value).toLocaleDateString("pt-BR")
    ) : (
      <span style={mutedTextStyle}>—</span>
    );
  }

  if (column.key === "status") {
    return <StatusBadge status={value} />;
  }

  if (column.type === "select") {
    return <SelectPill value={value} />;
  }

  if (column.type === "textarea") {
    return <span style={textareaCellStyle}>{value || "—"}</span>;
  }

  return value || <span style={mutedTextStyle}>—</span>;
}

function SelectPill({ value }: { value: string }) {
  if (!value) return <span style={mutedTextStyle}>—</span>;

  return <span style={selectPillStyle}>{value}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status?.toUpperCase();
  const isActive = normalized === "ATIVA" || normalized === "ATIVO";

  return (
    <span
      style={{
        ...statusBadgeStyle,
        background: isActive ? "rgba(34,197,94,.12)" : "rgba(239,68,68,.10)",
        border: isActive
          ? "1px solid rgba(34,197,94,.20)"
          : "1px solid rgba(239,68,68,.18)",
        color: isActive ? "#15803d" : "#dc2626",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: isActive ? "#22c55e" : "#ef4444",
        }}
      />

      {status || "—"}
    </span>
  );
}