export function DashboardExtraCharts({
  isMobile,
  TaxationDistributionChart,
  ActivityBranchRadialChart,
  ProfileRadarChart,
  taxationChartData,
  activityBranchChartData,
  profileChartData,
  onTaxationClick,
  onBranchClick,
  onProfileClick,
}: any) {
  return (
    <div
      className="dashboard-charts-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: 16,
        marginTop: 16,
        height: !isMobile ? "400px" : "auto",
      }}
    >
      <TaxationDistributionChart
        data={taxationChartData}
        onItemClick={onTaxationClick}
      />

      <ActivityBranchRadialChart
        data={activityBranchChartData}
        onItemClick={onBranchClick}
      />

      <ProfileRadarChart
        data={profileChartData}
        onItemClick={onProfileClick}
      />
    </div>
  );
}