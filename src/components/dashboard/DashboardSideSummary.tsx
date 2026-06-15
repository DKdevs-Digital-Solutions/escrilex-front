import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { MiniInfo } from "./MiniInfo";

export function DashboardSideSummary({
  tipoResumo,
  setTipoResumo,
  isEntrada,
  resumoAtual,
  motivosAtual,
  loading,
  MotivosAgrupadosInfo,
}: any) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 20,
        padding: 22,
        background: "linear-gradient(135deg, #0f172a 0%, #012942 100%)",
        color: "#fff",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 130,
          height: 130,
          borderRadius: "50%",
          background: "rgba(56,189,248,.16)",
        }}
      />

      <div
        style={{
          display: "inline-flex",
          padding: 5,
          borderRadius: 16,
          background: "rgba(255,255,255,.08)",
          border: "1px solid rgba(255,255,255,.12)",
          backdropFilter: "blur(10px)",
          marginBottom: 18,
          gap: 4,
          width: "100%",
        }}
      >
        <button
          onClick={() => setTipoResumo("entrada")}
          style={{
            border: 0,
            cursor: "pointer",
            borderRadius: 12,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: 12,
            fontWeight: 900,
            transition: "all .2s ease",
            width: "50%",
            background:
              tipoResumo === "entrada"
                ? "linear-gradient(135deg,#22c55e,#16a34a)"
                : "transparent",
            color:
              tipoResumo === "entrada" ? "#fff" : "rgba(255,255,255,.75)",
            boxShadow:
              tipoResumo === "entrada"
                ? "0 8px 24px rgba(34,197,94,.35)"
                : "none",
          }}
        >
          {tipoResumo === "entrada" && <ArrowUpRight size={15} />}
          Entradas
        </button>

        <button
          onClick={() => setTipoResumo("saida")}
          style={{
            border: 0,
            cursor: "pointer",
            borderRadius: 12,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: 12,
            fontWeight: 900,
            transition: "all .2s ease",
            width: "50%",
            background:
              tipoResumo === "saida"
                ? "linear-gradient(135deg,#ef4444,#dc2626)"
                : "transparent",
            color: tipoResumo === "saida" ? "#fff" : "rgba(255,255,255,.75)",
            boxShadow:
              tipoResumo === "saida"
                ? "0 8px 24px rgba(239,68,68,.35)"
                : "none",
          }}
        >
          {tipoResumo === "saida" && <ArrowDownLeft size={15} />}
          Cancelamentos
        </button>
      </div>

      <div style={{ position: "relative" }}>
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900 }}>
          {isEntrada ? "Resumo de entradas" : "Resumo de cancelamentos"}
        </h3>

        <p
          style={{
            margin: "8px 0 18px",
            color: "rgba(255,255,255,.72)",
            fontSize: 13,
            lineHeight: 1.55,
          }}
        >
          Informações consolidadas do período selecionado.
        </p>

        <div
          style={{
            padding: 15,
            borderRadius: 16,
            background: "rgba(255,255,255,.10)",
            border: "1px solid rgba(255,255,255,.14)",
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 12, color: "#cbd5e1" }}>
            {isEntrada ? "Entradas" : "Cancelamentos"}
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 34,
              fontWeight: 950,
              letterSpacing: -1,
              color: "#86efac",
            }}
          >
            {loading ? "..." : `${resumoAtual?.percentual ?? 0}%`}
          </div>

          <div
            style={{
              marginTop: 10,
              width: "100%",
              height: 8,
              borderRadius: 999,
              background: "rgba(255,255,255,.14)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${resumoAtual?.percentual ?? 0}%`,
                height: "100%",
                borderRadius: 999,
                background: "linear-gradient(90deg, #22c55e, #7dd3fc)",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: isEntrada ? 19 : 9,
            top: isEntrada ? "7px" : "0px",
            position: "relative",
          }}
        >
          {!isEntrada && MotivosAgrupadosInfo && (
            <MotivosAgrupadosInfo motivos={motivosAtual} />
          )}

          <MiniInfo label="Quantidade" value={resumoAtual?.quantidade ?? 0} />

          <MiniInfo
            label="Total de empresas"
            value={resumoAtual?.totalEmpresas ?? 0}
          />
        </div>
      </div>
    </div>
  );
}