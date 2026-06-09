import React from "react";
import { Badge } from "../ui";
import { ArrowLeft, Building2 } from "lucide-react";

function SituacaoBadge({ v }: { v?: string }) {
  if (!v) return <span style={{ color: "#d1d5db" }}>—</span>;

  const variant =
    v === "SAIDA" || v === "ENCERRADA"
      ? "red"
      : v === "ATIVA"
      ? "green"
      : "yellow";

  return <Badge label={v} variant={variant} />;
}

type Props = {
  company: any;
  onBack: () => void;
};

export function CompanyDetailHeader({ company, onBack }: Props) {
  const titulo = company.nomeFantasia || company.razaoSocial || company.cnpj;
  const subtitulo =
    company.nomeFantasia && company.razaoSocial && company.nomeFantasia !== company.razaoSocial
      ? company.razaoSocial
      : null;

const normalizedStatus = String(company?.situacao || "").toUpperCase();

const isBlocked = normalizedStatus === "BLOQUEADO";

const blockedBy =
  company?.bloqueadoPor ||
  company?.blockedBy?.name ||
  company?.blockedByName;

const blockedAt =
  company?.bloqueadoAt ||
  company?.blockedAt ||
  company?.dataBloqueio;      

  const blockedRef = React.useRef<HTMLDivElement>(null);

const [blockedTooltip, setBlockedTooltip] =
  React.useState<{
    top: number;
    left: number;
  } | null>(null);


function openBlockedTooltip() {
  const rect = blockedRef.current?.getBoundingClientRect();
  if (!rect) return;

  const tooltipWidth = 260;
  const margin = 12;

  setBlockedTooltip({
    top: rect.bottom + 8,
    left: Math.max(
      margin,
      Math.min(rect.left, window.innerWidth - tooltipWidth - margin)
    ),
  });
}

  return (
    <div
      style={{
        marginBottom: 22,
        padding: "20px 22px",
        borderRadius: 20,
        border: "2px solid #e2e8f0",
        background:
          "linear-gradient(135deg, #ffffff 0%, #f8fbff 55%, #eef6ff 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 16,
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
            transition: "all 0.16s ease",
            flexShrink: 0,
            boxShadow: "0 4px 10px rgba(15,23,42,0.04)",
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
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
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
                    fontSize: 28,
                    fontWeight: 900,
                    color: "#0f172a",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.05,
                  }}
                >
                  {titulo}
                </h1>

                {subtitulo && (
                  <span
                    style={{
                      fontSize: 14,
                      color: "#64748b",
                      fontWeight: 600,
                    }}
                  >
                    {subtitulo}
                  </span>
                )}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
             <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  }}
>
  {isBlocked ? (
    <div
  ref={blockedRef}
  onMouseEnter={openBlockedTooltip}
  onMouseLeave={() => setBlockedTooltip(null)}
  style={{
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 12px",
    borderRadius: 15,

    background:
      "linear-gradient(135deg,#fff7ed,#ffffff)",

    border:
      "1px solid rgba(217,119,6,.22)",

    cursor: "help",
  }}
>
  <div
    style={{
      width: 28,
      height: 28,
      borderRadius: 10,

      display: "grid",
      placeItems: "center",

      background:
        "linear-gradient(135deg,#f59e0b,#b45309)",

      color: "#fff",
      fontWeight: 950,

      boxShadow:
        "0 8px 18px rgba(217,119,6,.25)",
    }}
  >
    !
  </div>


  <strong
    style={{
      fontSize: 11,
      fontWeight: 950,
      color: "#92400e",
      textTransform: "uppercase",
      letterSpacing: ".1em",
    }}
  >
    Bloqueado
  </strong>


  {blockedTooltip && (
    <div
      style={{
        position: "fixed",
        top: blockedTooltip.top,
        left: blockedTooltip.left,

        zIndex: 999999,

        width: 260,
        padding: 14,

        borderRadius: 18,

        background:
          "rgba(15,23,42,.98)",

        color: "#fff",

        boxShadow:
          "0 25px 70px rgba(15,23,42,.35)",

        border:
          "1px solid rgba(255,255,255,.12)",
      }}
    >

      <div
        style={{
          fontSize: 11,
          fontWeight: 950,
          color: "#fbbf24",
          letterSpacing: ".12em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        Dados do bloqueio
      </div>


      <div
        style={{
          display: "grid",
          gap: 10,
          fontSize: 12,
        }}
      >

        <div>
          <span
            style={{
              color: "#94a3b8",
              display: "block",
              marginBottom: 3,
            }}
          >
            Bloqueado por
          </span>

          <strong>
            {blockedBy || "Não informado"}
          </strong>
        </div>


        <div>
          <span
            style={{
              color: "#94a3b8",
              display: "block",
              marginBottom: 3,
            }}
          >
            Data do bloqueio
          </span>

          <strong>
            {blockedAt
              ? new Date(blockedAt)
                  .toLocaleDateString("pt-BR")
              : "Sem data"}
          </strong>
        </div>

      </div>
    </div>
  )}
</div>
  ) : (
    <>
      <SituacaoBadge v={company.situacao} />
    </>
  )}
</div>

            
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              marginTop: 14,
            }}
          >
            {company.cnpj && (
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
                }}
              >
                {company.cnpj}
              </span>
            )}

            {company.cod && (
              <span
                style={{
                  fontSize: 12.5,
                  color: "#475569",
                  fontWeight: 700,
                  padding: "5px 8px",
                  borderRadius: 8,
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  whiteSpace: "nowrap",
                }}
              >
                Cod. {company.cod}
              </span>
            )}

            {company.nomeFantasia && company.razaoSocial && (
              <span
                style={{
                  fontSize: 13,
                  color: "#64748b",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                {company.nomeFantasia}
              </span>
            )}

              {company.perfil && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 9px",
                    borderRadius: 999,
                    fontSize: 11.5,
                    fontWeight: 800,
                    background: "#1e293b",
                    color: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  {company.perfil}
                </span>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}