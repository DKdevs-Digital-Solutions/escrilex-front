import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpRight,
  Info,
  RefreshCcw,
  UserCog,
  Users,
} from "lucide-react";

import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { useDashboardDrilldown } from "../hooks/useDashboardDrilldown";
import { useCompanies } from "../hooks/useCompanies";
import { useDashboardAnalytics } from "../hooks/useDashboardAnalytics";

import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DashboardFilters } from "../components/dashboard/DashboardFilters";
import { DashboardCards } from "../components/dashboard/DashboardCards";
import { DashboardExtraCharts } from "../components/dashboard/DashboardExtraCharts";
import { DashboardModal } from "../components/dashboard/DashboardModal";
import { MiniInfo } from "../components/dashboard/MiniInfo";
import { createPortal } from "react-dom";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, PieLabelRenderProps, PieSectorShapeProps, ResponsiveContainer, Sector, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardSideSummary } from "../components/dashboard/DashboardSideSummary";
import { DashboardMainCharts } from "../components/dashboard/DashboardMainCharts";

type ModalTab =
  | "ativos"
  | "Encerrada"
  | "entradas"
  | "saidas"
  | "responsibles";

type DrilldownType =
  | "entries"
  | "exits"
  | "tributacao"
  | "ramo"
  | "perfil"
  | "responsibles"
  | "changes";

type DashboardChartType =
  | "tributacao"
  | "ramo"
  | "perfil"
  | "exitReasons"
  | "responsibleByDepartment";

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

  const { items: companies = [], load } = useCompanies();

  const {
    dataAnalytics,
    loadDashboardAnalytics,
  } = useDashboardAnalytics({
    startDate,
    endDate,
  });

  const [modalChart, setModalChart] = useState<
    null | "movimento" | "clientes" | "responsibles" | "alterations" | "responsibleChanges"
  >(null);

  const [modalTab, setModalTab] = useState<ModalTab>("ativos");

  const [selectedDrilldownType, setSelectedDrilldownType] =
    useState<DrilldownType>("entries");

  const [selectedDrilldownLabel, setSelectedDrilldownLabel] = useState("");
  const [selectedDrilldownKey, setSelectedDrilldownKey] = useState("");

  const [selectedChartType, setSelectedChartType] =
    useState<DashboardChartType>("tributacao");

  const [tipoResumo, setTipoResumo] = useState<"saida" | "entrada">("entrada");

  const [isMobile, setIsMobile] = useState(false);

  const {
    data: drilldownData,
    loading: drilldownLoading,
    loadDrilldown,
    clearDrilldown,
  } = useDashboardDrilldown({
    type: selectedDrilldownType,
    startDate,
    endDate,
  });

  const permanencia = dataAnalytics?.permanencia;
  const motivosSaida = dataAnalytics?.motivosSaida ?? [];
  const cancelamentos = dataAnalytics?.cancelamentos;

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

  const chartTypeLabels: Record<DashboardChartType, string> = {
    tributacao: "Tributação",
    ramo: "Ramo",
    perfil: "Perfil",
    exitReasons: "Motivos de saída",
    responsibleByDepartment: "Responsáveis por departamento",
  };

  function normalizeValue(value: any) {
    return String(value || "").trim().toLowerCase();
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
    if (isChartFilterModal()) return getChartFilterRows();

    if (modalTab === "ativos") return activeCompanies;
    if (modalTab === "Encerrada") return inactiveCompanies;

    if (modalTab === "saidas") {
      return normalizedDrilldownRows.map((item: any) => {
        const analyticsCompany = permanencia?.empresas?.find(
          (empresa: any) => empresa.id === item.id
        );

        return {
          ...item,
          diasPermanencia:
            analyticsCompany?.diasPermanencia ?? item.diasPermanencia,
          motivoSaida:
            analyticsCompany?.motivoSaida ?? item.motivoSaida,
          status:
            analyticsCompany?.status ?? item.situacao,
          dataSaida:
            analyticsCompany?.dataSaida ?? item.inactivatedAt ?? item.dataSaida,
        };
      });
    }

    return normalizedDrilldownRows;
  };

  function getExtraColumnByDrilldown() {
    if (selectedDrilldownType === "tributacao") {
      return { label: "Tributação", key: "tributacao" };
    }

    if (selectedDrilldownType === "ramo") {
      return { label: "Ramo", key: "ramo" };
    }

    if (selectedDrilldownType === "perfil") {
      return { label: "Perfil", key: "perfil" };
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

  function openModal(chart: "movimento" | "clientes" | "responsibles", tab: ModalTab) {
    clearDrilldown();

    setSelectedDrilldownLabel("");
    setSelectedDrilldownKey("");

    setModalChart(chart);
    setModalTab(tab);

    if (tab === "entradas") setSelectedDrilldownType("entries");
    if (tab === "saidas") setSelectedDrilldownType("exits");
    if (tab === "responsibles") setSelectedDrilldownType("responsibles");
  }

  function closeModal() {
    setModalChart(null);
    setModalTab("ativos");
    setSelectedDrilldownType("entries");
    setSelectedDrilldownLabel("");
    setSelectedDrilldownKey("");
    clearDrilldown();
  }

  function formatDateBR(date: string) {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }

  const periodLabel = useMemo(() => {
    if (!startDate || !endDate) return "Período atual";
    return `${formatDateBR(startDate)} até ${formatDateBR(endDate)}`;
  }, [startDate, endDate]);

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
      value: data?.cards?.newClients ?? 0,
      color: "#2563eb",
    },
    {
      name: "Saíram",
      value: data?.cards?.inactiveClients ?? 0,
      color: "#dc2626",
    },
  ];

  const totalMovement = movementChartData.reduce(
    (acc, item) => acc + item.value,
    0
  );

  const movementChartDataRender =
    totalMovement === 0
      ? [
          {
            name: "Sem movimentação",
            value: 1,
            color: "#cbd5e1",
          },
        ]
      : movementChartData;

  const comparisons = data?.comparisons;

  const getMovementComparison = (name: string) => {
    if (name === "Novos") return comparisons?.entries;
    if (name === "Saíram") return comparisons?.exits;

    return null;
  };

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
      onClick: () => {
        setModalChart("clientes");
        setModalTab("entradas");
      },
    },
    {
      title: "Saíram no período",
      value: data?.cards?.inactiveClients ?? 0,
      description: "Clientes encerrados no período",
      icon: <ArrowDownRight size={22} />,
      bg: "linear-gradient(135deg, #fef2f2, #fee2e2)",
      color: "#dc2626",
      badge: "Saída",
      badgeBg: "#fee2e2",
      onClick: () => {
        openModal("clientes", "saidas");
        loadDashboardAnalytics();
      },
    },
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

  const taxationChartData = (data?.charts?.taxation ?? []).map((item: any) => ({
    name: item.label,
    value: item.total,
    color: "#7c3aed",
  }));

  const activityBranchChartData = (data?.charts?.activityBranch ?? []).map(
    (item: any) => ({
      name: item.label,
      value: item.total,
      color: "#2563eb",
    })
  );

  const profileChartData = (data?.charts?.profile ?? []).map((item: any) => ({
    name: item.label,
    value: item.total,
    color: "#0f766e",
  }));

  const isResponsibleModal = selectedDrilldownType === "responsibles";

  const isExitModal =
    modalChart === "clientes" &&
    modalTab === "saidas";

  function getDiasPermanencia(item: any) {
    const dataEntrada = item.dataEntrada;
    const dataSaida = item.inactivatedAt || item.dataSaida;

    if (!dataEntrada || !dataSaida) return null;

    const entrada = new Date(dataEntrada).getTime();
    const saida = new Date(dataSaida).getTime();

    return Math.max(
      0,
      Math.ceil((saida - entrada) / (1000 * 60 * 60 * 24))
    );
  }

  const resumoEntrada = {
    percentual: data?.comparisons?.entries?.growthPercent ?? 0,
    quantidade: data?.comparisons?.entries?.current ?? 0,
    totalEmpresas: data?.cards?.newClients ?? 0,
  };

  const motivosEntradaFake: any = [];

  const isEntrada = tipoResumo === "entrada";

  const resumoAtual = isEntrada ? resumoEntrada : cancelamentos;
  const motivosAtual = isEntrada ? motivosEntradaFake : motivosSaida;

  useEffect(() => {
    loadDashboard();
    load();
    loadDashboardAnalytics();
  }, []);

  useEffect(() => {
    if (!modalChart) return;
    if (isChartFilterModal()) return;
    if (modalTab === "ativos" || modalTab === "Encerrada") return;

    loadDrilldown();
  }, [
    modalChart,
    modalTab,
    selectedDrilldownType,
    selectedDrilldownKey,
    startDate,
    endDate,
  ]);

  useEffect(() => {
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
        <DashboardHeader />

        <div style={{ padding: "0px", position: "relative", marginTop: "30px" }}>
          <DashboardFilters
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            loading={loading}
            onRefresh={() => {
              loadDashboard();
              loadDashboardAnalytics();
            }}
          />

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

          <DashboardCards cards={cards} loading={loading} />

          <div
            className="dashboard-main"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: 16,
            }}
          >
          <DashboardMainCharts
            periodLabel={periodLabel}
            chartData={chartData}
            movementChartData={movementChartData}
            movementChartDataRender={movementChartDataRender}
            totalMovement={totalMovement}
            openModal={openModal}
            setModalChart={setModalChart}
            loadDashboardAnalytics={loadDashboardAnalytics}
            getMovementComparison={getMovementComparison}
          />

          <DashboardSideSummary
            tipoResumo={tipoResumo}
            setTipoResumo={setTipoResumo}
            isEntrada={isEntrada}
            resumoAtual={resumoAtual}
            motivosAtual={motivosAtual}
            loading={loading}
            MotivosAgrupadosInfo={MotivosAgrupadosInfo}
          />




          </div>

          <DashboardExtraCharts
            isMobile={isMobile}
            TaxationDistributionChart={TaxationDistributionChart}
            ActivityBranchRadialChart={ActivityBranchRadialChart}
            ProfileRadarChart={ProfileRadarChart}
            taxationChartData={taxationChartData}
            activityBranchChartData={activityBranchChartData}
            profileChartData={profileChartData}
            onTaxationClick={(item: any) => {
              setSelectedChartType("tributacao");
              setSelectedDrilldownType("tributacao");
              setSelectedDrilldownLabel(item.name);
              setSelectedDrilldownKey(item.name);
              setModalChart("clientes");
            }}
            onBranchClick={(item: any) => {
              setSelectedChartType("ramo");
              setSelectedDrilldownType("ramo");
              setSelectedDrilldownLabel(item.name);
              setSelectedDrilldownKey(item.name);
              setModalChart("clientes");
            }}
            onProfileClick={(item: any) => {
              setSelectedChartType("perfil");
              setSelectedDrilldownType("perfil");
              setSelectedDrilldownLabel(item.name);
              setSelectedDrilldownKey(item.name);
              setModalChart("clientes");
            }}
          />

          {modalChart && (
            <DashboardModal
              modalChart={modalChart}
              modalTab={modalTab}
              selectedDrilldownLabel={selectedDrilldownLabel}
              selectedDrilldownType={selectedDrilldownType}
              selectedChartType={selectedChartType}
              chartTypeLabels={chartTypeLabels}
              isMobile={isMobile}
              periodLabel={periodLabel}
              closeModal={closeModal}
              openModal={openModal}
              data={data}
              drilldownLoading={drilldownLoading}
              isResponsibleModal={isResponsibleModal}
              isExitModal={isExitModal}
              getModalRows={getModalRows}
              getExtraColumnByDrilldown={getExtraColumnByDrilldown}
              getStatusStyle={getStatusStyle}
              getDiasPermanencia={getDiasPermanencia}
            />
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
       <div
  style={{
    maxHeight: 320,
    overflowY: "auto",
    overflowX: "hidden",
    paddingRight: 4,
  }}
>
  <div
    style={{
      width: "100%",
      height: Math.max(chartData.length * 32, 260),
    }}
  >
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



type MotivoSaida = {
  motivo: string;
  quantidade: number;
  percentual: number;
};

function MotivosAgrupadosInfo({ motivos }: { motivos: MotivoSaida[] }) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const showTooltip = (event: React.MouseEvent<HTMLSpanElement>) => {
    setRect(event.currentTarget.getBoundingClientRect());
    setOpen(true);
  };

  const closeTimer = useRef<number | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openTooltip = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const closeTooltip = () => {
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
    }, 180);
  };

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
        cursor:"pointer"
      }}
       onMouseEnter={(event) => {
          setRect(event.currentTarget.getBoundingClientRect());
          openTooltip();
        }}
        onMouseLeave={closeTooltip}
    >

      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <span
          style={{
            color: "rgba(255,255,255,.72)",
            fontSize: 12.5,
            fontWeight: 800,
          }}
        >
          Motivos agrupados
        </span>

        
      </div>
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: 999,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,.10)",
            border: "1px solid rgba(255,255,255,.14)",
            cursor: "help",
          }}
        >
          <Info size={12} color="rgba(255,255,255,.78)" />
        </span>
      

      {open &&
        rect &&
        createPortal(
          <div
  onMouseEnter={openTooltip}
  onMouseLeave={closeTooltip}
  style={{
    position: "fixed",
    left: rect.left - 300,
    top: rect.bottom + 12,
    zIndex: 99999,
    width: 390,
    padding: 14,
    borderRadius: 18,
    background:
      "linear-gradient(180deg, rgba(15,23,42,.98), rgba(2,6,23,.98))",
    border: "1px solid rgba(255,255,255,.14)",
    boxShadow:
      "0 24px 80px rgba(0,0,0,.52), inset 0 1px 0 rgba(255,255,255,.08)",
    backdropFilter: "blur(16px)",
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    }}
  >
    <div>
      <div
        style={{
          color: "#fff",
          fontSize: 13,
          fontWeight: 900,
          letterSpacing: ".2px",
        }}
      >
        Motivos de saída
      </div>

      <div
        style={{
          color: "rgba(255,255,255,.52)",
          fontSize: 11.5,
          marginTop: 2,
          fontWeight: 700,
        }}
      >
        Distribuição agrupada dos cancelamentos
      </div>
    </div>

    <div
      style={{
        padding: "5px 8px",
        borderRadius: 999,
        background: "rgba(59,130,246,.14)",
        border: "1px solid rgba(96,165,250,.22)",
        color: "#bfdbfe",
        fontSize: 11.5,
        fontWeight: 900,
      }}
    >
      {motivos.length} grupos
    </div>
  </div>

  <div style={{ display: "grid", gap: 9 }}>
    {motivos.map((item) => (
      <div
        key={item.motivo}
        style={{
          display: "grid",
          gridTemplateColumns: "42px 1fr 58px",
          gap: 10,
          alignItems: "center",
          padding: "10px 11px",
          borderRadius: 14,
          background:
            "linear-gradient(135deg, rgba(255,255,255,.085), rgba(255,255,255,.035))",
          border: "1px solid rgba(255,255,255,.09)",
        }}
      >
        <strong
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 13,
            background: "rgba(255,255,255,.10)",
            border: "1px solid rgba(255,255,255,.12)",
          }}
        >
          {item.quantidade}
        </strong>

        <span
          style={{
            color: "rgba(255,255,255,.82)",
            fontSize: 12.5,
            lineHeight: 1.35,
            fontWeight: 700,
            wordBreak: "break-word",
          }}
        >
          {item.motivo}
        </span>

        <span
          style={{
            justifySelf: "end",
            padding: "5px 8px",
            borderRadius: 999,
            color: "#dbeafe",
            background: "rgba(59,130,246,.13)",
            border: "1px solid rgba(96,165,250,.18)",
            fontSize: 12,
            fontWeight: 900,
            whiteSpace: "nowrap",
          }}
        >
          {item.percentual}%
        </span>
      </div>
    ))}
  </div>
</div>,
          document.body
        )}
    </div>
  );
}

