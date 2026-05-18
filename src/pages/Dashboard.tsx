import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  Maximize2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
  UserX,
  X,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { useDashboardDrilldown } from "../hooks/useDashboardDrilldown";
import { useCompanies } from "../hooks/useCompanies";

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

type PremiumChartItem = {
  name: string;
  value: number;
};

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

const [modalChart, setModalChart] = useState<null | "movimento" | "clientes" | "responsibles">(null);
const [modalTab, setModalTab] = useState<"ativos" | "inativos" | "entradas" | "saidas" | "responsibles">("ativos");

type ModalTab = "ativos" | "inativos" | "entradas" | "saidas" | "responsibles";

const {
  items: companies = [],
  load,
} = useCompanies();

type DrilldownType = "entries" | "exits" | "tributacao" | "ramo" | "perfil" | "responsibles" | "changes";

const [selectedDrilldownType, setSelectedDrilldownType] =
  useState<DrilldownType>("entries");



const {
  data: drilldownData,
  loading: drilldownLoading,
  error: drilldownError,
  loadDrilldown,
  clearDrilldown
} = useDashboardDrilldown({
  type: selectedDrilldownType,
  startDate,
  endDate,
});


function openModal(
  chart: "movimento" | "clientes" | "responsibles",
  tab: ModalTab
) {
  clearDrilldown();

  setSelectedDrilldownLabel("");
  setSelectedDrilldownKey("");

  setModalChart(chart);
  setModalTab(tab);

  if (tab === "entradas") {
    setSelectedDrilldownType("entries");
  }

  if (tab === "saidas") {
    setSelectedDrilldownType("exits");
  }

  if (tab === "responsibles") {
    setSelectedDrilldownType("responsibles");
  }
}

useEffect(() => {
  if (!modalChart) return;
  if (modalTab === "ativos" || modalTab === "inativos") return;

  loadDrilldown();
}, [modalChart, modalTab, selectedDrilldownType, startDate, endDate]);


const activeCompanies = companies.filter((item: any) => item.active);

const inactiveCompanies = companies.filter((item: any) => !item.active);

const drilldownRows = drilldownData?.items || drilldownData?.data || [];

const normalizedDrilldownRows = drilldownRows.map((item: any) => {
  const company = item.company || item;

  return {
    ...company,
    department: item.department,
    newResponsible: item.newResponsible,
    changedBy: item.changedBy,
    date: item.date,
  };
});

const getModalRows = () => {
  if (modalTab === "ativos") return activeCompanies;
  if (modalTab === "inativos") return inactiveCompanies;

  return normalizedDrilldownRows;
};


function getStatusStyle(status?: string) {
  const normalized = status?.toUpperCase();

  switch (normalized) {
    case "ATIVA":
      return {
        bg: "rgba(34,197,94,.12)",
        border: "rgba(34,197,94,.22)",
        color: "#15803d",
        dot: "#22c55e",
        label: "Ativa",
      };

    case "SAIDA":
      return {
        bg: "rgba(239,68,68,.12)",
        border: "rgba(239,68,68,.18)",
        color: "#dc2626",
        dot: "#ef4444",
        label: "Saída",
      };

    case "ENCERRADA":
      return {
        bg: "rgba(100,116,139,.14)",
        border: "rgba(100,116,139,.18)",
        color: "#475569",
        dot: "#64748b",
        label: "Encerrada",
      };

    case "SUSPENSA":
      return {
        bg: "rgba(245,158,11,.12)",
        border: "rgba(245,158,11,.18)",
        color: "#d97706",
        dot: "#f59e0b",
        label: "Suspensa",
      };

    default:
      return {
        bg: "rgba(59,130,246,.10)",
        border: "rgba(59,130,246,.16)",
        color: "#2563eb",
        dot: "#3b82f6",
        label: status || "Sem status",
      };
  }
}

useEffect(() => {
  loadDashboard();
  load();
}, []);

 

  function formatDateBR(date: string) {
  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
}

const periodLabel = useMemo(() => {
  if (!startDate || !endDate) {
    return "Período atual";
  }

  return `${formatDateBR(startDate)} até ${formatDateBR(endDate)}`;
}, [startDate, endDate]);

  const totalClients =
    (data?.cards.totalActive ?? 0) + (data?.cards.totalInactive ?? 0);

  const activeRate =
    totalClients > 0
      ? Math.round(((data?.cards.totalActive ?? 0) / totalClients) * 100)
      : 0;

  const insightText =
  (data?.cards.exits?.total ?? 0) === 0
    ? "Nenhum cliente foi inativado neste período."
    : `${data?.cards.exits?.total} cliente(s) foram inativados neste período.`;

  const chartData = [
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

  const movementChartData = [
  {
    name: "Novos",
    value: data?.cards.entries?.total ?? 0,
    color: "#2563eb",
  },
  {
    name: "Saíram",
    value: data?.cards.exits?.total ?? 0,
    color: "#dc2626",
  },
];

  const cards = [
    {
      title: "Clientes novos",
      value: data?.cards?.entries?.total ?? 0,
      description: "Novos cadastros no período",
      icon: <Users size={22} />,
      bg: "linear-gradient(135deg, #eff6ff, #dbeafe)",
      color: "#2563eb",
      badge: "Entrada",
      badgeBg: "#dbeafe",
    },
    {
      title: "Saíram no período",
      value: data?.cards?.exits?.total ?? 0,
      description: "Clientes inativados no filtro",
      icon: <ArrowDownRight size={22} />,
      bg: "linear-gradient(135deg, #fef2f2, #fee2e2)",
      color: "#dc2626",
      badge: "Saída",
      badgeBg: "#fee2e2",
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
    
  ];

  type DashboardChartType =
  | "tributacao"
  | "ramo"
  | "perfil"
  | "exitReasons"
  | "responsibleByDepartment";

const [selectedChartType, setSelectedChartType] =
  useState<DashboardChartType>("tributacao");

const chartTypeLabels: Record<DashboardChartType, string> = {
  tributacao: "Tributação",
  ramo: "Ramo",
  perfil: "Perfil",
  exitReasons: "Motivos de saída",
  responsibleByDepartment: "Responsáveis por departamento",
};

const drilldownTypeByChartType: Record<DashboardChartType, DrilldownType> = {
  tributacao: "tributacao",
  ramo: "ramo",
  perfil: "perfil",
  responsibleByDepartment: "responsibles",
  exitReasons: "changes",
};

const premiumChartData: PremiumChartItem[] = useMemo(() => {
  const charts = data?.charts;

  if (!charts) return [];

  if (selectedChartType === "responsibleByDepartment") {
    return (charts.responsibleByDepartment ?? []).map((item) => ({
      name: item.department || "Não informado",
      value: item.total ?? 0,
    }));
  }

  return (charts[selectedChartType] ?? []).map((item: any) => ({
    name: item.key || "Não informado",
    value: item.total ?? 0,
  }));
}, [data, selectedChartType]);


      const isResponsibleChart =
  selectedChartType === "responsibleByDepartment";

  const premiumMiniBox: React.CSSProperties = {
  padding: 14,
  borderRadius: 16,
  background: "rgba(255,255,255,.10)",
  border: "1px solid rgba(255,255,255,.14)",
  display: "grid",
  gap: 5,
};


const [selectedDrilldownLabel, setSelectedDrilldownLabel] = useState("");
const [selectedDrilldownKey, setSelectedDrilldownKey] = useState("");

      
function openChartDrilldown(item: PremiumChartItem) {
  const drilldownType = drilldownTypeByChartType[selectedChartType];

  setSelectedDrilldownType(drilldownType);
  setSelectedDrilldownLabel(item.name);
  setSelectedDrilldownKey(item.name);

  setModalChart("clientes");
  setModalTab("entradas");

  loadDrilldown(drilldownType, item.name);
}

const isResponsibleModal = selectedDrilldownType === "responsibles";

function resetDrilldownModal() {
  setSelectedDrilldownLabel("");
  setSelectedDrilldownKey("");
}

function closeModal() {
  setModalChart(null);
  setModalTab("ativos");
  setSelectedDrilldownType("entries");
  setSelectedDrilldownLabel("");
  setSelectedDrilldownKey("");

  clearDrilldown();
}

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

          .dashboard-filters button {
            width: 100% !important;
          }

          .dashboard-cards {
            grid-template-columns: 1fr !important;
          }

          .dashboard-main {
            grid-template-columns: 1fr !important;
          }

          .dashboard-charts-grid {
            grid-template-columns: 1fr !important;
          }

          .chart{
           bottom: 40px !important;
          }

          .dashboard-main > *,
          .dashboard-charts-grid > * {
            min-width: 0 !important;
            width: 100% !important;
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
              <RefreshCw size={18} />
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
          gridTemplateColumns: "1fr 340px",
          gap: 16,
        }}
      >
        {/* ESQUERDA: 2 gráficos alinhados 50/50 */}
        <div
          className="dashboard-charts-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            minWidth: 0,
          }}
        >
          {/* GRÁFICO 1 */}
          <div
            
            style={{
              borderRadius: 20,
              padding: 22,
              border: "1px solid #e2e8f0",
              background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
              boxShadow: "0 12px 28px rgba(15,23,42,.06)",
            }}
          >
          <div style={{ marginBottom: 18, justifyContent:"space-between", display:"flex" }}>

             
            <h3
              style={{
                margin: 0,
                fontSize: 17,
                fontWeight: 900,
                color: "#0f172a",
              }}
            >
              Entradas x Saídas
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
         

      <div 
       onClick={() => {
        setModalChart("clientes");
      }}
      className="chart" style={{ width: "100%", height: 260, position: "relative" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart style={{cursor:"pointer"}}>
          <Pie
            data={movementChartData}
            dataKey="value"
            nameKey="name"
            innerRadius="58%"
            outerRadius="82%"
            paddingAngle={5}
            stroke="#fff"
            strokeWidth={1}
            onClick={(entry: any) => {
              if (entry.name === "Novos") {
                openModal("clientes", "entradas");
              }

              if (entry.name === "Saíram") {
                openModal("clientes", "saidas");
              }
            }}
            
          >
            {movementChartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 950,
              color: "#0f172a",
              lineHeight: 1,
            }}
          >
            {movementChartData
              .reduce((acc, item) => acc + item.value, 0)
              .toLocaleString("pt-BR")}
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 11,
              fontWeight: 800,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: ".08em",
            }}
          >
            Total
          </div>
        </div>
      </div>

      <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 10,
        marginTop: 12,
      }}
    >
      {movementChartData.map((item) => (
        <div
          key={item.name}
          style={{
            padding: "10px 12px",
            borderRadius: 14,
            background: "#f8fafc",
            border: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: item.color,
              }}
            />

            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#475569",
              }}
            >
              {item.name}
            </span>
          </div>

          <strong
            style={{
              fontSize: 14,
              fontWeight: 900,
              color: "#0f172a",
            }}
          >
            {item.value.toLocaleString("pt-BR")}
          </strong>
        </div>
      ))}
    </div>
    </div>
    </div>

    {/* GRÁFICO 2 */}
    <div
      style={{
        borderRadius: 20,
        padding: 22,
        border: "1px solid #e2e8f0",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
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
              Comparativo de clientes ativos e clientes inativos.
            </p>

        
      </div>

      <div 
       
      style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart
          onClick={(state: any) => {
          const name = state?.activePayload?.[0]?.payload?.name;
          setModalChart("movimento");
        }}
          data={chartData} barSize="70%" style={{cursor:"pointer"}}>
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
              tick={{
                fontSize: 12,
                fill: "#94a3b8",
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar
              dataKey="value"
              radius={[12, 12, 6, 6]}
              onClick={(entry: any) => {
                if (entry.name === "Ativos") {
                  openModal("movimento", "ativos");
                }

                if (entry.name === "Inativos") {
                  openModal("movimento", "inativos");
                }
              }}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} cursor="pointer" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>

  

  {/* DIREITA: resumo */}
  <div
    style={{
      position: "relative",
      overflow: "hidden",
      borderRadius: 20,
      padding: 22,
      background: "linear-gradient(135deg, #0f172a 0%, #012942 100%)",
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
              background: "linear-gradient(90deg, #22c55e, #7dd3fc)",
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
          value={data?.cards.entries?.total ?? 0}
        />
        <MiniInfo
          label="Saídas no período"
          value={data?.cards.exits?.total ?? 0}
        />
      </div>
    </div>
  </div>







{/* GRÁFICO 3 - PREMIUM */}
<div
  style={{
    gridColumn: "1 / -1",
    borderRadius: 24,
    padding: 24,
    border: "1px solid #e2e8f0",
    background:
      "radial-gradient(circle at top right, rgba(37,99,235,.10), transparent 34%), linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
    boxShadow: "0 18px 42px rgba(15,23,42,.08)",
    overflow: "hidden",
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 18,
      marginBottom: 24,
    }}
  >
    <div>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "5px 10px",
          borderRadius: 999,
          background: "#eff6ff",
          color: "#2563eb",
          fontSize: 11,
          fontWeight: 950,
          textTransform: "uppercase",
          letterSpacing: ".08em",
          marginBottom: 8,
        }}
      >
        Análise estratégica
      </span>

      <h3
        style={{
          margin: 0,
          fontSize: 20,
          fontWeight: 950,
          color: "#0f172a",
          letterSpacing: -0.4,
        }}
      >
        Distribuição por categoria
      </h3>
    </div>

    <div style={{ width: 230 }}>
      <select
        value={selectedChartType}
        onChange={(e) =>
          setSelectedChartType(e.target.value as DashboardChartType)
        }
        style={{
          ...inputStyle,
          height: 42,
          borderRadius: 14,
          fontSize: 13,
          fontWeight: 900,
          cursor: "pointer",
          boxShadow: "0 10px 22px rgba(15,23,42,.06)",
        }}
      >
        <option value="tributacao">Tributação</option>
        <option value="ramo">Ramo</option>
        <option value="perfil">Perfil</option>
        <option value="exitReasons">Motivos de saída</option>
        <option value="responsibleByDepartment">Responsáveis</option>
      </select>
    </div>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
      gap: 18,
      alignItems: "stretch",
      width: "100%",
    }}
  >
    {/* CARD ESQUERDA - 50% */}
    <div
      style={{
        borderRadius: 24,
        padding: 22,
        background:
          "radial-gradient(circle at top right, rgba(125,211,252,.22), transparent 34%), linear-gradient(135deg, #020617 0%, #012942 55%, #0f172a 100%)",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,.10)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,.08), 0 20px 42px rgba(2,6,23,.28)",
        minHeight: 260,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 180,
          height: 180,
          borderRadius: "50%",
          right: -70,
          top: -70,
          background: "radial-gradient(circle, rgba(56,189,248,.28), transparent 70%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,.04), transparent 28%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px",
            borderRadius: 999,
            background: "rgba(255,255,255,.08)",
            border: "1px solid rgba(255,255,255,.10)",
            backdropFilter: "blur(8px)",
            marginBottom: 18,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: "#22c55e",
              boxShadow: "0 0 0 5px rgba(34,197,94,.14)",
            }}
          />

          <span
            style={{
              fontSize: 11,
              color: "#cbd5e1",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: ".08em",
            }}
          >
            Total analisado
          </span>
        </div>

        <strong
          style={{
            display: "block",
            fontSize: 50,
            lineHeight: 1,
            fontWeight: 950,
            color: "#fff",
            letterSpacing: -2,
            textShadow: "0 10px 30px rgba(56,189,248,.24)",
          }}
        >
          {premiumChartData
            .reduce((acc, item) => acc + item.value, 0)
            .toLocaleString("pt-BR")}
        </strong>

        <div
          style={{
            marginTop: 8,
            color: "rgba(255,255,255,.58)",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          registros encontrados no período
        </div>

        
        <div
          style={{
            marginTop: 18,
            padding: 14,
            borderRadius: 18,
            background:
              "linear-gradient(135deg, rgba(255,255,255,.10), rgba(255,255,255,.04))",
            border: "1px solid rgba(255,255,255,.10)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              color: "rgba(255,255,255,.52)",
              fontSize: 10,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: ".10em",
              marginBottom: 6,
            }}
          >
            Categoria atual
          </div>

          <div
            style={{
              color: "#e0f2fe",
              fontSize: 15,
              fontWeight: 950,
              letterSpacing: -0.2,
            }}
          >
            {chartTypeLabels[selectedChartType]}
          </div>
        </div>
      </div>
    </div>

    {/* MAP DIREITA - 50% */}
    <div
      style={{
        display: "grid",
        gap: 12,
        alignContent: "start",
        minWidth: 0,
      }}
    >
      {premiumChartData.map((item, index) => {
        const total = premiumChartData.reduce((acc, row) => acc + row.value, 0);
        const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;

        const colors = ["#2563eb", "#059669", "#7c3aed", "#ea580c", "#dc2626"];
        const color = colors[index % colors.length];

        if (isResponsibleChart) {
          return (
            <div
              key={item.name}
              onClick={() => openChartDrilldown(item)}
              style={{
                padding: 14,
                borderRadius: 18,
                background: "#fff",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 24px rgba(15,23,42,.04)",
                height: 70,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                cursor: "pointer",

              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 10,
                }}
              >
                <strong
                  style={{
                    color: "#0f172a",
                    fontSize: 13,
                    fontWeight: 950,
                  }}
                >
                  {item.name}
                </strong>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <strong
                    style={{
                      color: "#0f172a",
                      fontSize: 14,
                      fontWeight: 950,
                    }}
                  >
                    {item.value.toLocaleString("pt-BR")}
                  </strong>

                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: 999,
                      background: `${color}14`,
                      color,
                      fontSize: 11,
                      fontWeight: 950,
                    }}
                  >
                    {percent}% 
                  </span>
                </div>
              </div>

              <div
                style={{
                  height: 10,
                  borderRadius: 999,
                  background: "#f1f5f9",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${percent}%`,
                    height: "100%",
                    borderRadius: 999,
                    background: `linear-gradient(90deg, ${color}, ${color}99)`,
                  }}
                />
              </div>
            </div>
          );
        }

        return (
          <button
            key={item.name}
            onClick={() => openChartDrilldown(item)}
            style={{
              border: "1px solid #e2e8f0",
              background: "#fff",
              borderRadius: 18,
              padding: "14px 16px",
              display: "grid",
              gridTemplateColumns: "44px 1fr auto",
              gap: 12,
              alignItems: "center",
              cursor: "pointer",
              textAlign: "left",
              boxShadow: "0 10px 24px rgba(15,23,42,.04)",
              minHeight: 72,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: `${color}14`,
                color,
                display: "grid",
                placeItems: "center",
                fontWeight: 950,
              }}
            >
              <Maximize2 /> 
            </div>

            <div style={{ minWidth: 0 }}>
              <strong
                style={{
                  display: "block",
                  color: "#0f172a",
                  fontSize: 14,
                  fontWeight: 950,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {chartTypeLabels[selectedChartType]}
              </strong>

              <span
                style={{
                  display: "block",
                  marginTop: 3,
                  color: "#64748b",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Clique para visualizar os registros
              </span>
            </div>

            <div
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                background: "#f8fafc",
                color: "#0f172a",
                fontSize: 15,
                fontWeight: 950,
              }}
            >
              {item.value}
            </div>
          </button>
        );
      })}

      {premiumChartData.length === 0 && (
        <div
          style={{
            padding: 24,
            textAlign: "center",
            borderRadius: 18,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            color: "#64748b",
            fontWeight: 800,
          }}
        >
          Nenhum dado encontrado para esta categoria.
        </div>
      )}
    </div>
  </div>
</div>
</div>





    {modalChart && (
  <div
    onClick={closeModal}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15,23,42,.55)",
      backdropFilter: "blur(6px)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "100%",
        maxWidth: 900,
        maxHeight: "90vh",
        overflow: "auto",
        borderRadius: 24,
        background: "#fff",
        padding: 24,
        boxShadow: "0 30px 80px rgba(15,23,42,.35)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 950 }}>
          {modalChart === "clientes" && selectedDrilldownLabel
            ? `${chartTypeLabels[selectedChartType]}: ${selectedDrilldownLabel}`
            : modalChart === "movimento"
              ? "Movimento de clientes"
              : "Entradas x Saídas"}
        </h2>

          {/* <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 13 }}>
            {periodLabel}
          </p> */}
        </div>

        <button
          onClick={closeModal}
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            background: "#f8fafc",
            cursor: "pointer",
            fontWeight: 900,
          }}
        >
          <X size={20} style={{top:"2px", position:"relative"}} /> 
        </button>
      </div>

     {!selectedDrilldownLabel && (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 12,
          marginTop: 22,
          marginBottom: 18,
        }}
      >
        {modalChart === "movimento" ? (
          <>
            <ModalOption
              active={modalTab === "ativos"}
              label="Ativos"
              value={data?.cards.totalActive ?? 0}
              color="#059669"
              onClick={() => openModal("movimento", "ativos")}
            />

            <ModalOption
              active={modalTab === "inativos"}
              label="Inativos"
              value={data?.cards.totalInactive ?? 0}
              color="#ea580c"
              onClick={() => openModal("movimento", "inativos")}
            />
          </>
        ) : (
          <>
            <ModalOption
              active={modalTab === "entradas"}
              label="Entradas"
              value={data?.cards.entries?.total ?? 0}
              color="#2563eb"
              onClick={() => openModal("clientes", "entradas")}
            />

            <ModalOption
              active={modalTab === "saidas"}
              label="Saídas"
              value={data?.cards.exits?.total ?? 0}
              color="#dc2626"
              onClick={() => openModal("clientes", "saidas")}
            />
          </>
        )}
      </div>
    )}

      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: !selectedDrilldownLabel ? 15 : 10,
          top: !selectedDrilldownLabel ? 0 : 10,
          overflow: "hidden",
          position:"relative"
        }}
      >
       
  {drilldownLoading ? (
    <div
      style={{
        minHeight: 280,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: "50%",
          border: "3px solid #dbeafe",
          borderTopColor: "#2563eb",
          animation: "spin 0.9s linear infinite",
        }}
      />

      <div
        style={{
          color: "#64748b",
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        Carregando detalhamento...
      </div>
    </div>
  ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13,
            tableLayout: "fixed",
          }}
        >
         <thead>
          {isResponsibleModal ? (
            <tr style={{ background: "#f8fafc" }}>
              <th style={thStyle}>Empresa</th>
              <th style={thStyle}>CNPJ</th>
              <th style={thStyle}>Departamento</th>
              <th style={thStyle}>Responsável</th>
              <th style={thStyle}>Data</th>
            </tr>
          ) : (
            <tr style={{ background: "#f8fafc" }}>
              <th style={thStyle}>Código</th>
              <th style={thStyle}>Empresa</th>
              <th style={thStyle}>CNPJ</th>
              <th style={thStyle}>Grupo</th>
              <th style={thStyle}>Situação</th>
            </tr>
          )}
        </thead>


         <tbody>
          {getModalRows().map((item: any) => {
            if (isResponsibleModal) {
              return (
                <tr key={`${item.id}-${item.date}`}>
                  <td style={tdStyle}>
                    <strong>{item.razaoSocial || "--"}</strong>
                    {item.nomeFantasia && (
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
                        {item.nomeFantasia}
                      </div>
                    )}
                  </td>

                  <td style={tdStyle}>
                    <span style={{ fontFamily: "monospace", fontSize: 12 }}>
                      {item.cnpj || "--"}
                    </span>
                  </td>

                  <td style={tdStyle}>{item.department || "--"}</td>

                  <td style={tdStyle}>
                    <strong>{item.newResponsible?.name || "--"}</strong>
                    {item.newResponsible?.email && (
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
                        {item.newResponsible.email}
                      </div>
                    )}
                  </td>

                  <td style={tdStyle}>
                    {item.date
                      ? new Date(item.date).toLocaleDateString("pt-BR")
                      : "--"}
                  </td>
                </tr>
              );
            }

            return (
              <tr key={item.id}>
                <td style={tdStyle}>{item.cod || "--"}</td>

                <td style={tdStyle}>
                  <strong>{item.razaoSocial || "--"}</strong>
                  {item.nomeFantasia && (
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>
                      {item.nomeFantasia}
                    </div>
                  )}
                </td>

                <td style={tdStyle}>
                  <span style={{ fontFamily: "monospace", fontSize: 12 }}>
                    {item.cnpj || "--"}
                  </span>
                </td>

                <td style={tdStyle}>
                  {item.grupo || item.department || item.newResponsible?.name || "--"}
                </td>

                <td style={tdStyle}>
                  {(() => {
                    const statusStyle = getStatusStyle(item.situacao);

                    return (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "7px 8px",
                          borderRadius: 999,
                          background: statusStyle.bg,
                          border: `1px solid ${statusStyle.border}`,
                          color: statusStyle.color,
                          fontWeight: 900,
                          fontSize: 11,
                          width: "110px",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: 999,
                            background: statusStyle.dot,
                          }}
                        />
                        {statusStyle.label}
                      </span>
                    );
                  })()}
                </td>
              </tr>
            );
          })}

          {!drilldownLoading && getModalRows().length === 0 && (
            <tr>
              <td
                colSpan={5}
                style={{
                  padding: 24,
                  textAlign: "center",
                  color: "#64748b",
                  fontWeight: 700,
                }}
              >
                Nenhum registro encontrado.
              </td>
            </tr>
          )}
        </tbody>
                </table>
                 )}
</div>
              </div>
            </div>
        )}

          

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

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const data = payload[0];

  return (
    <div
      style={{
        borderRadius: 14,
        border: "1px solid #e2e8f0",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 16px 40px rgba(15,23,42,.18)",
        padding: "10px 12px",
        minWidth: 120,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "#64748b",
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: data.payload.color,
            }}
          />
          <span
            style={{
              fontSize: 13,
              color: "#334155",
              fontWeight: 700,
            }}
          >
            Total
          </span>
        </div>

        <strong
          style={{
            fontSize: 14,
            color: "#0f172a",
            fontWeight: 900,
          }}
        >
          {data.value.toLocaleString("pt-BR")}
        </strong>
      </div>
    </div>
  );
}


const thStyle: React.CSSProperties = {
  padding: "12px 14px",
  textAlign: "center",
  color: "#475569",
  fontSize: 12,
  fontWeight: 900,
  borderBottom: "1px solid #e2e8f0",

};

const tdStyle: React.CSSProperties = {
  padding: "12px 14px",
  color: "#0f172a",
  fontWeight: 700,
  borderBottom: "1px solid #f1f5f9",
  textAlign:"center"
};

function ModalOption({
  active,
  label,
  value,
  color,
  onClick,
}: {
  active: boolean;
  label: string;
  value: number;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: active ? `2px solid ${color}` : "1px solid #e2e8f0",
        background: active ? "#f8fafc" : "#fff",
        borderRadius: 18,
        padding: 16,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <span
        style={{
          display: "block",
          color: "#64748b",
          fontSize: 12,
          fontWeight: 900,
          marginBottom: 6,
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color,
          fontSize: 26,
          fontWeight: 950,
        }}
      >
        {value.toLocaleString("pt-BR")}
      </strong>
    </button>
  );
}

