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
          {value ?? <span style={{ color: "#cbd5e1" }}>-</span>}
        </div>
      </div>
    </div>
  );
}

export function ProcessRunMeta({ run }: { run: any }) {
  const isEntrada = run.type === "ENTRADA";
  const started = Boolean(run.anchorAt);

  // Explica de onde a régua de prazos/notificações parte, conforme o tipo.
  const ruleText = isEntrada
    ? "A contagem de prazos e as notificações começam na data de cadastro da empresa."
    : "A contagem de prazos e as notificações começam quando o status da empresa muda para “Em Saída”.";

  const pendingText = isEntrada
    ? "Aguardando o cadastro da empresa."
    : "Aguardando o status “Em Saída” — nada é cobrado ou notificado até lá.";

  return (
    <div style={{ marginBottom: 26 }}>
      <div
        style={{
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
          label="Processo"
          value={run.template?.name || "-"}
        />

        <MetaItem
          icon={<CalendarClock size={18} color="blue"/>}
          label="Criado em"
          value={
            run.createdAt
              ? new Date(run.createdAt).toLocaleString("pt-BR")
              : "-"
          }
        />

        <MetaItem
          icon={<TimerReset size={18} color={started ? "orange" : "#cbd5e1"} />}
          label="Início da contagem"
          value={
            started
              ? new Date(run.anchorAt).toLocaleString("pt-BR")
              : (isEntrada ? "Aguardando cadastro" : "Aguardando “Em Saída”")
          }
        />
      </div>

      {/* Banner explicando a regra do início da contagem. */}
      <div
        style={{
          marginTop: 10,
          padding: "10px 14px",
          borderRadius: 12,
          background: started ? "#f0fdf4" : "#fffbeb",
          border: `1px solid ${started ? "#bbf7d0" : "#fde68a"}`,
          fontSize: 12.5,
          lineHeight: 1.5,
          color: started ? "#166534" : "#92400e",
        }}
      >
        <strong>{isEntrada ? "Processo de Entrada" : "Processo de Saída"}:</strong>{" "}
        {ruleText}{" "}
        {started
          ? `Iniciada em ${new Date(run.anchorAt).toLocaleDateString("pt-BR")}.`
          : pendingText}
      </div>
    </div>
  );
}