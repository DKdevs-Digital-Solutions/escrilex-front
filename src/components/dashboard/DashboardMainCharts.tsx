import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function CustomTooltip({ active, payload }: any) {
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
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
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

export function DashboardMainCharts({
  periodLabel,
  chartData,
  movementChartData,
  movementChartDataRender,
  totalMovement,
  openModal,
  setModalChart,
  loadDashboardAnalytics,
  getMovementComparison,
}: any) {
  return (
    <div
      className="dashboard-charts-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 16,
        minWidth: 0,
      }}
    >
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
            Comparativo de clientes ativos e clientes encerrados.
          </p>
        </div>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              onClick={() => {
                setModalChart("movimento");
              }}
              data={chartData}
              barSize="70%"
              style={{ cursor: "pointer" }}
            >
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

                  if (entry.name === "Encerrados") {
                    openModal("movimento", "Encerrada");
                  }
                }}
              >
                {chartData.map((entry: any) => (
                  <Cell key={entry.name} fill={entry.color} cursor="pointer" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}