import { Activity, ShieldCheck, Sparkles } from "lucide-react";

export function DashboardHeader() {
  return (
    <div
      className="dashboard-header"
      style={{
        padding: 28,
        background: "linear-gradient(135deg, #012942 0%, #012942 55%, #012942 100%)",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        gap: 22,
        borderRadius: 8,
      }}
    >
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            display: "grid",
            placeItems: "center",
            background:
              "linear-gradient(135deg, rgba(56,189,248,.28), rgba(34,197,94,.18))",
            border: "1px solid rgba(255,255,255,.28)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,.18), 0 14px 30px rgba(56,189,248,.18)",
          }}
        >
          <Activity size={27} color="#7dd3fc" />
        </div>

        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 8,
              padding: "4px 9px",
              borderRadius: 999,
              background: "rgba(255,255,255,.12)",
              border: "1px solid rgba(255,255,255,.18)",
              color: "#fde68a",
              fontSize: 11,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            <Sparkles size={12} color="#facc15" />
            Dashboard executivo
          </div>

          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900 }}>
            Visão geral
          </h1>

          <p
            style={{
              margin: "6px 0 0",
              color: "rgba(255,255,255,.76)",
              fontSize: 13.5,
            }}
          >
            Acompanhe os principais indicadores da carteira de clientes.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          alignSelf: "flex-start",
          padding: "8px 12px",
          borderRadius: 999,
          background: "rgba(16,185,129,.16)",
          color: "#d1fae5",
          border: "1px solid rgba(167,243,208,.32)",
          fontSize: 12,
          fontWeight: 900,
          whiteSpace: "nowrap",
        }}
      >
        <ShieldCheck size={15} color="#00ff7b" />
        Dados em tempo real
      </div>
    </div>
  );
}