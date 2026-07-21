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

    if (!user) return <span style={mutedTextStyle}>-</span>;

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={avatarStyle}>{getInitials(user.name)}</span>

        <div>
          <strong>{user.name}</strong>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
            {user.sector?.name || ""}
          </div>
        </div>
      </div>
    );
  }

  if (column.type === "date") {
    return value ? (
      new Date(value).toLocaleDateString("pt-BR")
    ) : (
      <span style={mutedTextStyle}>-</span>
    );
  }

  if (column.key === "status") {
    return <StatusBadge status={value} active={item.active} />;
  }

  if (column.type === "select") {
    return <SelectPill value={value} />;
  }

  if (column.type === "textarea") {
    return <span style={textareaCellStyle}>{value || "-"}</span>;
  }

  return value || <span style={mutedTextStyle}>-</span>;
}

function SelectPill({ value }: { value: string }) {
  if (!value) return <span style={mutedTextStyle}>-</span>;

  return <span style={selectPillStyle}>{value}</span>;
}

function StatusBadge({
  status,
  active,
}: {
  status: string;
  active: boolean;
}) {
  const isActive = active === true;

  return (
   <span
  style={{
    ...statusBadgeStyle,

    background: "rgba(245,158,11,.12)",
    border: "1px solid rgba(245,158,11,.22)",
    color: "#b45309",
  }}
>
  <span
    style={{
      width: 7,
      height: 7,
      borderRadius: 999,
      background: "#f59e0b",
      boxShadow: "0 0 0 4px rgba(245,158,11,.16)",
    }}
  />

  {status || "-"}
</span>
  );
}