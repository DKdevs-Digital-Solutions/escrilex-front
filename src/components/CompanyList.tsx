import { Building2, Columns3, FileSpreadsheet } from "lucide-react";
import { CompanyListTable } from "./CompanyListTable";

type Props = {
  items: any[];
  loading: boolean;

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
        overflow: "hidden",
      }}
    >
      <div
        style={{
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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
                Visualize e acesse rapidamente os registros cadastrados
              </div>
            </div>
          </div>

          


          <div style={toolbarStyle}>
        <div style={toolbarActionsStyle}>
          {onExportExcel && (  
        <button
          onClick={onExportExcel}
          style={{
            height: 40,
            padding: "0 16px",

            display: "inline-flex",
            alignItems: "center",
            gap: 8,

            borderRadius: 14,
            border: "2px solid #ccc",

            background:
              "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",

            color: "#065f46",

            fontSize: 13,
            fontWeight: 800,
            letterSpacing: ".02em",

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

          Exportar Excel
        </button>
          )}

          {onOpenColumns && (
            <button type="button" onClick={onOpenColumns} style={columnsButtonStyle}>
              <Columns3 size={15} />
              Gerenciar colunas
            </button>
          )}

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 10px",
              borderRadius: 999,
              background: "#f8fafc",
              color: "#475569",
              fontSize: 12,
              fontWeight: 500,
              border: "1px solid #e2e8f0",
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: "#0f172a",
                background: "#e2e8f0",
                padding: "2px 6px",
                borderRadius: 999,
                lineHeight: 1,
              }}
            >
              {items.length}
            </span>

            <span style={{ opacity: 0.85 }}>
              {items.length === 1 ? "empresa" : "empresas"}
            </span>
          </div>
        </div>
      </div>
        </div>
      </div>

      <div style={{ padding:"20px 0px", position:"relative", bottom:"20px" }}>
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


const toolbarStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginLeft: "auto",
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
  color: "#fff",
};