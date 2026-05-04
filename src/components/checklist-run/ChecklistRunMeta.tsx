import React from "react";
import { FileText, CalendarClock, TimerReset } from "lucide-react";

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 14,
        background: "#fff",
        border: "1px solid #e2e8f0",
        minWidth: 200,
        flex: "1 1 200px",
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f1f5f9",
          border: "1px solid #e2e8f0",
          color: "#64748b",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 800,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 2,
          }}
        >
          {label}
        </div>

        <div
          style={{
            fontSize: 13.5,
            fontWeight: 700,
            color: "#0f172a",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {value ?? <span style={{ color: "#cbd5e1" }}>—</span>}
        </div>
      </div>
    </div>
  );
}

export function ChecklistRunMeta({ run }: { run: any }) {
  return (
    <div
      style={{
        marginBottom: 26,
        padding: "16px",
        borderRadius: 18,
        background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
        border: "1px solid #e2e8f0",
        display: "flex",
        gap: 14,
        flexWrap: "wrap",
      }}
    >
      <MetaItem
        icon={<FileText size={18} color="green" />}
        label="Template"
        value={
          run.template?.name
            ? `${run.template.name} v${run.template.version ?? "—"}`
            : "—"
        }
      />

      <MetaItem
        icon={<CalendarClock size={18} color="blue"/>}
        label="Criado em"
        value={
          run.createdAt
            ? new Date(run.createdAt).toLocaleString("pt-BR")
            : "—"
        }
      />

      <MetaItem
        icon={<TimerReset size={18} color="orange"/>}
        label="Âncora"
        value={
          run.anchorAt
            ? new Date(run.anchorAt).toLocaleString("pt-BR")
            : "Não definida"
        }
      />
    </div>
  );
}