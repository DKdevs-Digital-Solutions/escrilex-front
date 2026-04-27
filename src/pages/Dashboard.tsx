import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
  UserX,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { useDashboardSummary } from "../hooks/useDashboardSummary";

export type DashboardSummary = {
  period: {
    startDate: string;
    endDate: string;
  };
  cards: {
    newClients: number;
    inactiveClients: number;
    totalActive: number;
    totalInactive: number;
  };
};

export type DashboardSummaryParams = {
  startDate?: string;
  endDate?: string;
};



const API_URL = "https://escrilex-back.onrender.com";

export function DashboardPage() {
  

  const {
  data,
  loading,
  error,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  loadDashboard,

  
} = useDashboardSummary();





  useEffect(() => {
    loadDashboard();
  }, []);

  const periodLabel = useMemo(() => {
    if (!data) return "Período atual";

    const start = new Date(data.period.startDate).toLocaleDateString("pt-BR");
    const end = new Date(data.period.endDate).toLocaleDateString("pt-BR");

    return `${start} até ${end}`;
  }, [data]);

  const totalClients =
    (data?.cards.totalActive ?? 0) + (data?.cards.totalInactive ?? 0);

  const activeRate =
    totalClients > 0
      ? Math.round(((data?.cards.totalActive ?? 0) / totalClients) * 100)
      : 0;

  const insightText =
  (data?.cards.inactiveClients ?? 0) === 0
    ? "Nenhum cliente foi inativado neste período."
    : `${data?.cards.inactiveClients} cliente(s) foram inativados neste período.`;

  const chartData = [
    {
      name: "Novos",
      value: data?.cards.newClients ?? 0,
      color: "#2563eb",
    },
    {
      name: "Saíram",
      value: data?.cards.inactiveClients ?? 0,
      color: "#dc2626",
    },
    {
      name: "Ativos",
      value: data?.cards.totalActive ?? 0,
      color: "#059669",
    },
    {
      name: "Inativos",
      value: data?.cards.totalInactive ?? 0,
      color: "#ea580c",
    },
  ];

  const cards = [
    {
      title: "Clientes novos",
      value: data?.cards.newClients ?? 0,
      description: "Novos cadastros no período",
      icon: <Users size={22} />,
      bg: "linear-gradient(135deg, #eff6ff, #dbeafe)",
      color: "#2563eb",
      badge: "Entrada",
      badgeBg: "#dbeafe",
    },
    {
      title: "Clientes ativos",
      value: data?.cards.totalActive ?? 0,
      description: "Empresas atualmente ativas",
      icon: <Building2 size={22} />,
      bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
      color: "#059669",
      badge: "Ativos",
      badgeBg: "#d1fae5",
    },
    {
      title: "Clientes inativos",
      value: data?.cards.totalInactive ?? 0,
      description: "Empresas desativadas",
      icon: <UserX size={22} />,
      bg: "linear-gradient(135deg, #fff7ed, #ffedd5)",
      color: "#ea580c",
      badge: "Inativos",
      badgeBg: "#ffedd5",
    },
    {
      title: "Saíram no período",
      value: data?.cards.inactiveClients ?? 0,
      description: "Clientes inativados no filtro",
      icon: <ArrowDownRight size={22} />,
      bg: "linear-gradient(135deg, #fef2f2, #fee2e2)",
      color: "#dc2626",
      badge: "Saída",
      badgeBg: "#fee2e2",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100%",
        padding: 0,
        fontFamily: "Inter, system-ui, sans-serif",
        borderRadius: 8,
      }}
    >
      <style>
        {`
          @media (max-width: 900px) {
            .dashboard-header {
              flex-direction: column !important;
              align-items: flex-start !important;
            }

            .dashboard-filters {
              width: 100% !important;
              grid-template-columns: 1fr !important;
            }

            .dashboard-cards {
              grid-template-columns: 1fr !important;
            }

            .dashboard-main {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      <div
        style={{
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div
          className="dashboard-header"
          style={{
            padding: 28,
            background:
              "linear-gradient(135deg, #012942 0%, #012942 55%, #012942 100%)",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            gap: 22,
            borderRadius:8
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                display: "grid",
                placeItems: "center",
                background:
                  "linear-gradient(135deg, rgba(56,189,248,.28), rgba(34,197,94,.18))",
                border: "1px solid rgba(255,255,255,.28)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,.18), 0 14px 30px rgba(56,189,248,.18)",
              }}
            >
              <Activity size={27} color="#7dd3fc" />
            </div>

            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 8,
                  padding: "4px 9px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,.12)",
                  border: "1px solid rgba(255,255,255,.18)",
                  color: "#fde68a",
                  fontSize: 11,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                <Sparkles size={12} color="#facc15" />
                Dashboard executivo
              </div>

              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900 }}>
                Visão geral
              </h1>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "rgba(255,255,255,.76)",
                  fontSize: 13.5,
                }}
              >
                Acompanhe os principais indicadores da carteira de clientes.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              alignSelf: "flex-start",
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(16,185,129,.16)",
              color: "#d1fae5",
              border: "1px solid rgba(167,243,208,.32)",
              fontSize: 12,
              fontWeight: 900,
              whiteSpace: "nowrap",
            }}
          >
            <ShieldCheck size={15} color="#00ff7b" />
            Dados em tempo real
          </div>
        </div>

        <div style={{ padding:"0px", position:"relative", marginTop:"30px" }}>
          <div
            className="dashboard-filters"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: 12,
              marginBottom: 22,
              alignItems: "end",
            }}
          >
            <Field label="Data inicial">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={inputStyle}
              />
            </Field>

            <Field label="Data final">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={inputStyle}
              />
            </Field>

            <button
              onClick={loadDashboard}
              disabled={loading}
              style={{
                height: 46,
                padding: "0 18px",
                borderRadius: 14,
                border: "1px solid #012942",
                background: "#012942",
                color: "#fff",
                fontSize: 14,
                fontWeight: 900,
                cursor: loading ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 12px 22px rgba(1,41,66,.22)",
                width:"300px"
              }}
            >
              <RefreshCw size={16} />
              Atualizar
            </button>
          </div>

          {error && (
            <div
              style={{
                padding: 14,
                borderRadius: 14,
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#991b1b",
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 18,
              }}
            >
              {error}
            </div>
          )}

          <div
            className="dashboard-cards"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 16,
              marginBottom: 20,
            }}
          >
            {cards.map((card) => (
              <DashboardCard key={card.title} {...card} loading={loading} />
            ))}
          </div>

          <div
            className="dashboard-main"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 340px",
              gap: 16,
            }}
          >
            <div
              style={{
                borderRadius: 20,
                padding: 22,
                border: "1px solid #e2e8f0",
                background:
                  "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
                boxShadow: "0 12px 28px rgba(15,23,42,.06)",
              }}
            >
              <div style={{ marginBottom: 18 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 17,
                    fontWeight: 900,
                    color: "#0f172a",
                  }}
                >
                  Movimento de clientes
                </h3>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#64748b",
                    fontSize: 13,
                  }}
                >
                  {periodLabel}
                </p>
              </div>

              <div style={{ width: "100%", height: 310 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData} barSize={42}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: "#64748b",
                        fontWeight: 700,
                      }}
                    />
                    <YAxis
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(15,23,42,.04)" }}
                      contentStyle={{
                        borderRadius: 14,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 12px 28px rgba(15,23,42,.12)",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    />
                    <Bar dataKey="value" radius={[12, 12, 6, 6]}>
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 20,
                padding: 22,
                background:
                  "linear-gradient(135deg, #0f172a 0%, #012942 100%)",
                color: "#fff",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 130,
                  height: 130,
                  borderRadius: "50%",
                  background: "rgba(56,189,248,.16)",
                }}
              />

              <div style={{ position: "relative" }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 16,
                    display: "grid",
                    placeItems: "center",
                    background: "rgba(255,255,255,.12)",
                    border: "1px solid rgba(255,255,255,.18)",
                    marginBottom: 14,
                  }}
                >
                  <ArrowUpRight size={24} color="#7dd3fc" />
                </div>

                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900 }}>
                  Resumo do período
                </h3>

                <p
                  style={{
                    margin: "8px 0 18px",
                    color: "rgba(255,255,255,.72)",
                    fontSize: 13,
                    lineHeight: 1.55,
                  }}
                >
                  {insightText}
                </p>

                <div
                  style={{
                    padding: 15,
                    borderRadius: 16,
                    background: "rgba(255,255,255,.10)",
                    border: "1px solid rgba(255,255,255,.14)",
                    marginBottom: 12,
                  }}
                >
                  <div style={{ fontSize: 12, color: "#cbd5e1" }}>
                    Clientes ativos
                  </div>

                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 34,
                      fontWeight: 950,
                      letterSpacing: -1,
                      color: "#86efac",
                    }}
                  >
                    {loading ? "..." : `${activeRate}%`}
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      width: "100%",
                      height: 8,
                      borderRadius: 999,
                      background: "rgba(255,255,255,.14)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${activeRate}%`,
                        height: "100%",
                        borderRadius: 999,
                        background:
                          "linear-gradient(90deg, #22c55e, #7dd3fc)",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 9,
                  }}
                >
                  <MiniInfo label="Total de clientes" value={totalClients} />
                  <MiniInfo
                    label="Novos no período"
                    value={data?.cards.newClients ?? 0}
                  />
                  <MiniInfo
                    label="Saídas no período"
                    value={data?.cards.inactiveClients ?? 0}
                  />
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <p
              style={{
                margin: "18px 0 0",
                color: "#64748b",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Carregando dados do dashboard...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  description,
  icon,
  bg,
  color,
  badge,
  badgeBg,
  loading,
}: any) {
  return (
    <div
      style={{
        borderRadius: 20,
        padding: 18,
        background: "#fff",
        border: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 16,
            background: bg,
            color,
            display: "grid",
            placeItems: "center",
          }}
        >
          {React.cloneElement(icon, { color })}
        </div>

        <span
          style={{
            height: 26,
            padding: "0 9px",
            borderRadius: 999,
            display: "inline-flex",
            alignItems: "center",
            background: badgeBg,
            color,
            fontSize: 11,
            fontWeight: 900,
          }}
        >
          {badge}
        </span>
      </div>

      <strong
        style={{
          display: "block",
          color: "#0f172a",
          fontSize: 30,
          fontWeight: 950,
          letterSpacing: -1,
        }}
      >
        {loading ? "..." : value}
      </strong>

      <div
        style={{
          marginTop: 4,
          color: "#334155",
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        {title}
      </div>

      <p
        style={{
          margin: "5px 0 0",
          color: "#64748b",
          fontSize: 12.5,
          lineHeight: 1.45,
        }}
      >
        {description}
      </p>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 13,
        background: "rgba(255,255,255,.09)",
        border: "1px solid rgba(255,255,255,.12)",
      }}
    >
      <span
        style={{
          color: "rgba(255,255,255,.72)",
          fontSize: 12.5,
          fontWeight: 800,
        }}
      >
        {label}
      </span>

      <strong style={{ color: "#fff", fontSize: 14 }}>{value}</strong>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "grid", gap: 7 }}>
      <span
        style={{
          color: "#334155",
          fontSize: 12.5,
          fontWeight: 900,
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 46,
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#0f172a",
  padding: "0 13px",
  fontSize: 14,
  outline: "none",
};