import React from "react";
import { Table, Thead, Th, Td, Badge, Empty } from "../ui";
import { Eye, Building2, Hash, FolderTree, PowerOff, Power } from "lucide-react";
import { Avatar } from "./Avatar";

type Props = {
  items: any[];
  onOpenCompany: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
};

const thStyle: React.CSSProperties = {
  fontSize: 11.5,
  fontWeight: 800,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  padding: "0 16px 8px 16px",
  borderRadius: 0,
};

const tdBaseStyle: React.CSSProperties = {
  padding: "16px",
  borderTop: "1px solid #eef2f7",
  borderBottom: "1px solid #eef2f7",
  background: "transparent",
};

export function CompanyListTable({ items, onOpenCompany, onToggleActive }: Props) {
  if (!items.length) {
    return <Empty message="Nenhuma empresa encontrada." />;
  }

  return (
    <div
      style={{
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: "0 10px",
      }}
    >
      <Table>
      <Thead>
        <tr>
          <Th style={{ ...thStyle, width: 90 }}>Cod.</Th>
          <Th style={thStyle}>Empresa</Th>
          <Th style={thStyle}>Situação</Th>
          <Th style={thStyle}>CNPJ</Th>
          <Th style={thStyle}>Grupo</Th>
          <Th style={thStyle}>Status</Th>
          <Th style={{ ...thStyle, width: 70 }}></Th>
        </tr>
      </Thead>

      <tbody>
        {items.map((c) => (
         <tr
            className="company-row"
            key={c.id}
            onClick={() => onOpenCompany(c.id)}
            style={{
                cursor: "pointer",
                transition: "all 0.18s ease",
                background: "#fff",
                borderRadius: 0,
            }}
            onMouseOver={(e) => {
                const row = e.currentTarget;
                row.style.background = "#f8fafc";
            }}
            onMouseOut={(e) => {
                const row = e.currentTarget;
                row.style.background = "#fff";
            }}
            >
            {/* Código */}
            <Td
              style={{
                ...tdBaseStyle,
                borderLeft: "1px solid #eef2f7",
                borderRadius: 0,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "6px 10px",
                  borderRadius: 10,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  
                }}
              >
                <Hash size={12} strokeWidth={2.2} color="#94a3b8" />
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: "#64748b",
                    fontWeight: 700,
                  }}
                >
                  {c.cod || "—"}
                </span>
              </div>
               
            </Td>

            {/* Empresa */}
            <Td style={tdBaseStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 800,
                        color: "#0f172a",
                        fontSize: 13.5,
                        lineHeight: 1.3,
                      }}
                    >
                      {c.razaoSocial || "—"}
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 12.5,
                      color: "#94a3b8",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 320,
                    }}
                  >
                    {c.nomeFantasia || "Sem nome fantasia"}
                  </div>
                 
                </div>
              </div>
            </Td>

             {/* Situação */}
            <Td style={tdBaseStyle}>
              {c.situacao ? (
                <Badge
                  label={c.situacao}
                  variant={
                    c.situacao === "ATIVA"
                      ? "green"
                      : c.situacao === "ENCERRADA"
                      ? "red"
                      : "yellow"
                  }
                />
              ) : (
                <span style={{ color: "#cbd5e1", fontWeight: 600 }}>—</span>
              )}
            </Td>

            {/* CNPJ */}
            <Td style={tdBaseStyle}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "6px 10px",
                  borderRadius: 10,
                  background: "#fcfcfd",
                  border: "1px solid #eef2f7",
                }}
              >
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 12.5,
                    color: "#334155",
                    fontWeight: 600,
                    letterSpacing: "0.01em",
                  }}
                >
                  {c.cnpj || "—"}
                </span>
              </div>
            </Td>

             

            {/* Grupo */}
            <Td style={tdBaseStyle}>
              {c.grupo ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    fontSize: 12.5,
                    color: "#475569",
                    background: "#f8fafc",
                    padding: "6px 10px",
                    borderRadius: 999,
                    fontWeight: 700,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <FolderTree size={13} strokeWidth={2.2} />
                  {c.grupo}
                </span>
              ) : (
                <span style={{ color: "#cbd5e1", fontWeight: 600 }}>—</span>
              )}
            </Td>

           

            <Td style={tdBaseStyle}>
              
                  <span className={`status-badge ${c.active ? "on" : "off"}`}>
                    <span className="status-dot" />
                    {c.active ? "Ativo" : "Desativado"}
                  </span>
            </Td>

            {/* Ação */}
           <Td
              align="right"
              style={{
                ...tdBaseStyle,
                borderRight: "1px solid #eef2f7",
                borderTopRightRadius: 16,
                borderBottomRightRadius: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                }}
              >
                {/* 👁 Ver empresa */}
                <button
                  title="Abrir empresa"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCompany(c.id);
                  }}
                  style={actionBtnStyle("#4f46e5")}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.background = "rgba(79,70,229,0.12)";
                    el.style.borderColor = "#c7d2fe";
                    el.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.background = "#fff";
                    el.style.borderColor = "#e2e8f0";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  <Eye size={17} strokeWidth={2.2} />
                </button>

                {/* 🔄 Ativar / Desativar */}
                <button
                  title={c.active ? "Desativar empresa" : "Ativar empresa"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleActive(c.id, !c.active);
                  }}
                  style={actionBtnStyle(c.active ? "#ef4444" : "#16a34a")}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;

                    if (c.active) {
                      el.style.background = "rgba(239,68,68,0.12)";
                      el.style.borderColor = "#fecaca";
                    } else {
                      el.style.background = "rgba(34,197,94,0.12)";
                      el.style.borderColor = "#bbf7d0";
                    }

                    el.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.background = "#fff";
                    el.style.borderColor = "#e2e8f0";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  {c.active ? (
                    <PowerOff size={17} strokeWidth={2.2} />
                  ) : (
                    <Power size={17} strokeWidth={2.2} />
                  )}
                </button>
              </div>
            </Td>
          </tr>
        ))}
      </tbody>
      </Table>
    </div>
  );
}

function actionBtnStyle(color: string): React.CSSProperties {
  return {
    width: 38,
    height: 38,
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    background: "#fff",
    color,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.18s ease",
    boxShadow: "0 4px 10px rgba(15,23,42,0.05)",
  };
}