import React from "react";
import { Table, Thead, Th, Td, Badge, Empty } from "../ui";
import {
  Eye,
  Hash,
  FolderTree,
  PowerOff,
  Power,
  Columns3,
  FileSpreadsheet,
} from "lucide-react";

type Column = {
  key: string;
  label: string;
  type?: string;
};

type Props = {
  items: any[];
  visibleColumns: Column[];
  onOpenCompany: (id: string) => void;
  onOpenColumns?: () => void;
  onExportExcel?: () => void;
};

const DEFAULT_COLUMNS: Column[] = [
  { key: "cod", label: "Cód." },
  { key: "razaoSocial", label: "Empresa" },
  { key: "cnpj", label: "CNPJ" },
  { key: "grupo", label: "Grupo" },
  { key: "situacao", label: "Status" },
];

export function CompanyListTable({
  items,
  visibleColumns,
  onOpenCompany,
  onOpenColumns,
  onExportExcel,
}: Props) {
  const [tooltipPos, setTooltipPos] = React.useState<{
    top: number;
    left: number;
    situacao: string;
  } | null>(null);

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 999);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const columns =
    Array.isArray(visibleColumns) && visibleColumns.length > 0
      ? visibleColumns
      : DEFAULT_COLUMNS;

  if (!items.length) {
    return <Empty message="Nenhuma empresa encontrada." />;
  }

  function getColumnLabel(column: Column) {
    const labels: Record<string, string> = {
      cod: "Cód.",
      codigo: "Código",
      razaoSocial: "Empresa",
      empresa: "Empresa",
      nomeFantasia: "Nome Fantasia",
      cnpj: "CNPJ/CPF",
      cnpjCpf: "CNPJ/CPF",
      grupo: "Grupo",
      filial: "Matriz / Filial",
      matrizFilial: "Matriz / Filial",
      tributacao: "Tributação",
      ramo: "Ramo",
      perfil: "Perfil Comercial",
      perfilComercial: "Perfil Comercial",
      situacao: "Status",
      status: "Status",
      dataEntrada: "Entrada",
      dataSaida: "Saída",
    };

    return labels[column.key] || column.label || column.key;
  }

  function formatDateBR(value: any) {
    if (!value) return "—";

    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      const [year, month, day] = value.slice(0, 10).split("-");
      return `${day}/${month}/${year}`;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  

  function renderCompanyCell(company: any, column: Column) {
    const value = company[column.key];

    if (column.key === "cod" || column.key === "codigo") {
      return (
        <div style={codePillStyle}>
          <Hash size={12} strokeWidth={2.2} color="#94a3b8" />
          <span style={monoTextStyle}>{company.cod || company.codigo || "—"}</span>
        </div>
      );
    }

    if (column.key === "razaoSocial" || column.key === "empresa") {
      return (
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 850,
              color: "#0f172a",
              fontSize: 13.5,
              lineHeight: 1.3,
              maxWidth: 260,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={company.razaoSocial || company.empresa}
          >
            {company.razaoSocial || company.empresa || "—"}
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 12.5,
              color: "#94a3b8",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 280,
            }}
          >
            {company.nomeFantasia || "Sem nome fantasia"}
          </div>
        </div>
      );
    }

    if (column.key === "cnpj" || column.key === "cnpjCpf") {
      return (
        <div style={simplePillStyle}>
          <span style={monoTextStyle}>{company.cnpj || company.cnpjCpf || "—"}</span>
        </div>
      );
    }

    if (column.key === "grupo") {
      return company.grupo ? (
        <span style={groupPillStyle}>
          <FolderTree size={13} strokeWidth={2.2} />
          {company.grupo}
        </span>
      ) : (
        <EmptyValue />
      );
    }

   if (column.key === "situacao" || column.key === "status") {
  const status = company.situacao || company.status;



  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {status ? (
        <Badge
          label={status}
          variant={
            status === "ATIVA" || status === "ATIVO"
              ? "green"
              : status === "ENCERRADA" || status === "ENCERRADO"
              ? "red"
              : "yellow"
          }
        />
      ) : (
        <EmptyValue />
      )}

      {company.active && status !== "ATIVA" && status !== "ATIVO" && (
        <span
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltipPos({
              top: rect.bottom + 10,
              left: rect.right - 280,
              situacao: status,
            });
          }}
          onMouseLeave={() => setTooltipPos(null)}
          style={activeDotPillStyle}
        >
          <span style={activeDotStyle} />
        </span>
      )}
    </div>
  );
}


if (column.type === "sector-user") {
  return <SectorUsersCell value={value} label={getColumnLabel(column)} />;
}


    if (column.type === "date" || column.key.toLowerCase().includes("data")) {
      return (
        <span style={{ fontWeight: 750, color: value ? "#0f172a" : "#cbd5e1" }}>
          {formatDateBR(value)}
        </span>
      );
    }

    return value ? (
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#334155",
          display: "block",
          maxWidth: 240,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={String(value)}
      >
        {String(value)}
      </span>
    ) : (
      <EmptyValue />
    );
  }

  return (
    <div>
      

      {isMobile ? (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((company) => (
            <div
              key={company.id}
              onClick={() => onOpenCompany(company.id)}
              style={mobileCardStyle}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  {columns.slice(0, 6).map((column) => (
                    <div key={column.key} style={{ marginBottom: 10 }}>
                      <div style={mobileLabelStyle}>{getColumnLabel(column)}</div>
                      <div>{renderCompanyCell(company, column)}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button
                    title="Abrir empresa"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCompany(company.id);
                    }}
                    style={actionBtnStyle("#64748b")}
                  >
                    <Eye size={17} strokeWidth={2.2} />
                  </button>

                
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
       <div
          style={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <div
            style={{
              minWidth: "100%",
            }}
          >
            <Table>
            <Thead>
              <tr>
                {columns.map((column) => (
                  <Th key={column.key} style={thStyle}>
                    {getColumnLabel(column)}
                  </Th>
                ))}

                <Th
                  style={{
                    borderBottom: "1px solid rgba(226,232,240,0.7)",
                    textAlign:"center"
                  }}
                >
                  ação
                </Th>
              </tr>
            </Thead>

            <tbody>
              {items.map((company) => (
              <tr
                key={company.id}
                onClick={() => onOpenCompany(company.id)}
                style={{
                  cursor: "pointer",
                  background: "#fff",
                  
                }}
                onMouseOver={(e) => {
                  const row = e.currentTarget;

                  row.style.background = "#d1d5db";

                  const cells = row.querySelectorAll("td");

                  cells.forEach((cell) => {
                    const td = cell as HTMLElement;

                    if (td.dataset.actionCell === "true") {
                      td.style.filter = "brightness(0.97)";
                    } else {
                      td.style.background = "#d1d5db";
                    }
                  });
                }}
                onMouseOut={(e) => {
                  const row = e.currentTarget;

                  row.style.background = "#fff";

                  const cells = row.querySelectorAll("td");

                  cells.forEach((cell) => {
                    const td = cell as HTMLElement;

                    if (td.dataset.actionCell === "true") {
                      td.style.filter = "brightness(1)";
                    } else {
                      td.style.background = "#fff";
                    }
                  });
                }}
              >
                  {columns.map((column, index) => (
                    <Td
                      key={column.key}
                      
                      style={{
                        ...tdBaseStyle,
                        
                        ...(index === 0
                          ? {
                              borderLeft: "1px solid #eef2f7",
                            }
                          : {}),
                      }}
                    >
                      {renderCompanyCell(company, column)}
                    </Td>
                  ))}

                  <Td
                      align="center"
                      style={{
                        ...tdBaseStyle,
                        

                        padding: 0,
                        gap: 10,

                        background: company.active
                          ? "linear-gradient(90deg, #fff1f2 0%, #ffe4e6 100%)"
                          : "linear-gradient(90deg, #ecfdf5 0%, #d1fae5 100%)",

                        right: 0,

                        overflow: "hidden",

                       
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: "100%",

                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",

                          gap: 8,

                          padding: "6px",
                        }}
                      >
                      <button
                        title="Abrir empresa"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCompany(company.id);
                        }}
                        style={actionBtnStyle("#64748b")}
                      >
                        <Eye size={17} strokeWidth={2.2} />
                      </button>

                      {/* <button
                        title={company.active ? "Desativar empresa" : "Ativar empresa"}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleActive(company.id, !company.active);
                        }}
                        style={{
                          ...actionBtnStyle(company.active ? "#ef4444" : "#16a34a"),
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          justifyContent: "center",
                          fontWeight: 700,
                        }}
                      >
                        {company.active ? (
                          <>
                            <PowerOff size={17} strokeWidth={3} />
                          </>
                        ) : (
                          <>
                            <Power size={17} strokeWidth={3} />
                          </>
                        )}
                      </button> */}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
              </Table>
  </div>

          {tooltipPos && (
            <div style={tooltipStyle(tooltipPos)}>
              <strong
                style={{
                  display: "block",
                  fontSize: 12,
                  color: "#0f172a",
                  marginBottom: 6,
                  fontWeight: 900,
                }}
              >
                Status operacional ativo
              </strong>

              <div
                style={{
                  fontSize: 12.5,
                  lineHeight: 1.65,
                  color: "#64748b",
                }}
              >
                Esta empresa ainda está ativa no sistema, mesmo com status{" "}
                <strong
                  style={{
                    padding: "2px 6px",
                    borderRadius: 6,
                    fontSize: 11.5,
                    fontWeight: "bold",
                    color: "#000",
                  }}
                >
                  {tooltipPos.situacao}.
                </strong>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyValue() {
  return <span style={{ color: "#cbd5e1", fontWeight: 700 }}>—</span>;
}

function actionBtnStyle(color: string): React.CSSProperties {
  return {
    width: 38,
    height: 38,
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    background: color,
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.18s ease",
    boxShadow: "0 4px 10px rgba(15,23,42,0.05)",
    flexShrink: 0,
  };
}

function tooltipStyle(pos: { top: number; left: number }): React.CSSProperties {
  return {
    position: "fixed",
    top: pos.top,
    left: pos.left,
    width: 280,
    padding: 14,
    borderRadius: 18,
    background: "#fff",
    border: "1px solid #e2e8f0",
    boxShadow: "0 24px 60px rgba(15,23,42,.20)",
    zIndex: 99999,
    pointerEvents: "none",
  };
}


const thStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 900,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  padding: "16px",
  whiteSpace: "nowrap",
 borderBottom: "2px solid rgba(226,232,240,0.7)",
  borderRight: "2px solid rgba(226,232,240,0.55)",
};

const tdBaseStyle: React.CSSProperties = {
  padding: "12px 16px",
  background: "rgba(255,255,255,0.96)",
  whiteSpace: "nowrap",

  borderBottom: "2px solid rgba(226,232,240,0.7)",
  borderRight: "2px solid rgba(226,232,240,0.55)",

  transition: "all .18s ease",
  position: "relative",
  
};


const codePillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 10px",
  borderRadius: 10,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const simplePillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "6px 10px",
  borderRadius: 10,
  background: "#fcfcfd",
  border: "1px solid #eef2f7",
};

const monoTextStyle: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: 12.5,
  color: "#334155",
  fontWeight: 700,
};

const groupPillStyle: React.CSSProperties = {
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
};

const activeDotPillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "4px 8px",
  borderRadius: 999,
  background: "rgba(34,197,94,.10)",
  border: "1px solid rgba(34,197,94,.18)",
  color: "#16a34a",
  fontSize: 11,
  fontWeight: 800,
  whiteSpace: "nowrap",
  cursor: "help",
};

const activeDotStyle: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: "#22c55e",
  boxShadow: "0 0 0 4px rgba(34,197,94,.12)",
};

const mobileCardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #eef2f7",
  borderRadius: 20,
  padding: 14,
  boxShadow: "0 8px 22px rgba(15,23,42,0.06)",
  cursor: "pointer",
};

const mobileLabelStyle: React.CSSProperties = {
  fontSize: 10.5,
  fontWeight: 900,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: ".07em",
  marginBottom: 4,
};



function SectorUsersCell({
  value,
  label,
}: {
  value: any;
  label: string;
}) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const tooltipRef = React.useRef<HTMLDivElement>(null);

  const [tooltip, setTooltip] = React.useState<{
    top: number;
    left: number;
  } | null>(null);


  const users = Array.isArray(value)
    ? value
    : typeof value === "string"
    ? value.split(",").map((item) => item.trim()).filter(Boolean)
    : [];

  if (!users.length) {
    return <EmptyValue />;
  }

  const first = users[0];
  const total = users.length;

function handleMouseEnter() {
  const rect = wrapperRef.current?.getBoundingClientRect();
  if (!rect) return;

  const tooltipWidth = 310;
  const gap = 8;
  const margin = 12;

  setTooltip({
    top: rect.bottom + gap,
    left: Math.max(
      margin,
      Math.min(rect.left, window.innerWidth - tooltipWidth - margin)
    ),
  });
}


React.useEffect(() => {
  if (!tooltip || !tooltipRef.current || !wrapperRef.current) return;

  const rect = wrapperRef.current.getBoundingClientRect();
  const tooltipRect = tooltipRef.current.getBoundingClientRect();

  let top = rect.bottom + 8;

  if (top + tooltipRect.height > window.innerHeight - 12) {
    top = window.innerHeight - tooltipRect.height - 12;
  }

  if (top < 12) {
    top = 12;
  }

  if (top !== tooltip.top) {
    setTooltip((prev) =>
      prev
        ? {
            ...prev,
            top,
          }
        : prev
    );
  }
}, [tooltip]);

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setTooltip(null)}
      style={{
        position: "relative",
        display: "inline-flex",
        maxWidth: 240,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          minWidth: 0,
          maxWidth: 240,
          padding: "7px 10px",
          borderRadius: 999,
          background: "linear-gradient(135deg,#f8fafc,#ffffff)",
          border: "1px solid #e2e8f0",
          boxShadow: "0 6px 16px rgba(15,23,42,.04)",
          cursor: "help",
        }}
      >
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            background: "#012942",
            color: "#fff",
            fontSize: 10,
            fontWeight: 900,
            flexShrink: 0,
          }}
        >
          {first.slice(0, 1).toUpperCase()}
        </span>

        <span
          style={{
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: 12.5,
            fontWeight: 800,
            color: "#334155",
          }}
        >
          {first}
        </span>

        {total > 1 && (
          <span
            style={{
              flexShrink: 0,
              padding: "3px 7px",
              borderRadius: 999,
              background: "rgba(37,99,235,.08)",
              color: "#2563eb",
              fontSize: 11,
              fontWeight: 900,
              border: "1px solid rgba(37,99,235,.14)",
            }}
          >
            +{total - 1}
          </span>
        )}
      </div>

      {tooltip && (
        <div
          ref={tooltipRef}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            top: tooltip.top,
            left: tooltip.left,
            zIndex: 999999,
            width: 310,
            maxHeight: "calc(100vh - 24px)",
            overflowY: "auto",
            padding: 14,
            borderRadius: 20,
            background: "rgba(15,23,42,.98)",
            border: "1px solid rgba(255,255,255,.10)",
            boxShadow: "0 28px 80px rgba(15,23,42,.35)",
            color: "#fff",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 950,
              color: "#93c5fd",
              textTransform: "uppercase",
              letterSpacing: ".12em",
              marginBottom: 10,
            }}
          >
            {label}
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            {users.map((user, index) => (
              <div
                key={`${user}-${index}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  padding: "9px 10px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.10)",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 10,
                    display: "grid",
                    placeItems: "center",
                    background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 950,
                    flexShrink: 0,
                  }}
                >
                  {user.slice(0, 1).toUpperCase()}
                </div>

                <span
                  style={{
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: 12.5,
                    fontWeight: 800,
                    color: "#e5e7eb",
                  }}
                  title={user}
                >
                  {user}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}