import React from "react";
import {
  Badge,
  Card,
  Empty,
} from "../ui";
import {
  Pencil,
  UserX,
  Users,
  Shield,
  UserCheck,
  UserMinus,
  Mail,
  Briefcase,
  PowerOff,
} from "lucide-react";

const ROLE_BADGES: Record<string, any> = {
  ADMIN: "dark",
  GESTOR_EMPRESA: "blue",
  OPERADOR: "green",
  LEITURA: "gray",
};

type UserItem = {
  id: string;
  name: string;
  email: string;
  active: boolean;
  roles?: string[];
  sector?: {
    id: string;
    name: string;
  } | null;
};

function IconBtn({
  icon,
  title,
  onClick,
  variant = "secondary",
}: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  variant?: "secondary" | "danger" | "success";
}) {
  const base = {
    secondary: {
      bg: "#ffffff",
      color: "#334155",
      border: "#e2e8f0",
      hover: "#eff6ff",
      hoverBorder: "#93c5fd",
      shadow: "0 4px 10px rgba(15,23,42,0.06)",
    },
    danger: {
      bg: "#ffffff",
      color: "#dc2626",
      border: "#fecaca",
      hover: "#fff1f2",
      hoverBorder: "#fda4af",
      shadow: "0 4px 10px rgba(220,38,38,0.10)",
    },
    success: {
      bg: "#ffffff",
      color: "#16a34a",
      border: "#bbf7d0",
      hover: "#f0fdf4",
      hoverBorder: "#86efac",
      shadow: "0 4px 10px rgba(22,163,74,0.10)",
    },
  }[variant];

  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        border: `1px solid ${base.border}`,
        background: base.bg,
        color: base.color,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.18s ease",
        boxShadow: base.shadow,
        fontFamily: "inherit",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = base.hover;
        e.currentTarget.style.borderColor = base.hoverBorder;
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = base.bg;
        e.currentTarget.style.borderColor = base.border;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {icon}
    </button>
  );
}

function StatCard({
  label,
  value,
  helper,
  color,
  softBg,
  softBorder,
  barWidth,
  active = false,
  onClick,
  icon,
}: {
  label: string;
  value: number;
  helper: string;
  color: string;
  softBg: string;
  softBorder: string;
  barWidth: string;
  active?: boolean;
  onClick?: () => void;
  icon: React.ReactNode;
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
        border: `1px solid ${active ? color : softBorder}`,
        boxShadow: active
          ? `0 10px 24px ${softBg}`
          : "0 8px 20px rgba(15,23,42,0.05)",
        cursor: "pointer",
        textAlign: "left",
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

      <div
        style={{
          marginTop: 14,
          height: 8,
          borderRadius: 999,
          background: "#eef2f7",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: barWidth,
            height: "100%",
            borderRadius: 999,
            background: color,
            transition: "width 0.2s ease",
          }}
        />
      </div>
    </button>
  );
}

type UserListProps = {
  users: UserItem[];
  onEdit: (user: UserItem) => void;
  onDisable: (id: string) => void;
};

export function UserList({
  users,
  onEdit,
  onDisable,
}: UserListProps) {
  const [statusFilter, setStatusFilter] = React.useState<"active" | "inactive" | null>(null);

  const totalCount = users.length;
  const activeCount = users.filter((u) => u.active).length;
  const inactiveCount = totalCount - activeCount;

  const activePercent = totalCount ? (activeCount / totalCount) * 100 : 0;
  const inactivePercent = totalCount ? (inactiveCount / totalCount) * 100 : 0;

  const [hoveredRoles, setHoveredRoles] = React.useState<string | null>(null);

  const filteredUsers =
    statusFilter === null
      ? users
      : users.filter((u) => (statusFilter === "active" ? u.active : !u.active));

  return (
    <Card
      style={{
        borderRadius: 20,
        border: "1px solid #e5e7eb",
        background: "linear-gradient(180deg, #ffffff 0%, #fcfdff 100%)",
        boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
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
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
         

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            <StatCard
              label="Total"
              value={totalCount}
              helper={totalCount === 1 ? "usuário cadastrado" : "usuários cadastrados"}
              color="#2563eb"
              softBg="rgba(37,99,235,0.10)"
              softBorder="rgba(37,99,235,0.18)"
              barWidth="100%"
              active={statusFilter === null}
              onClick={() => setStatusFilter(null)}
              icon={<Users size={18} strokeWidth={2.2} />}
            />

            <StatCard
              label="Ativos"
              value={activeCount}
              helper="com acesso liberado"
              color="#16a34a"
              softBg="rgba(22,163,74,0.10)"
              softBorder="rgba(22,163,74,0.18)"
              barWidth={`${activePercent}%`}
              active={statusFilter === "active"}
              onClick={() => setStatusFilter("active")}
              icon={<UserCheck size={18} strokeWidth={2.2} />}
            />

            <StatCard
              label="Inativos"
              value={inactiveCount}
              helper="com acesso desativado"
              color="#dc2626"
              softBg="rgba(220,38,38,0.10)"
              softBorder="rgba(220,38,38,0.18)"
              barWidth={`${inactivePercent}%`}
              active={statusFilter === "inactive"}
              onClick={() => setStatusFilter("inactive")}
              icon={<UserMinus size={18} strokeWidth={2.2} />}
            />
          </div>
        </div>
      </div>

      {!users.length ? (
        <div style={{ padding: 28 }}>
          <Empty message="Nenhum usuário cadastrado." />
        </div>
      ) : !filteredUsers.length ? (
        <div style={{ padding: 28 }}>
          <Empty
            message={
              statusFilter === "active"
                ? "Nenhum usuário ativo encontrado."
                : "Nenhum usuário inativo encontrado."
            }
          />
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
                  <th
                    style={{
                      textAlign: "left",
                      padding: "0 14px 6px 14px",
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#94a3b8",
                      fontWeight: 800,
                    }}
                  >
                    Usuário
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "0 14px 6px 14px",
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#94a3b8",
                      fontWeight: 800,
                    }}
                  >
                    Setor
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "0 14px 6px 14px",
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#94a3b8",
                      fontWeight: 800,
                    }}
                  >
                    Perfis
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "0 14px 6px 14px",
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#94a3b8",
                      fontWeight: 800,
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "0 14px 6px 14px",
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#94a3b8",
                      fontWeight: 800,
                    }}
                  >
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    style={{
                      background: "#ffffff",
                      boxShadow: "0 6px 18px rgba(15,23,42,0.05)",
                    }}
                    onMouseOver={(e) => {
                      const row = e.currentTarget;
                      row.style.transform = "translateY(-1px)";
                      row.style.transition = "all 0.18s ease";
                      row.style.boxShadow = "0 10px 24px rgba(37,99,235,0.08)";
                    }}
                    onMouseOut={(e) => {
                      const row = e.currentTarget;
                      row.style.transform = "translateY(0)";
                      row.style.boxShadow = "0 6px 18px rgba(15,23,42,0.05)";
                    }}
                  >
                    <td
                      style={{
                        padding: "16px 14px",
                        borderTopLeftRadius: 16,
                        borderBottomLeftRadius: 16,
                        borderTop: "1px solid #edf2f7",
                        borderBottom: "1px solid #edf2f7",
                        borderLeft: "1px solid #edf2f7",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: 14,
                            background: u.active
                              ? "#BB9F58"
                              : "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: u.active
                              ? "0 8px 18px rgba(37,99,235,0.25)"
                              : "0 8px 18px rgba(100,116,139,0.22)",
                            flexShrink: 0,
                          }}
                        >
                          <Users size={18} strokeWidth={2.2} />
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: 14.5,
                              fontWeight: 800,
                              color: "#0f172a",
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {u.name}
                          </div>

                          <div
                            style={{
                              marginTop: 4,
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              fontSize: 12.5,
                              color: "#64748b",
                            }}
                          >
                            <Mail size={13} strokeWidth={2.2} />
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td
                      style={{
                        padding: "16px 14px",
                        borderTop: "1px solid #edf2f7",
                        borderBottom: "1px solid #edf2f7",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "7px 10px",
                          borderRadius: 999,
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          fontSize: 12.5,
                          color: "#334155",
                          fontWeight: 700,
                        }}
                      >
                        <Briefcase size={13} strokeWidth={2.2} />
                        {u.sector?.name ?? "Sem setor"}
                      </div>
                    </td>

                    <td
                      style={{
                        padding: "16px 14px",
                        borderTop: "1px solid #edf2f7",
                        borderBottom: "1px solid #edf2f7",
                      }}
                    >
                      {(() => {
                        const roles = u.roles || [];

                        const visibleRoles = roles.slice(0, 1);

                        const hiddenCount = Math.max(roles.length - 1, 0);

                        return (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {visibleRoles.map((r: string) => (
                              <div key={r} style={{ flexShrink: 0 }}>
                                <Badge
                                  label={r}
                                  variant={ROLE_BADGES[r] || "gray"}
                                />
                              </div>
                            ))}

                           {hiddenCount > 0 && (
                            <div
                              title={roles.slice(1).join(", ")}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: 28,
                                minWidth: 28,
                                padding: "0 10px",
                                borderRadius: 999,
                                background: "rgba(37,99,235,.08)",
                                border: "1px solid rgba(37,99,235,.16)",
                                color: "#2563eb",
                                fontSize: 11,
                                fontWeight: 900,
                                cursor: "help",
                                flexShrink: 0,
                                position: "relative",
                                zIndex: 10,
                                
                              }}
                            >
                              +{hiddenCount}
                            </div>
                          )}
                          </div>
                        );
                      })()}
                    </td>

                    <td
                      style={{
                        padding: "16px 14px",
                        borderTop: "1px solid #edf2f7",
                        borderBottom: "1px solid #edf2f7",
                      }}
                    >
                      <Badge
                        label={u.active ? "Ativo" : "Inativo"}
                        variant={u.active ? "green" : "red"}
                      />
                    </td>

                    <td
                      style={{
                        padding: "16px 14px",
                        textAlign: "right",
                        borderTop: "1px solid #edf2f7",
                        borderBottom: "1px solid #edf2f7",
                        borderRight: "1px solid #edf2f7",
                        borderTopRightRadius: 16,
                        borderBottomRightRadius: 16,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          justifyContent: "flex-end",
                        }}
                      >
                        <IconBtn
                          icon={<Pencil size={17} strokeWidth={3} />}
                          title="Editar"
                          onClick={() => onEdit(u)}
                        />

                        {u.active && (
                          <IconBtn
                            icon={<PowerOff size={17} strokeWidth={2.5} />}
                            title="Desativar"
                            onClick={() => onDisable(u.id)}
                            variant="danger"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Card>
  );
}