import React, { useEffect, useState } from "react";
import { Input } from "../ui";
import { SlidersHorizontal, Search, History } from "lucide-react";
import { useAudit } from "../hooks/useAudit";
import { AuditList } from "../components/AuditList";

export function Audit() {
  const [filters, setFilters] = useState({ entity: "", action: "" });
  const { items, loading, loadAudit } = useAudit();

  useEffect(() => {
    loadAudit();
  }, [loadAudit]);

  function handleFilter() {
    loadAudit(filters);
  }

  if (loading && !items.length) {
    return (
      <div
        style={{
          height: "100%",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "4px solid #e5e7eb",
              borderTop: "4px solid #2563eb",
              animation: "spin 0.9s linear infinite",
            }}
          />

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Carregando auditoria
            </div>

            <div
              style={{
                marginTop: 4,
                fontSize: 13,
                color: "#64748b",
              }}
            >
              Aguarde enquanto buscamos os registros...
            </div>
          </div>
        </div>

        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          marginBottom: 20,
          padding: "22px 24px",
          borderRadius: 20,
          border: "1px solid #e2e8f0",
          background:
            "linear-gradient(135deg, #ffffff 0%, #f8fbff 55%, #eef6ff 100%)",
          boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 999,
                background: "#eff6ff",
                color: "#1d4ed8",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                border: "1px solid #bfdbfe",
                marginBottom: 12,
              }}
            >
              Monitoramento
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 28,
                lineHeight: 1.1,
                fontWeight: 900,
                color: "#0f172a",
                letterSpacing: "-0.03em",
              }}
            >
              Auditoria do sistema
            </h1>

            <p
              style={{
                margin: "10px 0 0",
                fontSize: 14.5,
                color: "#64748b",
                maxWidth: 700,
                lineHeight: 1.6,
              }}
            >
              Acompanhe o histórico de ações, acessos e alterações realizadas
              dentro da plataforma.
            </p>
          </div>

          <div
            style={{
              padding: "16px 18px",
              borderRadius: 14,
              background: "#fff",
              border: "1px solid #e5e7eb",
              minWidth: 210,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Total de eventos
                </div>

                <div
                  style={{
                    marginTop: 8,
                    fontSize: 30,
                    fontWeight: 900,
                    color: "#0f172a",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  {items.length}
                </div>

                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12.5,
                    color: "#64748b",
                    fontWeight: 600,
                  }}
                >
                  {items.length === 1
                    ? "Último registro encontrado"
                    : `Últimos ${items.length} registros encontrados`}
                </div>
              </div>

              <div
                style={{
                  width: 42,
                  height: 42,
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
                <History size={18} strokeWidth={2.2} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 18,
          padding: "18px 20px",
          marginBottom: 20,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "flex-end",
          boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
        }}
      >
        <div style={{ width: "100%", marginBottom: 4 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 800,
              color: "#334155",
            }}
          >
            <Search size={15} strokeWidth={2.2} />
            Filtros de auditoria
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 12.5,
              color: "#64748b",
            }}
          >
            Refine a visualização por entidade ou por ação registrada.
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 180 }}>
          <Input
            label="Entidade"
            placeholder="Ex: Company, User..."
            value={filters.entity}
            onChange={(e) =>
              setFilters((f) => ({ ...f, entity: e.target.value }))
            }
          />
        </div>

        <div style={{ flex: 1, minWidth: 180 }}>
          <Input
            label="Ação"
            placeholder="Ex: USER_CREATE..."
            value={filters.action}
            onChange={(e) =>
              setFilters((f) => ({ ...f, action: e.target.value }))
            }
          />
        </div>

        <button
          onClick={handleFilter}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "11px 16px",
            fontSize: 13.5,
            fontWeight: 700,
            borderRadius: 12,
            border: "1px solid #cbd5e1",
            background: "#fff",
            color: "#334155",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.16s ease",
            height: 44,
            boxShadow: "0 4px 12px rgba(15,23,42,0.04)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#f8fafc";
            e.currentTarget.style.borderColor = "#94a3b8";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.borderColor = "#cbd5e1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <SlidersHorizontal size={15} strokeWidth={2.1} />
          Aplicar filtros
        </button>
      </div>

      <AuditList items={items} />
    </div>
  );
}