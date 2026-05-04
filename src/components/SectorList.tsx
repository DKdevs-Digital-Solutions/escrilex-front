import React from "react";
import { Badge, Card, Empty } from "../ui";
import { Pencil, PowerOff, Power, Building2,
  Cpu,
  Wallet,
  Briefcase,
  Shield,
  Users,
  Wrench,
  Headphones,
  FileText,
  FolderKanban,
  ChartColumn,
  Settings,
  Boxes,
  BadgeHelp,
 } from "lucide-react";



type Sector = {
  id: string;
  name: string;
  active: boolean;
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





type SectorListProps = {
  items: Sector[];
  onEdit: (sector: Sector) => void;
  onDisable: (id: string) => void;
  onActivate: (id: string) => void;
};

export function SectorList({
  items,
  onEdit,
  onDisable,
  onActivate,
}: SectorListProps) {

    const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "inactive" | null>(null);

    const totalCount = items.length;
    const activeCount = items.filter((item) => item.active).length;
    const inactiveCount = totalCount - activeCount;

    const activePercent = totalCount ? (activeCount / totalCount) * 100 : 0;
    const inactivePercent = totalCount ? (inactiveCount / totalCount) * 100 : 0;




const sectorGradients = [
  ["#2563eb", "#1d4ed8"], // azul
  ["#16a34a", "#15803d"], // verde
  ["#9333ea", "#7e22ce"], // roxo
  ["#ea580c", "#c2410c"], // laranja
  ["#0891b2", "#0e7490"], // cyan
  ["#dc2626", "#b91c1c"], // vermelho
  ["#4f46e5", "#4338ca"], // índigo
  ["#ca8a04", "#a16207"], // amarelo escuro
  ["#0f766e", "#115e59"], // teal
  ["#be185d", "#9d174d"], // pink
];

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return Math.abs(hash);
}


function getSectorVisual(name: string) {
  const cleanName = name.trim();
  // Pega a primeira letra e deixa em maiúsculo
  const initial = cleanName.charAt(0).toUpperCase();
  
  const hash = hashString(cleanName.toLowerCase());

  // Mantemos o cálculo do hash para as cores, para que cada letra 
  // tenha um gradiente consistente baseado no nome do setor
  const [c1, c2] = sectorGradients[hash % sectorGradients.length];

  return {
    initial, // Retornamos a letra em vez do Icon
    gradient: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
    shadow: `0 8px 18px ${hexToRgba(c1, 0.32)}`,
    softBg: hexToRgba(c1, 0.1),
    softBorder: hexToRgba(c1, 0.22),
    accent: c1,
  };
}


function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


const filteredItems = items.filter((item) => {
  if (statusFilter === "active") return item.active;
  if (statusFilter === "inactive") return !item.active;
  return true;
});


  return (
    <Card
      style={{
        borderRadius: 20,
        border: "1px solid #e5e7eb",
        background:
          "linear-gradient(180deg, #ffffff 0%, #fcfdff 100%)",
        boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
        overflow: "hidden",
        padding: 0,
      }}
    >
      {/* topo */}
      <div
        style={{
          padding: "18px 22px",
          borderBottom: "1px solid #eef2f7",
          background:
            "linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(255,255,255,1) 100%)",
        }}
      >
        <div style={{ display: "block", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          
          <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: 20,
    }}
  >
    <StatCard
        label="Total"
        value={totalCount}
        helper={totalCount === 1 ? "setor cadastrado" : "setores cadastrados"}
        color="#2563eb"
        softBg="rgba(37,99,235,0.10)"
        softBorder="rgba(37,99,235,0.18)"
        barWidth="100%"
        active={statusFilter === "all"}
        onClick={() => setStatusFilter("all")}
        />

        <StatCard
        label="Ativos"
        value={activeCount}
        helper="disponíveis para uso"
        color="#16a34a"
        softBg="rgba(22,163,74,0.10)"
        softBorder="rgba(22,163,74,0.18)"
        barWidth={`${activePercent}%`}
        active={statusFilter === "active"}
        onClick={() => setStatusFilter("active")}
        />

        <StatCard
        label="Inativos"
        value={inactiveCount}
        helper="temporariamente desativados"
        color="#dc2626"
        softBg="rgba(220,38,38,0.10)"
        softBorder="rgba(220,38,38,0.18)"
        barWidth={`${inactivePercent}%`}
        active={statusFilter === "inactive"}
        onClick={() => setStatusFilter("inactive")}
        />
  </div>

        </div>
      </div>


     
      {!items.length ? (
        <div style={{ padding: 28 }}>
            <Empty message="Nenhum setor cadastrado." />
        </div>
        ) : !filteredItems.length ? (
        <div style={{ padding: 28 }}>
            <Empty
            message={
                statusFilter === "active"
                ? "Nenhum setor ativo encontrado."
                : statusFilter === "inactive"
                ? "Nenhum setor inativo encontrado."
                : "Nenhum setor encontrado."
            }
            />
        </div>
        ) : (
        <div style={{ padding: 14 }}>
          <div
            style={{
              width: "100%",
              overflowX: "auto",
            }}
          >
            

            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: "0 10px",
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
               {filteredItems.map((s) => {
                    const visual = getSectorVisual(s.name);

                    return (
                        <tr key={s.id}
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
                            background: visual.gradient,
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: visual.shadow,
                            flexShrink: 0,
                            fontWeight:900
                        }}
                        >
                        {visual.initial}
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
                            {s.name}
                          </div>
                          <div
                            style={{
                                marginTop: 3,
                                fontSize: 12.5,
                                color: visual.accent,
                                fontWeight: 700,
                            }}
                            >
                            Setor registrado no sistema
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
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Badge
                          label={s.active ? "Ativo" : "Inativo"}
                          variant={s.active ? "green" : "red"}
                        />

                        <span
                          style={{
                            fontSize: 13,
                            color: s.active ? "#166534" : "#6b7280",
                            fontWeight: 600,
                          }}
                        >
                          {s.active ? "Disponível para uso" : "Temporariamente desativado"}
                        </span>
                      </div>
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
                        {s.active && (
                          <IconBtn
                            icon={<Pencil size={17} strokeWidth={3} />}
                            title="Editar"
                            onClick={() => onEdit(s)}
                          />
                        )}

                        {s.active ? (
                          <IconBtn
                            icon={<PowerOff size={17} strokeWidth={3} />}
                            title="Desativar"
                            onClick={() => onDisable(s.id)}
                            variant="danger"
                          />
                        ) : (
                          <IconBtn
                            icon={<Power size={17} strokeWidth={3} />}
                            title="Reativar"
                            onClick={() => onActivate(s.id)}
                            variant="success"
                          />
                        )}
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
            width: 14,
            height: 48,
            borderRadius: 999,
            background: softBg,
            position: "relative",
            overflow: "hidden",
            border: `1px solid ${softBorder}`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: barWidth,
              background: color,
              borderRadius: 999,
              transition: "height 0.2s ease",
            }}
          />
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