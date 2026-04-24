import React from "react";
import { ArrowLeft, ClipboardCheck, Building2, CheckCircle2 } from "lucide-react";

export function ChecklistRunHeader({
  run,
  pct,
  doneItems,
  totalItems,
  onBack,
}: {
  run: any;
  pct: number;
  doneItems: number;
  totalItems: number;
  onBack: () => void;
}) {
  const title = run.type === "ENTRADA" ? "Checklist de Entrada" : "Checklist de Saída";
  const companyName =
    run.company?.nomeFantasia ??
    run.company?.razaoSocial ??
    "(sem nome)";

  const companySub =
    run.company?.nomeFantasia &&
    run.company?.razaoSocial &&
    run.company?.nomeFantasia !== run.company?.razaoSocial
      ? run.company.razaoSocial
      : null;

  const progressColor = pct === 100 ? "#16a34a" : "#2563eb";
  const progressBg = pct === 100 ? "#f0fdf4" : "#eff6ff";
  const progressBorder = pct === 100 ? "#bbf7d0" : "#bfdbfe";

  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 999);

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 999);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      style={{
        marginBottom: 22,
        padding: isMobile ? "18px 14px" : "22px 24px",
        borderRadius: isMobile ? 18 : 22,
        border: "1px solid #e2e8f0",
        background: "linear-gradient(135deg, #ffffff 0%, #f8fbff 55%, #eef6ff 100%)",
        boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 18,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            flex: 1,
            minWidth: 0,
            width: "100%",  
          }}
        >
          <button
            onClick={onBack}
            title="Voltar"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              background: "#fff",
              color: "#64748b",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 10px rgba(15,23,42,0.04)",
              transition: "all 0.16s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#f8fafc";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <ArrowLeft size={17} strokeWidth={2.5} />
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            

            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: isMobile ? 22 : 28,
                  fontWeight: 900,
                  color: "#0f172a",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                }}
              >
                {title}
              </h1>

              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  color: "#64748b",
                  fontSize: 12,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                <Building2 size={13} />
                {run.type}
              </span>
            </div>

            <div style={{ marginTop: 10 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0f172a",
                  lineHeight: 1.35,
                  wordBreak: "break-word",
                }}
              >
                {companyName}
              </div>

              <div
                style={{
                  marginTop: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {run.company?.cnpj && (
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 12.5,
                      color: "#64748b",
                      padding: "5px 8px",
                      borderRadius: 8,
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      fontWeight: 700,
                      wordBreak: "break-word",
                      maxWidth: "100%",
                    }}
                  >
                    {run.company.cnpj}
                  </span>
                )}

                {companySub && (
                  <span
                    style={{
                      fontSize: 12.5,
                      color: "#94a3b8",
                      fontWeight: 600,
                    }}
                  >
                    {companySub}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
         style={{
            width: isMobile ? "100%" : "auto",
            minWidth: isMobile ? 0 : 180,
            boxSizing: "border-box",
            padding: "14px 16px",
            borderRadius: 16,
            background: progressBg,
            border: `1px solid ${progressBorder}`,
            textAlign: isMobile ? "left" : "right",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 6,
            }}
          >
            Progresso
          </div>

          <div
            style={{
              fontSize: 30,
              fontWeight: 900,
              letterSpacing: "-0.05em",
              color: progressColor,
              lineHeight: 1,
            }}
          >
            {pct}%
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 12.5,
              color: "#64748b",
              fontWeight: 600,
            }}
          >
            {doneItems} de {totalItems} itens
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "14px 16px",
          borderRadius: 16,
          background: "#ffffffcc",
          border: "1px solid #edf2f7",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 10,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12.5,
              fontWeight: 700,
              color: "#475569",
            }}
          >
            <CheckCircle2 size={14} color={progressColor} />
            Andamento da execução
          </div>

          <div
            style={{
              fontSize: 12.5,
              color: "#64748b",
              fontWeight: 600,
            }}
          >
            Restantes: {Math.max(totalItems - doneItems, 0)}
          </div>
        </div>

        <div
          style={{
            height: 10,
            background: "#e9eef5",
            borderRadius: 999,
            overflow: "hidden",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              borderRadius: 999,
              background:
                pct === 100
                  ? "linear-gradient(90deg, #16a34a 0%, #22c55e 100%)"
                  : "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
              transition: "width 0.45s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}