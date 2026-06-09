import React from "react";
import { Card, Empty, Badge } from "../ui";
import {
  ShieldCheck,
  History,
  UserCircle2,
  Boxes,
  User,
  Building2,
  FolderKanban,
  ClipboardList,
  LayoutPanelTop,
  Activity,
} from "lucide-react";

const entityLabel: Record<string, string> = {
  Company: "Empresa",
  User: "Usuário",
  Sector: "Setor",
  ChecklistRun: "Checklist",
  ChecklistItemRun: "Item do checklist",
  ChecklistTemplate: "Template",
  ChecklistTemplateSection: "Seção",
  ChecklistTemplateItem: "Item do template",
};

const actionLabel: Record<string, string> = {
  LOGIN: "Login",
  COMPANY_CREATE: "Empresa criada",
  COMPANY_UPDATE: "Empresa atualizada",
  COMPANY_RESPONSIBLES_SET: "Responsáveis alterados",
  CHECKLIST_START: "Checklist iniciado",
  CHECKLIST_ITEM_UPDATE: "Checklist atualizado",
  USER_CREATE: "Usuário criado",
  USER_DISABLE: "Usuário desativado",
  SECTOR_CREATE: "Setor criado",
  SECTOR_DISABLE: "Setor desativado",
  TEMPLATE_CREATE: "Template criado",
  TEMPLATE_UPDATE: "Template atualizado",
  TEMPLATE_SECTION_CREATE: "Seção criada",
  TEMPLATE_SECTION_UPDATE: "Seção atualizada",
  TEMPLATE_SECTION_DELETE: "Seção excluída",
  TEMPLATE_ITEM_CREATE: "Item criado",
  TEMPLATE_ITEM_UPDATE: "Item atualizado",
  TEMPLATE_ITEM_DELETE: "Item excluído",
};

const actionBadge: Record<string, any> = {
  LOGIN: "gray",
  COMPANY_CREATE: "green",
  COMPANY_UPDATE: "blue",
  USER_CREATE: "blue",
  USER_DISABLE: "red",
  SECTOR_DISABLE: "red",
  CHECKLIST_START: "yellow",
  CHECKLIST_ITEM_UPDATE: "green",
};

type AuditItem = {
  id: string;

  data: string;
  hora: string;

  nomeEmpresa: string | null;

  usuarioResponsavel: {
    id: string;
    name: string;
    email: string;
  } | null;

  action: string;

  entity: string;
  entityId: string;

  camposAlterados: {
    campo: string;
    valorAnterior: unknown;
    novoValor: unknown;
  }[];

  valorAnterior: unknown;
  novoValor: unknown;

  ip: string | null;
  userAgent: string | null;
};

type AuditFilterType = "all" | "login" | "user_actions" | "unidentified";

type AuditListProps = {
  items: AuditItem[];
};

function getEntityVisual(entity: string) {


  

  const map: Record<
    string,
    {
      icon: React.ElementType;
      bg: string;
      color: string;
      border: string;
    }
  > = {
    Company: {
      icon: Building2,
      bg: "rgba(37,99,235,0.10)",
      color: "#2563eb",
      border: "rgba(37,99,235,0.18)",
    },
    User: {
      icon: User,
      bg: "rgba(22,163,74,0.10)",
      color: "#16a34a",
      border: "rgba(22,163,74,0.18)",
    },
    Sector: {
      icon: Boxes,
      bg: "rgba(234,88,12,0.10)",
      color: "#ea580c",
      border: "rgba(234,88,12,0.18)",
    },
    ChecklistRun: {
      icon: ClipboardList,
      bg: "rgba(124,58,237,0.10)",
      color: "#7c3aed",
      border: "rgba(124,58,237,0.18)",
    },
    ChecklistItemRun: {
      icon: ClipboardList,
      bg: "rgba(99,102,241,0.10)",
      color: "#4f46e5",
      border: "rgba(99,102,241,0.18)",
    },
    ChecklistTemplate: {
      icon: FolderKanban,
      bg: "rgba(8,145,178,0.10)",
      color: "#0891b2",
      border: "rgba(8,145,178,0.18)",
    },
    ChecklistTemplateSection: {
      icon: LayoutPanelTop,
      bg: "rgba(217,119,6,0.10)",
      color: "#d97706",
      border: "rgba(217,119,6,0.18)",
    },
    ChecklistTemplateItem: {
      icon: FolderKanban,
      bg: "rgba(190,24,93,0.10)",
      color: "#be185d",
      border: "rgba(190,24,93,0.18)",
    },
  };

  return (
    map[entity] || {
      icon: History,
      bg: "rgba(100,116,139,0.10)",
      color: "#64748b",
      border: "rgba(100,116,139,0.18)",
    }
  );
}

function StatCard({
  label,
  value,
  helper,
  color,
  softBg,
  softBorder,
  icon,
  active = false,
  onClick,
}: {
  label: string;
  value: number;
  helper: string;
  color: string;
  softBg: string;
  softBorder: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minWidth: 170,
        flex: 1,
        padding: "30px 16px",
        borderRadius: 18,
        background: active ? softBg : "#fff",
        border: `2px solid ${active ? color : softBorder}`,
        boxShadow: active
          ? `0 10px 24px ${softBg}`
          : "0 8px 20px rgba(15,23,42,0.05)",
        textAlign: "left",
        cursor: "pointer",
        transition: "all 0.18s ease",
        fontFamily: "inherit",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
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
              fontSize: 11,
              fontWeight: 800,
              color: active ? color : "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {label}
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 26,
              fontWeight: 900,
              color: "#0f172a",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            {value}
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 12.5,
              color: "#64748b",
              fontWeight: 600,
            }}
          >
            {helper}
          </div>
        </div>

        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: softBg,
            border: `1px solid ${softBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>
    </button>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "0 14px 6px 14px",
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#94a3b8",
  fontWeight: 800,
};

const tdStyle: React.CSSProperties = {
  padding: "16px 14px",
  borderTop: "1px solid #ccc",
  borderBottom: "1px solid #ccc",
};

const tdLeftStyle: React.CSSProperties = {
  borderTopLeftRadius: 16,
  borderBottomLeftRadius: 16,
  borderLeft: "1px solid #ccc",
};

const tdRightStyle: React.CSSProperties = {
  borderTopRightRadius: 16,
  borderBottomRightRadius: 16,
  borderRight: "1px solid #ccc ",
};

export function AuditList({ items }: AuditListProps) {
  const [cardFilter, setCardFilter] = React.useState<AuditFilterType>("all");

  const loginCount = React.useMemo(
    () => items.filter((item) => item.action === "LOGIN").length,
    [items]
  );

  const userActionsCount = React.useMemo(
    () =>
      items.filter((item) =>
        String(item.entity || "").toLowerCase().includes("user")
      ).length,
    [items]
  );

  const unidentifiedCount = React.useMemo(
  () => items.filter((item) => !entityLabel[item.entity]).length,
  [items]
  );

  const entityCount = React.useMemo(() => {
    const unique = new Set(items.map((item) => item.entity).filter(Boolean));
    return unique.size;
  }, [items]);

    const filteredItems = React.useMemo(() => {
    if (cardFilter === "login") {
        return items.filter((item) => item.action === "LOGIN");
    }

    if (cardFilter === "user_actions") {
        return items.filter((item) =>
        String(item.entity || "").toLowerCase().includes("user")
        );
    }

    if (cardFilter === "unidentified") {
        return items.filter((item) => !entityLabel[item.entity]);
    }

    return items;
    }, [items, cardFilter]);


      function getInitial(name?: string) {
    if (!name) return "?";
    return name.trim().charAt(0).toUpperCase();
    }

    function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }

  const colors = [
    "#2563eb", // azul
    "#16a34a", // verde
    "#9333ea", // roxo
    "#ea580c", // laranja
    "#dc2626", // vermelho
    "#0891b2", // cyan
    "#7c3aed", // violeta
  ];

  return colors[Math.abs(hash) % colors.length];
}


const [isMobile, setIsMobile] = React.useState(false);

React.useEffect(() => {
  const check = () => setIsMobile(window.innerWidth <= 999);
  check();

  window.addEventListener("resize", check);
  return () => window.removeEventListener("resize", check);
}, []);



  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <StatCard
          label="Eventos"
          value={items.length}
          helper="registros retornados"
          color="#2563eb"
          softBg="rgba(37,99,235,0.10)"
          softBorder="rgba(37,99,235,0.18)"
          icon={<History size={18} strokeWidth={2.2} />}
          active={cardFilter === "all"}
          onClick={() => setCardFilter("all")}
        />

        <StatCard
          label="Logins"
          value={loginCount}
          helper="acessos registrados"
          color="#16a34a"
          softBg="rgba(22,163,74,0.10)"
          softBorder="rgba(22,163,74,0.18)"
          icon={<ShieldCheck size={18} strokeWidth={2.2} />}
          active={cardFilter === "login"}
          onClick={() => setCardFilter("login")}
        />

        <StatCard
          label="Ações de usuário"
          value={userActionsCount}
          helper="movimentações relacionadas"
          color="#ea580c"
          softBg="rgba(234,88,12,0.10)"
          softBorder="rgba(234,88,12,0.18)"
          icon={<UserCircle2 size={18} strokeWidth={2.2} />}
          active={cardFilter === "user_actions"}
          onClick={() => setCardFilter("user_actions")}
        />

       {/* <StatCard
        label="Não identificados"
        value={unidentifiedCount}
        helper="registros sem mapeamento"
        color="#7c3aed"
        softBg="rgba(124,58,237,0.10)"
        softBorder="rgba(124,58,237,0.18)"
        icon={<Activity size={18} strokeWidth={2.2} />}
        active={cardFilter === "unidentified"}
        onClick={() => setCardFilter("unidentified")}
        /> */}
      </div>

      <Card
        style={{
          borderRadius: 20,
          border: "2px solid #e2e8f0",
          background: "linear-gradient(180deg, #ffffff 0%, #fcfdff 100%)",
          overflow: "hidden",
          padding: 0,
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
            Eventos registrados
          </div>

         <div
            style={{
                marginTop: 4,
                fontSize: 13,
                color: "#64748b",
            }}
            >
            {cardFilter === "all"
                ? "Histórico detalhado das ações executadas no sistema"
                : cardFilter === "login"
                ? "Exibindo apenas eventos de login"
                : cardFilter === "user_actions"
                ? "Exibindo apenas ações relacionadas a usuários"
                : "Exibindo apenas registros com tipo não identificado"}
            </div>
        </div>

       {!filteredItems.length ? (
      <div style={{ padding: 28 }}>
        <Empty message="Nenhum evento encontrado para esse filtro." />
      </div>
    ) : isMobile ? (
      <div
        style={{
          padding: 14,
          display: "grid",
          gap: 12,
        }}
      >
        {filteredItems.map((r) => {
          const visual = getEntityVisual(r.entity);
          const EntityIcon = visual.icon;

      return (
        <div
          key={r.id}
          style={{
            padding: 14,
            borderRadius: 18,
            background: "#fff",
            border: "2px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: stringToColor(r.usuarioResponsavel?.name || ""),
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: 15,
                flexShrink: 0,
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              }}
            >
              {getInitial(r.usuarioResponsavel?.name)}
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 14,
                  color: "#0f172a",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {r.usuarioResponsavel?.name ?? "—"}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#94a3b8",
                  marginTop: 3,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {r.usuarioResponsavel?.email ?? ""}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              display: "grid",
              gap: 10,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 4,
                }}
              >
                Data / Hora
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: "#475569",
                  fontWeight: 700,
                }}
              >
                {/* {new Date(r.createdAt).toLocaleString("pt-BR")} */}
                {r.data}, {r.hora}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <Badge
                label={actionLabel[r.action] ?? r.action}
                variant={actionBadge[r.action] || "gray"}
              />

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "7px 10px",
                  borderRadius: 999,
                  background: visual.bg,
                  border: `1px solid ${visual.border}`,
                  color: visual.color,
                  fontSize: 12,
                  fontWeight: 800,
                  maxWidth: "100%",
                }}
              >
                <EntityIcon size={13} strokeWidth={2.2} />

                <span
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {entityLabel[r.entity] ?? r.entity}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
) : (
  <div style={{ padding: 14 }}>
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: "0 10px",
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>Usuário</th>
            <th style={thStyle}>Data / Hora</th>
            <th style={thStyle}>Ação</th>
            <th style={thStyle}>Entidade</th>
          </tr>
        </thead>

        <tbody>
          {filteredItems.map((r) => {
            const visual = getEntityVisual(r.entity);
            const EntityIcon = visual.icon;

            return (
              <tr
                key={r.id}
                style={{
                  background: "#ffffff",
                  boxShadow: "0 6px 18px rgba(15,23,42,0.05)",
                  cursor: "pointer",
                }}
              >
                <td style={{ ...tdStyle, ...tdLeftStyle }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "20%",
                        background: stringToColor(r.usuarioResponsavel?.name || ""),
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: 14,
                        flexShrink: 0,
                      }}
                    >
                      {getInitial(r.usuarioResponsavel?.name)}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 13.5,
                          color: "#0f172a",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {r.usuarioResponsavel?.name ?? "—"}
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          color: "#94a3b8",
                          marginTop: 4,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {r.usuarioResponsavel?.email ?? ""}
                      </div>
                    </div>
                  </div>
                </td>

                <td style={tdStyle}>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "#64748b",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {/* {new Date(r.createdAt).toLocaleString("pt-BR")} */}
                    {r.data}, {r.hora}
                  </div>
                </td>

                <td style={tdStyle}>
                  <Badge
                    label={actionLabel[r.action] ?? r.action}
                    variant={actionBadge[r.action] || "gray"}
                  />
                </td>

               <td style={{ ...tdStyle, ...tdRightStyle }}>
                  <div
                    title={
                      r.entity === "Company" && r?.nomeEmpresa
                        ? `${entityLabel[r.entity] ?? r.entity} • ${r.nomeEmpresa}`
                        : entityLabel[r.entity] ?? r.entity
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: isMobile ? 8 : 10,

                      width: "100%",
                      maxWidth: isMobile ? "100%" : 280,

                      padding: isMobile ? "9px 10px" : "8px 11px",

                      borderRadius: 16,
                      background: visual.bg,
                      border: `1px solid ${visual.border}`,
                      color: visual.color,

                      boxSizing: "border-box",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: isMobile ? 28 : 30,
                        height: isMobile ? 28 : 30,
                        borderRadius: 12,
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <EntityIcon size={14} strokeWidth={2.4} />
                    </div>

                    <div
                      style={{
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          fontSize: isMobile ? 12 : 12.5,
                          fontWeight: 900,
                          lineHeight: 1.1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {entityLabel[r.entity] ?? r.entity}
                      </div>

                      {r.entity === "Company" && r?.nomeEmpresa && (
                        <div
                          style={{
                            marginTop: 4,
                            fontSize: isMobile ? 11 : 11.5,
                            fontWeight: 800,
                            lineHeight: 1.2,
                            color: "#334155",

                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {r.nomeEmpresa}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
)}
      </Card>
    </>
  );
}