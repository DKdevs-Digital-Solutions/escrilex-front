import { Building2, Columns3, FileSpreadsheet } from "lucide-react";
import { CompanyListTable } from "./CompanyListTable";

type Props = {
  items: any[];
  loading: boolean;

  filters?: React.ReactNode;

  visibleColumns: any[];
  users?: any[];

  onOpenCompany: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;

  onOpenColumns?: () => void;
  onExportExcel?: () => void;
};

export function CompanyList({
  items,
  loading,
  filters,
  visibleColumns,
  users = [],
  onOpenCompany,
  onToggleActive,
  onOpenColumns,
  onExportExcel,
}: Props) {
  if (loading) {
    return (
      <div
        style={{
          background: "#fff",
          overflow: "hidden",
        }}
      >
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
              fontSize: 16,
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.02em",
            }}
          >
            Listagem de empresas
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 13,
              color: "#64748b",
            }}
          >
            Carregando os dados da listagem...
          </div>
        </div>

        <div
          style={{
            minHeight: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
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
                  color: "#0f172a",
                  fontWeight: 700,
                }}
              >
                Carregando empresas
              </div>

              <div
                style={{
                  marginTop: 4,
                  fontSize: 13,
                  color: "#64748b",
                  fontWeight: 500,
                }}
              >
                Aguarde enquanto buscamos os registros...
              </div>
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
    <div
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #fcfdff 100%)",
        overflow: "visible",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          padding: "18px 22px",
          borderBottom: "2px solid #e2e8f0",

          background:
            "linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(255,255,255,1) 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 220 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: "#012942",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 18px rgba(1, 41, 66, 0.2)",
                flexShrink: 0,
              }}
            >
              <Building2 size={18} strokeWidth={2.2} />
            </div>

            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#012942",
                  letterSpacing: "-0.02em",
                }}
              >
                Listagem de empresas
              </div>

              <div
                style={{
                  marginTop: 4,
                  fontSize: 13,
                  color: "#546e7a",
                }}
              >
                Visualize os registros cadastrados
              </div>
            </div>
          </div>

          {filters && <div style={filtersBarStyle}>{filters}</div>}

          <div style={toolbarStyle}>
        <div style={toolbarActionsStyle}>
          {onExportExcel && (  
        <button
          onClick={onExportExcel}
          title="Exportar Excel"
          aria-label="Exportar Excel"
          style={{
            width: 40,
            height: 40,
            padding: 0,

            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",

            borderRadius: 14,
            border: "2px solid #ccc",

            background:
              "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",

            cursor: "pointer",

            boxShadow:
              "0 10px 25px rgba(16,185,129,.10), inset 0 1px 0 rgba(255,255,255,.7)",

            transition:
              "all .18s ease",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 8,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              background:
                "linear-gradient(135deg, #22c55e, #16a34a)",

              color: "#fff",

              boxShadow:
                "0 8px 18px rgba(34,197,94,.28)",
            }}
          >
            <FileSpreadsheet size={14} />
          </div>
        </button>
          )}

          {onOpenColumns && (
            <button
              type="button"
              onClick={onOpenColumns}
              title="Gerenciar colunas"
              aria-label="Gerenciar colunas"
              style={columnsButtonStyle}
            >
              <Columns3 size={16} />
            </button>
          )}
        </div>
      </div>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <CompanyListTable
          items={items}
          visibleColumns={visibleColumns}
          onOpenCompany={onOpenCompany}
          onOpenColumns={onOpenColumns}
          onExportExcel={onExportExcel}
        />
      </div>
    </div>
  );
}


const filtersBarStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  flexWrap: "wrap",
  flex: "0 1 560px",
  minWidth: 260,
};

const toolbarStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 10,
  flex: 1,
  minWidth: 220,
};

const toolbarActionsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const baseToolbarButton: React.CSSProperties = {
  height: 38,
  padding: "0 14px",
  borderRadius: 12,
  border: "1px solid #dbe4ee",
  background: "#012942",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
  transition: "all .18s ease",
};

const excelButtonStyle: React.CSSProperties = {
  ...baseToolbarButton,
  color: "#166534",
  background: "rgba(34,197,94,.08)",
  border: "2px solid rgba(34,197,94,.18)",
};

const columnsButtonStyle: React.CSSProperties = {
  ...baseToolbarButton,
  width: 40,
  height: 40,
  padding: 0,
  justifyContent: "center",
  color: "#fff",
};