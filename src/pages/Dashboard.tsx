import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  Maximize2,
  RefreshCcw,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserCog,
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
  RadialBar,
  RadialBarChart,
  PolarAngleAxis,
  RadarChart,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  Sector,
  PieLabelRenderProps,
  PieSectorShapeProps,
  LabelProps,
  CartesianGrid,
  LabelList,
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

const [modalChart, setModalChart] = useState<
  null | "movimento" | "clientes" | "responsibles" | "alterations" | "responsibleChanges"
>(null);
const [modalTab, setModalTab] = useState<"ativos" | "Encerrada" | "entradas" | "saidas" | "responsibles">("ativos");

type ModalTab = "ativos" | "Encerrada" | "entradas" | "saidas" | "responsibles";

const {
  items: companies = [],
  load,
} = useCompanies();

type DrilldownType = "entries" | "exits" | "tributacao" | "ramo" | "perfil" | "responsibles" | "changes";

const [selectedDrilldownType, setSelectedDrilldownType] =
  useState<DrilldownType>("entries");


const [selectedDrilldownLabel, setSelectedDrilldownLabel] = useState("");
const [selectedDrilldownKey, setSelectedDrilldownKey] = useState("");


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

  if (isChartFilterModal()) {
    return;
  }

  if (modalTab === "ativos" || modalTab === "Encerrada") {
    return;
  }

  loadDrilldown();
}, [
  modalChart,
  modalTab,
  selectedDrilldownType,
  selectedDrilldownKey,
  startDate,
  endDate,
]);


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


function normalizeValue(value: any) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function isChartFilterModal() {
  return (
    selectedDrilldownType === "tributacao" ||
    selectedDrilldownType === "ramo" ||
    selectedDrilldownType === "perfil"
  );
}

function getChartFilterRows() {
  if (!selectedDrilldownKey) return [];

  return companies.filter((company: any) => {
    if (selectedDrilldownType === "tributacao") {
      return normalizeValue(company.tributacao) === normalizeValue(selectedDrilldownKey);
    }

    if (selectedDrilldownType === "ramo") {
      return normalizeValue(company.ramo) === normalizeValue(selectedDrilldownKey);
    }

    if (selectedDrilldownType === "perfil") {
      return normalizeValue(company.perfil) === normalizeValue(selectedDrilldownKey);
    }

    return false;
  });
}


const getModalRows = () => {
  if (isChartFilterModal()) {
    return getChartFilterRows();
  }

  if (modalTab === "ativos") return activeCompanies;
  if (modalTab === "Encerrada") return inactiveCompanies;

  return normalizedDrilldownRows;
};

function getExtraColumnByDrilldown() {
  if (selectedDrilldownType === "tributacao") {
    return {
      label: "Tributação",
      key: "tributacao",
    };
  }

  if (selectedDrilldownType === "ramo") {
    return {
      label: "Ramo",
      key: "ramo",
    };
  }

  if (selectedDrilldownType === "perfil") {
    return {
      label: "Perfil",
      key: "perfil",
    };
  }

  return null;
}


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

    case "ENCERRADA":
      return {
        bg: "rgba(239,68,68,.12)",
        border: "rgba(239,68,68,.18)",
        color: "#dc2626",
        dot: "#ef4444",
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
  (data?.cards?.inactiveClients ?? 0) === 0
    ? "Nenhum cliente foi inativado neste período."
    : `${data?.cards?.inactiveClients} cliente(s) foram inativados neste período.`;

  const chartData = [
    {
      name: "Ativos",
      value: data?.cards.totalActive ?? 0,
      color: "#059669",
    },
    {
      name: "Encerrados",
      value: data?.cards.totalInactive ?? 0,
      color: "#ea580c",
    },
  ];

  const movementChartData = [
  {
    name: "Novos",
    value: data?.cards?.newClients?? 0,
    color: "#2563eb",
  },
  {
    name: "Saíram",
    value: data?.cards?.inactiveClients ?? 0,
    color: "#dc2626",
  },
];

 const cards = [
  {
    title: "Clientes novos",
    value: data?.cards?.newClients ?? 0,
    description: "Novos cadastros no período",
    icon: <Users size={22} />,
    bg: "linear-gradient(135deg, #eff6ff, #dbeafe)",
    color: "#2563eb",
    badge: "Entrada",
    badgeBg: "#dbeafe",
    onClick: () => { setModalChart("clientes"); setModalTab("entradas");}

  },
  {
    title: "Saíram no período",
    value: data?.cards?.inactiveClients ?? 0,
    description: "Clientes inativados no filtro",
    icon: <ArrowDownRight size={22} />,
    bg: "linear-gradient(135deg, #fef2f2, #fee2e2)",
    color: "#dc2626",
    badge: "Saída",
    badgeBg: "#fee2e2",
    onClick: () => { setModalChart("clientes"); setModalTab("saidas") }

  },
  // {
  //   title: "Clientes ativos",
  //   value: data?.cards?.totalActive ?? 0,
  //   description: "Empresas atualmente ativas",
  //   icon: <Building2 size={22} />,
  //   bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
  //   color: "#059669",
  //   badge: "Ativos",
  //   badgeBg: "#d1fae5",
  //   onClick: () => { setModalChart("movimento"); setModalTab("ativos") }

  // },
  // {
  //   title: "Clientes inativos",
  //   value: data?.cards?.totalInactive ?? 0,
  //   description: "Empresas desativadas",
  //   icon: <UserX size={22} />,
  //   bg: "linear-gradient(135deg, #fff7ed, #ffedd5)",
  //   color: "#ea580c",
  //   badge: "Inativos",
  //   badgeBg: "#ffedd5",
  //   onClick: () => { setModalChart("movimento"); setModalTab("inativos") }

  // },
  {
    title: "Alterações",
    value: data?.cards?.alterations ?? 0,
    description: "Alterações realizadas no período",
    icon: <RefreshCcw size={22} />,
    bg: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
    color: "#7c3aed",
    badge: "Mudanças",
    badgeBg: "#ede9fe",
    onClick: () => setModalChart("alterations"),
  },
  {
    title: "Trocas de responsável",
    value: data?.cards?.responsibleChanges ?? 0,
    description: "Clientes com responsável alterado",
    icon: <UserCog size={22} />,
    bg: "linear-gradient(135deg, #f0fdfa, #ccfbf1)",
    color: "#0f766e",
    badge: "Responsável",
    badgeBg: "#ccfbf1",
    onClick: () => setModalChart("responsibleChanges"),
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


const taxationChartData = (data?.charts?.taxation ?? []).map((item: any) => ({
  name: item.label,
  value: item.total,
  color: "#7c3aed",
}));

const activityBranchChartData = (data?.charts?.activityBranch ?? []).map((item: any) => ({
  name: item.label,
  value: item.total,
  color: "#2563eb",
}));

const profileChartData = (data?.charts?.profile ?? []).map((item: any) => ({
  name: item.label,
  value: item.total,
  color: "#0f766e",
}));


    


      


const isResponsibleModal = selectedDrilldownType === "responsibles";



function closeModal() {
  setModalChart(null);
  setModalTab("ativos");
  setSelectedDrilldownType("entries");
  setSelectedDrilldownLabel("");
  setSelectedDrilldownKey("");

  clearDrilldown();
}

const comparisons = data?.comparisons;

const getMovementComparison = (name: string) => {
  if (name === "Novos") return comparisons?.entries;
  if (name === "Saíram") return comparisons?.exits;

  return null;
};

const [isMobile, setIsMobile] = React.useState(false);

React.useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth <= 999);
  };

  checkMobile();

  window.addEventListener("resize", checkMobile);

  return () => {
    window.removeEventListener("resize", checkMobile);
  };
}, []);

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
              border: "2px solid #e2e8f0",
              background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
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
      {movementChartData.map((item) => {
      const comparison = getMovementComparison(item.name);
      const percent = comparison?.growthPercent ?? 0;
      const isPositive = percent >= 0;

      return (
        <div
          key={item.name}
          onClick={() => {
            openModal(
              "clientes",
              item.name === "Novos" ? "entradas" : "saidas"
            );
          }}
          style={{
            padding: "10px 12px",
            borderRadius: 14,
            background: "#f8fafc",
            border: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            cursor: "pointer",
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,

              flexWrap: "wrap",
            }}
          >
            {/* <span
              style={{
                fontSize: 11,
                fontWeight: 900,
                color: isPositive ? "#16a34a" : "#dc2626",
                background: isPositive
                  ? "rgba(22,163,74,.10)"
                  : "rgba(220,38,38,.10)",

                border: `1px solid ${
                  isPositive
                    ? "rgba(22,163,74,.18)"
                    : "rgba(220,38,38,.18)"
                }`,

                padding: "3px 7px",
                borderRadius: 999,

                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {isPositive ? "+" : ""}
              {percent}%
            </span> */}

            <strong
              style={{
                fontSize: 14,
                fontWeight: 900,
                color: "#0f172a",

                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.value.toLocaleString("pt-BR")}
            </strong>
          </div>
        </div>
      );
    })}
    </div>
    </div>
    </div>

    {/* GRÁFICO 2 */}
    <div
      style={{
        borderRadius: 20,
        padding: 22,
        border: "2px solid #e2e8f0",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
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

                if (entry.name === "Encerrada") {
                  openModal("movimento", "Encerrada");
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
          value={data?.cards?.newClients ?? 0}
        />
        <MiniInfo
          label="Saídas no período"
          value={data?.cards?.inactiveClients ?? 0}
        />
      </div>
    </div>
  </div>
  </div>

  <div
  className="dashboard-charts-grid"
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16,
    marginTop: 16,
    height:"400px"
  }}
>
 <TaxationDistributionChart
  data={taxationChartData}
  onItemClick={(item) => {
    setSelectedChartType("tributacao");
    setSelectedDrilldownType("tributacao");
    setSelectedDrilldownLabel(item.name);
    setSelectedDrilldownKey(item.name);
    setModalChart("clientes");
  }}
/>

<ActivityBranchRadialChart
  data={activityBranchChartData}
  onItemClick={(item) => {
    setSelectedChartType("ramo");
    setSelectedDrilldownType("ramo");
    setSelectedDrilldownLabel(item.name);
    setSelectedDrilldownKey(item.name);
    setModalChart("clientes");
  }}
/>

<ProfileRadarChart
  data={profileChartData}
  onItemClick={(item) => {
    setSelectedChartType("perfil");
    setSelectedDrilldownType("perfil");
    setSelectedDrilldownLabel(item.name);
    setSelectedDrilldownKey(item.name);
    setModalChart("clientes");
  }}
/>
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
      padding: isMobile ? 10 : 20,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
    onClick={(e) => e.stopPropagation()}
    style={{
      width: "100%",
      maxWidth: isMobile ? "95%" : 900,
      maxHeight: "90vh",
      overflow: "auto",
      borderRadius: 24,
      background: "#fff",
      padding: isMobile ? 16 : 24,
      boxShadow: "0 30px 80px rgba(15,23,42,.35)",
    }}
  >
      <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
      }}>
        <div>
  <h2
    style={{
      margin: 0,
      fontSize: isMobile ? 18 : 22,
      lineHeight: 1.2,  
      fontWeight: 950,
      color: "#0f172a",
      letterSpacing: "-0.02em",
    }}
  >
    {modalChart === "alterations"
      ? "Alterações no período"
      : modalChart === "responsibleChanges"
        ? "Trocas de responsável"
        : modalChart === "clientes" && selectedDrilldownLabel
          ? `${chartTypeLabels[selectedChartType]}: ${selectedDrilldownLabel}`
          : modalChart === "movimento"
            ? "Movimento de clientes"
            : "Entradas x Saídas"}
        </h2>

        <p
          style={{
            margin: "6px 0 0",
            color: "#64748b",
            fontSize: 13,
            lineHeight: 1.5,
            fontWeight: 500,
            maxWidth: 520,
          }}
        >
          {modalChart === "alterations"
            ? "Visualize os tipos de alterações realizadas nas empresas durante o período selecionado."
            : modalChart === "responsibleChanges"
              ? "Acompanhe as movimentações de responsáveis por departamento e quantidade de empresas impactadas."
              : modalChart === "movimento"
                ? "Consulte empresas ativas, inativas e movimentações registradas no período."
                : "Detalhamento completo das entradas e saídas registradas no dashboard."}
        </p>

        <div
          style={{
            marginTop: 10,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 10px",
            borderRadius: 999,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            color: "#475569",
            fontSize: 11,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: ".04em",
          }}
        >
          <CalendarDays size={13} />
          {periodLabel}
        </div>
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
          <X size={20} style={{ top: "2px", position: "relative" }} />
        </button>
      </div>

      {modalChart !== "alterations" && modalChart !== "responsibleChanges" && !selectedDrilldownLabel && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
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
                active={modalTab === "Encerrada"}
                label="Encerrados"
                value={data?.cards.totalInactive ?? 0}
                color="#ea580c"
                onClick={() => openModal("movimento", "Encerrada")}
              />
            </>
          ) : (
            <>
              <ModalOption
                active={modalTab === "entradas"}
                label="Entradas"
                value={data?.cards?.newClients ?? 0}
                color="#2563eb"
                onClick={() => openModal("clientes", "entradas")}
              />

              <ModalOption
                active={modalTab === "saidas"}
                label="Saídas"
                value={data?.cards?.inactiveClients ?? 0}
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
          overflowX: "auto",
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
          position: "relative",
          marginTop:
            modalChart === "alterations" || modalChart === "responsibleChanges"
              ? 22
              : 0,
        }}
      >
        {modalChart === "alterations" ? (
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={thStyle}>Tipo de alteração</th>
                <th style={thStyle}>Total</th>
              </tr>
            </thead>

            <tbody>
              {(data?.charts?.alterations ?? []).map((item: any) => (
                <tr key={item.label}>
                  <td style={tdStyle}>
                    <strong>{item.label || "--"}</strong>
                  </td>

                  <td style={tdStyle}>
                    {item.total?.toLocaleString("pt-BR") ?? 0}
                  </td>
                </tr>
              ))}

              {(data?.charts?.alterations ?? []).length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    style={{
                      padding: 24,
                      textAlign: "center",
                      color: "#64748b",
                      fontWeight: 700,
                    }}
                  >
                    Nenhuma alteração encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : modalChart === "responsibleChanges" ? (
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={thStyle}>Departamento</th>
                <th style={thStyle}>Trocas</th>
                <th style={thStyle}>Empresas</th>
              </tr>
            </thead>

            <tbody>
              {(data?.charts?.responsibleChanges?.byDepartment ?? []).map(
                (item: any) => (
                  <tr key={item.label}>
                    <td style={tdStyle}>
                      <strong>{item.label || "--"}</strong>
                    </td>

                    <td style={tdStyle}>
                      {item.total?.toLocaleString("pt-BR") ?? 0}
                    </td>

                    <td style={tdStyle}>
                      {item.companiesTotal?.toLocaleString("pt-BR") ?? 0}
                    </td>
                  </tr>
                )
              )}

              {(data?.charts?.responsibleChanges?.byDepartment ?? []).length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      padding: 24,
                      textAlign: "center",
                      color: "#64748b",
                      fontWeight: 700,
                    }}
                  >
                    Nenhuma troca de responsável encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : drilldownLoading ? (
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
          <table style={tableStyle}>
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
                (() => {
                  const extraColumn = getExtraColumnByDrilldown();

                  return (
                    <tr style={{ background: "#f8fafc" }}>
                      <th style={thStyle}>Código</th>
                      <th style={thStyle}>Empresa</th>
                      <th style={thStyle}>CNPJ</th>
                      <th style={thStyle}>Grupo</th>

                      {extraColumn && <th style={thStyle}>{extraColumn.label}</th>}

                      <th style={thStyle}>Status</th>
                    </tr>
                  );
                })()
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
                    <td style={tdStyle}>
                      <span style={{
                         fontSize: "13px",
                            display: "block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                      }}>
                        {item.cod || "--"}
                      </span>
                      </td>

                    <td style={tdStyle}>
                      <strong
                        style={{
                            fontSize: "13px",
                            display: "block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                          }}
                          title={item.razaoSocial}
                        >
                          {item.razaoSocial || "--"}
                        </strong>
                      {item.nomeFantasia && (
                        <div style={{  color: "#64748b", marginTop: 3, fontSize: "11px",
                            display: "block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",}}>
                          {item.nomeFantasia} 
                        </div>
                      )}
                    </td>

                    <td style={tdStyle}>
                      <span style={{ fontFamily: "monospace",  fontSize: "13px",
                            display: "block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",}}>
                        {item.cnpj || "--"}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <span style={{
                         fontSize: "13px",
                            display: "block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                      }}>
                      {item.grupo || item.department || item.newResponsible?.name || "--"}

                      </span>
                    </td>

                    {(() => {
                      const extraColumn = getExtraColumnByDrilldown();

                      if (!extraColumn) return null;

                      return (
                        <td style={tdStyle}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "7px 10px",
                              borderRadius: 999,
                              background: "rgba(37,99,235,.08)",
                              border: "1px solid rgba(37,99,235,.14)",
                              color: "#2563eb",
                              fontSize: 11.5,
                              fontWeight: 900,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={item[extraColumn.key]}
                          >
                            {item[extraColumn.key] || "--"}
                          </span>
                        </td>
                      );
                    })()}

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

              {getModalRows().length === 0 && (
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
  onClick
}: any) {
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 20,
        padding: 18,
        background: "#fff",
        border: "2px solid #e2e8f0",
        cursor: "pointer",
        transition:
          "all 0.18s ease, transform 0.15s ease, box-shadow 0.18s ease",
        boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = `1px solid ${color}`;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow =
          "0 10px 30px rgba(59,130,246,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = "1px solid #e2e8f0";
        e.currentTarget.style.boxShadow =
          "0 1px 2px rgba(15,23,42,0.04)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.985)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
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
          {data.value.toLocaleString("pt-BR")}%
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


const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }

  const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.55;
  const x = Number(cx) + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = Number(cy) + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  if (!percent || percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fontSize: 12,
        fontWeight: 900,
        filter: "drop-shadow(0 2px 4px rgba(15,23,42,.35))",
      }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const MyCustomPie = (props: PieSectorShapeProps) => {
  return (
    <Sector
      {...props}
      fill={TAX_COLORS[(props.index ?? 0) % TAX_COLORS.length]}
      stroke="#fff"
      strokeWidth={4}
      cornerRadius={10}
    />
  );
};

function TaxationDistributionChart({
  data,
  onItemClick,
}: {
  data: any[];
  onItemClick: (item: any) => void;
}) {
  const total = data.reduce((acc, item) => acc + Number(item.value || 0), 0);

  const chartData = data.map((item, index) => ({
    ...item,
    value: Number(item.value || 0),
    fill: TAX_COLORS[index % TAX_COLORS.length],
  }));

  return (
    <div style={premiumChartCardStyle}>
      <ChartHeader
        title="Tributação das empresas"
        description="Clique em um regime para visualizar as empresas vinculadas."
      />

     

      <div
        style={{
          width: "100%",
          height: 300,
          position: "relative",
          marginTop: 0,
        }}
      >
        <PieChart
          style={{
            width: "100%",
            height: "100%",
            maxHeight: 350,
            aspectRatio: 1,
            padding: 0,
          }}
          responsive
        >
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="48%"
            outerRadius="82%"
            paddingAngle={4}
            labelLine={false}
            label={renderCustomizedLabel}
            shape={MyCustomPie}
            isAnimationActive
            onClick={(item) => onItemClick(item)}
            style={{ cursor: "pointer" }}
          />

          <Tooltip
          
            cursor={false}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;

              const item = payload[0].payload;
              const percent = total
                ? Math.round((Number(item.value || 0) / total) * 100)
                : 0;

              return (
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 16,
                    padding: "10px 12px",
                    boxShadow: "0 18px 45px rgba(15,23,42,.14)",
                    fontSize: 12,
                    position: "relative",
                    right: "100px",

                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      color: "#0f172a",
                      marginBottom: 4,
                    }}
                  >
                    {item.name}
                  </strong>

                  <span style={{ color: "#64748b" }}>
                    {Number(item.value || 0).toLocaleString("pt-BR")} empresas
                  </span>

                  <div
                    style={{
                      marginTop: 4,
                      fontWeight: 900,
                      color: item.fill,
                    }}
                  >
                    {percent}% 
                  </div>
                </div>
              );
            }}
          />
        </PieChart>

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
            <span
              style={{
                display: "block",
                fontSize: 10,
                fontWeight: 900,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: ".08em",
              }}
            >
              Total
            </span>

            <strong
              style={{
                display: "block",
                fontSize: 28,
                fontWeight: 950,
                color: "#012942",
                lineHeight: 1,
              }}
            >
              {total.toLocaleString("pt-BR")}
            </strong>
          </div>
        </div>
      </div>

    </div>
  );
}

const TAX_COLORS = [
  "#1E3A8A", // Azul fiscal
  "#0F766E", // Verde tributário
  "#B45309", // Âmbar
  "#7E22CE", // Roxo
  "#BE123C", // Vinho
  "#155E75", // Azul petróleo
  "#166534", // Verde escuro
  "#9A3412", // Marrom executivo
  "#4C1D95", // Roxo profundo
  "#475569", // Slate
];




const renderBranchLabel = (props: LabelProps) => {
  const { x, y, width, value } = props;

  if (x == null || y == null || width == null) return null;

  const radius = 13;
  const cx = Number(x) + Number(width) / 2;
  const cy = Number(y) - radius - 4;

  return (
    <g>
      <circle cx={cx} cy={cy} r={radius} fill="#012942" />

      <text
        x={cx}
        y={cy}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: 10,
          fontWeight: 900,
        }}
      >
        {String(value || "").slice(0, 2).toUpperCase()}
      </text>
    </g>
  );
};






function ActivityBranchRadialChart({
  data,
  onItemClick,
}: {
  data: any[];
  onItemClick: (item: any) => void;
}) {
  const chartData = data.map((item, index) => ({
    ...item,
    value: Number(item.value || 0),
    color: BRANCH_COLORS[index % BRANCH_COLORS.length],
  }));

  return (
    <div
      style={{
        borderRadius: 20,
        padding: 22,
        border: "2px solid #e2e8f0",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
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
          Ramo de atividade
        </h3>

        <p
          style={{
            margin: "5px 0 0",
            color: "#64748b",
            fontSize: 13,
          }}
        >
          Distribuição por segmento de atuação.
        </p>
      </div>

      <div style={{ width: "100%", height: 300 }}>
       <div style={{ width: "100%", height: Math.max(chartData.length * 30, 260) }}>
  <ResponsiveContainer>
    <BarChart
      layout="vertical"
      data={chartData}
      barSize={18}
      barCategoryGap={6}
      margin={{
        top: 4,
        right: 18,
        left: 0,
        bottom: 4,
      }}
    >
      <CartesianGrid
        horizontal={false}
        vertical={true}
        stroke="#e2e8f0"
      />

      <XAxis
        type="number"
        axisLine={false}
        tickLine={false}
        tick={{
          fontSize: 11,
          fill: "#94a3b8",
        }}
      />

      <YAxis
        type="category"
        dataKey="name"
        width={0}
        axisLine={false}
        tickLine={false}
        tick={false}
      />

      <Tooltip
        cursor={{
          fill: "rgba(15,23,42,.04)",
        }}
        content={({ active, payload }) => {
          if (!active || !payload?.length) return null;

          const item = payload[0].payload;

          const total = chartData.reduce(
            (acc, current) => acc + Number(current.value || 0),
            0
          );

          const percent = total
            ? Math.round((item.value / total) * 100)
            : 0;

          return (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                padding: "12px 14px",
                minWidth: 210,
                boxShadow: "0 20px 40px rgba(15,23,42,.12)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: item.color,
                  }}
                />

                <strong
                  style={{
                    color: "#0f172a",
                    fontSize: 13,
                    fontWeight: 900,
                  }}
                >
                  {item.name}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span style={{ color: "#64748b", fontSize: 12 }}>
                  Empresas
                </span>

                <strong style={{ color: "#012942", fontSize: 13 }}>
                  {item.value}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#64748b", fontSize: 12 }}>
                  Participação
                </span>

                <strong style={{ color: item.color, fontSize: 13 }}>
                  {percent}%
                </strong>
              </div>
            </div>
          );
        }}
      />

      <Bar
        dataKey="value"
        radius={[0, 999, 999, 0]}
        onClick={(entry: any) => onItemClick(entry)}
      >
        {chartData.map((entry) => (
          <Cell
            key={entry.name}
            fill={entry.color}
            cursor="pointer"
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>
      </div>
    </div>
  );
}

const BRANCH_COLORS = [
  "#155E75",
  "#166534",
  "#B45309",
  "#BE185D",
  "#0F766E",
  "#6D28D9",
  "#BE123C",
  "#15803D",
  "#1D4ED8",
  "#7E22CE",
];



function ProfileRadarChart({
  data,
  onItemClick,
}: {
  data: any[];
  onItemClick: (item: any) => void;
}) {
  const total = data.reduce((acc, item) => acc + Number(item.value || 0), 0);

  const chartData = data.map((item, index) => ({
    ...item,
    value: Number(item.value || 0),
    percent: total ? Math.round((Number(item.value || 0) / total) * 100) : 0,
    fill: PROFILE_COLORS[index % PROFILE_COLORS.length],
  }));

  return (
    <div style={premiumChartCardStyle}>
      <ChartHeader
        title="Perfil"
        description="Distribuição semicircular por perfil comercial."
      />

      <div
        style={{
          width: "100%",
          height: 250,
          marginTop: 0,
          position: "relative",
          overflow: "hidden",
          padding:0
        }}
      >
        <PieChart
          responsive
          style={{
            width: "100%",
            height: "100%",
            maxHeight: 250,
            aspectRatio: 2,
          }}
        >
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            startAngle={180}
            endAngle={0}
            cx="50%"
            cy="100%"
            innerRadius="48%"
            outerRadius="118%"
            paddingAngle={3}
            labelLine={false}
            label={({ percent }) => {
              return percent ? `${percent}%` : "";
            }}
            isAnimationActive
            onClick={(item) => onItemClick(item)}
            style={{ cursor: "pointer" }}
          >
            {chartData.map((item) => (
              <Cell
                key={item.name}
                fill={item.fill}
                stroke="#fff"
                strokeWidth={4}
              />
            ))}
          </Pie>

          <Tooltip content={<ProfileRadarTooltip />} />
        </PieChart>

        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 4,
            transform: "translateX(-50%)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: 10,
              fontWeight: 900,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: ".08em",
            }}
          >
            Total
          </span>

          <strong
            style={{
              display: "block",
              fontSize: 28,
              fontWeight: 950,
              color: "#012942",
              lineHeight: 1,
              zIndex: 1,
            }}
          >
            {total.toLocaleString("pt-BR")}
          </strong>
        </div>
      </div>

      
    </div>
  );
}




function ProfileRadarTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;

  const item = payload[0]?.payload;

  return (
    <div
      style={{
        borderRadius: 14,
        border: "2px solid #e2e8f0",
        background: "#fff",
        padding: "10px 12px",
        zIndex:3000000,
        bottom:"70px",
        position:"relative",
        right:"170px"
      }}
    >
      <strong
        style={{
          display: "block",
          fontSize: 12,
          color: "#0f172a",
          marginBottom: 5,
        }}
      >
        {item.name}
      </strong>

      <span
        style={{
          display: "block",
          fontSize: 12,
          color: "#64748b",
          fontWeight: 800,
        }}
      >
        {item.value} empresa(s) · {item.percent}%
      </span>
    </div>
  );
}


const PROFILE_COLORS = [
  "#012942", // Azul institucional
  "#BB9F58", // Dourado premium
  "#0F766E", // Verde petróleo
  "#7C3AED", // Roxo
  "#F97316", // Laranja
  "#2563EB", // Azul destaque
  "#DC2626", // Vermelho
  "#0891B2", // Ciano
  "#16A34A", // Verde sucesso
  "#475569", // Cinza executivo
];




function ChartHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h3
        style={{
          margin: 0,
          fontSize: 17,
          fontWeight: 950,
          color: "#0f172a",
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: "6px 0 0",
          color: "#64748b",
          fontSize: 13,
          lineHeight: 1.45,
        }}
      >
        {description}
      </p>
    </div>
  );
}


const premiumChartCardStyle: React.CSSProperties = {
  borderRadius: 24,
  padding: 22,
  border: "2px solid #e2e8f0",
  background:
    "radial-gradient(circle at top right, rgba(37,99,235,.08), transparent 36%), linear-gradient(180deg,#ffffff 0%,#f8fbff 100%)",
  overflow: "hidden",
  
};




const tableStyle: React.CSSProperties = {
  width: "100%",
  minWidth: "100%",
  borderCollapse: "collapse",
};