import { Building2 } from "lucide-react";
import { CompanyListTable } from "./CompanyListTable";

type Props = {
  items: any[];
  loading: boolean;
  onOpenCompany: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
};

export function CompanyList({ items, loading, onOpenCompany, onToggleActive }: Props) {

  
  if (loading) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 0,
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
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
        borderRadius: 0,
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
      }}
    >
      {/* topo do card */}
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
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Ícone com o Degradê em Azul Marinho */}
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: "#012942", // Azul Marinho Profundo
              color: "#fff", // Ícone em Dourado para contraste Premium
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
                color: "#012942", // Título em Azul Marinho
                letterSpacing: "-0.02em",
              }}
            >
              Listagem de empresas
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 13,
                color: "#546e7a", // Cinza levemente azulado para harmonizar
              }}
            >
              Visualize e acesse rapidamente os registros cadastrados
            </div>
          </div>
        </div>

        {/* Badge de Contagem */}
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

      {/* tabela */}
      <div style={{ padding: 10 }}>
        <CompanyListTable items={items} onOpenCompany={onOpenCompany} onToggleActive={onToggleActive}/>
      </div>
    </div>
  );
}