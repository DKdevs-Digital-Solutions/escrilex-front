import React from "react";
import { Badge, Toggle } from "../ui";
import { Layers, RefreshCw, FileText } from "lucide-react";

function HeaderBtn({
  children,
  onClick,
  variant = "secondary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "secondary" | "primary";
}) {
  const styles =
    variant === "primary"
      ? {
          bg: "#BB9F58",
          color: "#fff",
          border: "#ccc",
        }
      : {
          bg: "#fff",
          color: "#334155",
          border: "#e2e8f0",
          hoverBg: "#f8fafc",
        };

  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        height: 40,
        padding: "0 14px",
        fontSize: 13,
        fontWeight: 700,
        borderRadius: 12,
        border: variant === 'primary' ? '1px solid' : '2px solid #ccc',
        background: styles.bg,
        color: styles.color,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.16s ease",
        whiteSpace: "nowrap",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = styles.bg;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {children}
    </button>
  );
}

type Props = {
  template: any;
  onToggleActive: (value: boolean) => void;
  onNewVersion: () => void;
  onAddSection: () => void;
};

export function TemplateEditorHeader({
  template,
  onToggleActive,
  onNewVersion,
  onAddSection,
}: Props) {
  return (
    <div
      style={{
        marginBottom: 20,
        borderRadius: 20,
        border: "1px solid #e5e7eb",
        background: "#fff",
        boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
        overflow: "hidden",
      }}
    >
      {/* faixa superior */}
      <div
        style={{
          padding: "18px 22px",
          borderBottom: "1px solid #eef2f7",
          background:
            "linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(255,255,255,1) 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          {/* lado esquerdo */}
          <div style={{ minWidth: 260 }}>
         

            <h2
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 900,
                color: "#111827",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              {template.name}
            </h2>

            <div
              style={{
                marginTop: 10,
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              <Badge
                label={template.type}
                variant={template.type === "ENTRADA" ? "green" : "blue"}
              />
              <Badge label={`Versão ${template.version}`} variant="gray" />
              <Badge
                label={template.active ? "Ativo" : "Inativo"}
                variant={template.active ? "green" : "red"}
              />
            </div>
          </div>

          {/* lado direito */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 12,
              minWidth: 280,
              flex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 12,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: "#475569",
                  }}
                >
                  Status do template
                </span>

                <Toggle
                  checked={!!template.active}
                  onChange={onToggleActive}
                  label={template.active ? "Ativo" : "Inativo"}
                />
              </div>

              <HeaderBtn onClick={onNewVersion}>
                <RefreshCw size={14} strokeWidth={2.3} />
                Nova versão
              </HeaderBtn>

              <HeaderBtn onClick={onAddSection} variant="primary">
                <Layers size={14} strokeWidth={2.3} />
                Nova seção
              </HeaderBtn>
            </div>
          </div>
        </div>
      </div>

      {/* faixa inferior mais limpa */}
      <div
        style={{
          padding: "14px 22px",
          background: "#fffdf5",
          borderTop: "1px solid #fef3c7",
        }}
      >
        <div
          style={{
            fontSize: 12.5,
            color: "#92400e",
            lineHeight: 1.6,
          }}
        >
          <strong>Prazo:</strong> use <strong>D+N</strong> para contar dias após a
          data âncora, ou <strong>Dia X do mês seguinte</strong> para definir um
          vencimento fixo no próximo mês.
        </div>
      </div>
    </div>
  );
}