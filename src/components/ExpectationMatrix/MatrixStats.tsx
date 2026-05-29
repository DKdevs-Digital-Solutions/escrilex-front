import { Building2, CheckCircle2, Columns3, X } from "lucide-react";
import {
  statsGridStyle,
  statCardStyle,
  statIconStyle,
  statValueStyle,
  statLabelStyle,
} from "../../styles/ExpectationMatrix.styled";


type Props = {
  items: any[];
  total: number;
  visibleColumnsCount: number;
};

export function MatrixStats({ items, total, visibleColumnsCount }: Props) {
  const activeCount = items.filter(
  (item: any) => item.active === true
).length;

  const inactiveCount = items.length - activeCount;

  return (
    <div style={statsGridStyle}>
      <StatCard
        icon={<Building2 size={18} />}
        label="Registros"
        value={total}
        color="#3b82f6"
        background="rgba(59,130,246,.12)"
      />

      <StatCard
        icon={<CheckCircle2 size={18} />}
        label="Ativos"
        value={activeCount}
        color="#22c55e"
        background="rgba(34,197,94,.12)"
      />

      <StatCard
        icon={<X size={18} />}
        label="Inativos"
        value={inactiveCount}
        color="#ef4444"
        background="rgba(239,68,68,.12)"
      />

      <StatCard
        icon={<Columns3 size={18} />}
        label="Colunas visíveis"
        value={visibleColumnsCount}
        color="#925cbc"
        background="rgba(144, 0, 246, 0.16)"
      />
    </div>
  );
}

function StatCard({ icon, label, value, color, background }: any) {
  return (
    <div style={statCardStyle}>
      <div
        style={{
          ...statIconStyle,
          color,
          background,
          
        }}
      >
        {icon}
      </div>

      <div>
        <strong style={statValueStyle}>{value}</strong>
        <span style={statLabelStyle}>{label}</span>
      </div>
    </div>
  );
}