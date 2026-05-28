import React from "react";
import { X } from "lucide-react";

import {
  avatarStyle,
  clearButtonStyle,
  drawerFieldLabelStyle,
  drawerFieldStyle,
  drawerFieldValueStyle,
  drawerFieldsGridStyle,
  drawerHeaderActionsStyle,
  drawerHeaderStyle,
  drawerKickerStyle,
  drawerOverlayStyle,
  drawerSectionStyle,
  drawerSectionTitleStyle,
  drawerStyle,
  drawerSubtitleStyle,
  drawerTitleStyle,
  mutedTextStyle,
  selectPillStyle,
  statusBadgeStyle,
  textareaCellStyle,
} from "../styles/ExpectationMatrix.styled";

export function MatrixDrawer({
  row,
  columns,
  users,
  onClose,
}: any) {
  const companyColumns = columns
    .filter((c: any) =>
      [
        "codigo",
        "empresa",
        "cnpjCpf",
        "grupo",
        "matrizFilial",
        "tributacao",
        "ramo",
        "perfilComercial",
        "status",
      ].includes(c.key)
    )
    .map((column: any) => ({
      ...column,
      label: column.key === "status" ? "Situação" : column.label,
    }));

  const responsibleColumns = columns.filter((c: any) => c.type === "user");

  const otherColumns = columns.filter(
    (c: any) =>
      !companyColumns.some((cc: any) => cc.key === c.key) &&
      !responsibleColumns.some((rc: any) => rc.key === c.key)
  );

  return (
    <div style={drawerOverlayStyle} onClick={onClose}>
      <div style={drawerStyle} onClick={(e) => e.stopPropagation()}>
        <div style={drawerHeaderStyle}>
          <div>
            <div style={drawerKickerStyle}>Registro selecionado</div>

            <h2 style={drawerTitleStyle}>{row.empresa || row.razaoSocial || "--"}</h2>

            <p style={drawerSubtitleStyle}>
              {row.codigo || row.cod || "--"} • {row.cnpjCpf || row.cnpj || "--"}
            </p>
          </div>

          <div style={drawerHeaderActionsStyle}>
            <button onClick={onClose} style={clearButtonStyle}>
              <X size={16} />
            </button>
          </div>
        </div>

        <DrawerSection
          title="Empresa"
          columns={companyColumns}
          row={row}
          users={users}
        />

        <DrawerSection
          title="Responsáveis"
          columns={responsibleColumns}
          row={row}
          users={users}
        />

        <DrawerSection
          title="Demais informações"
          columns={otherColumns}
          row={row}
          users={users}
        />
      </div>
    </div>
  );
}

function DrawerSection({ title, columns, row, users }: any) {
  if (!columns.length) return null;

  return (
    <div style={drawerSectionStyle}>
      <h3 style={drawerSectionTitleStyle}>{title}</h3>
      <br />

      <div style={drawerFieldsGridStyle}>
        {columns.map((column: any) => (
          <div key={column.key} style={drawerFieldStyle}>
            <span style={drawerFieldLabelStyle}>{column.label}</span>

            <div style={drawerFieldValueStyle}>
              {renderCell(row, column, users)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderCell(item: any, column: any, users: any[]) {
  const value = item[column.key];

  if (column.type === "user") {
    const user = users?.find((u: any) => u.id === value);

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

function getInitials(name?: string) {
  return (name || "?")
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}