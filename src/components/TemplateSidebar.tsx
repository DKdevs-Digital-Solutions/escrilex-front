import React, { useEffect, useState } from "react";
import { Badge, Loading, Empty } from "../ui";
import { Plus, LayoutTemplate } from "lucide-react";

function ActionBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
        onClick={onClick}
        style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            padding: "13px 14px",
            fontSize: 14.5,
            fontWeight: 700,
            borderRadius: 12,
            border: "1px solid",
            background: "#BB9F58",
            color: "#fff",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.16s ease",
            width: "100%",
            
        }}>
        {children}
        </button>
  );
}

type Props = {
  templates: any[];
  loading: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
};

export function TemplateSidebar({
  templates,
  loading,
  selectedId,
  onSelect,
  onCreate,
}: Props) {

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 999);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 999);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);



  return (
    <div
      style={{
        width: isMobile ? "100%" : 300,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #fcfdff 100%)",
          border: "1px solid #e5e7eb",
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 18px 16px",
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
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 900,
                  color: "#0f172a",
                  letterSpacing: "-0.03em",
                }}
              >
                Processos
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontSize: 12.5,
                  color: "#64748b",
                  lineHeight: 1.5,
                }}
              >
                Gerencie os modelos de checklist da operação.
              </div>
            </div>

            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "rgba(37,99,235,0.10)",
                border: "1px solid rgba(37,99,235,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#2563eb",
                flexShrink: 0,
              }}
            >
              <LayoutTemplate size={18} strokeWidth={2.2} style={{color:"#BB9F58"}} />
            </div>
          </div>

          <div style={{ marginTop: 14, width: "100%" }}>
            <ActionBtn onClick={onCreate}>
              <Plus size={14} strokeWidth={3} />
              Novo processo
            </ActionBtn>
          </div>
        </div>

        <div style={{ padding: 10, maxHeight: "75vh", overflowY: "auto" }}>
          {loading ? (
            <Loading message="Carregando processos..." />
          ) : !templates.length ? (
            <div style={{ padding: 18 }}>
              <Empty message="Nenhum processo cadastrado." />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {templates.map((t) => {
                const active = t.id === selectedId;

                return (
                  <button
                    key={t.id}
                    onClick={() => onSelect(t.id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "14px 14px",
                      borderRadius: 14,
                      border: `1px solid ${active ? "#93c5fd" : "#e5e7eb"}`,
                      background: active
                        ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
                        : "#fff",
                      cursor: "pointer",
                      transition: "all 0.16s ease",
                      fontFamily: "inherit",
                      boxShadow: active
                        ? "0 8px 18px rgba(37,99,235,0.10)"
                        : "0 2px 8px rgba(15,23,42,0.03)",
                    }}
                    onMouseOver={(e) => {
                      if (!active) {
                        e.currentTarget.style.borderColor = "#cbd5e1";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!active) {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 13.5,
                        color: active ? "#1d4ed8" : "#111827",
                        marginBottom: 8,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {t.name}
                    </div>

                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <Badge
                        label={t.type}
                        variant={t.type === "ENTRADA" ? "green" : "blue"}
                      />
                      <Badge label={`v${t.version}`} variant="gray" />
                      {!t.active && <Badge label="Inativo" variant="red" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}