import { DashboardCard } from "./DashboardCard";

export function DashboardCards({
  cards,
  loading,
}: {
  cards: any[];
  loading: boolean;
}) {
  return (
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
  );
}