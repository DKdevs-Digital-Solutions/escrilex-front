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
  compact?: boolean;
};

export function MatrixStats({ items, total, visibleColumnsCount, compact = false }: Props) {
  const activeCount = items.filter(
  (item: any) => item.active === true
).length;

  const inactiveCount = items.length - activeCount;

  return (
    <div style={compact ? { ...statsGridStyle, gap: 12 } : statsGridStyle}>
      <StatCard
        icon={<Building2 size={18} />}
        label="Registros"
        value={total}
        color="#3b82f6"
        background="rgba(59,130,246,.12)"
        compact={compact}
      />

      <StatCard
        icon={<CheckCircle2 size={18} />}
        label="Ativos"
        value={activeCount}
        color="#22c55e"
        background="rgba(34,197,94,.12)"
        compact={compact}
      />

      <StatCard
        icon={<X size={18} />}
        label="Encerrados"
        value={inactiveCount}
        color="#ef4444"
        background="rgba(239,68,68,.12)"
        compact={compact}
      />

      <StatCard
        icon={<Columns3 size={18} />}
        label="Colunas visíveis"
        value={visibleColumnsCount}
        color="#925cbc"
        background="rgba(144, 0, 246, 0.16)"
        compact={compact}
      />
    </div>
  );
}

function StatCard({ icon, label, value, color, background, compact }: any) {
  return (
    <div style={compact ? { ...statCardStyle, padding: 10, borderRadius: 16 } : statCardStyle}>
      <div
        style={{
          ...statIconStyle,
          ...(compact ? { width: 32, height: 32, borderRadius: 11 } : null),
          color,
          background,
        }}
      >
        {icon}
      </div>

      <div>
        <strong style={compact ? { ...statValueStyle, fontSize: 18 } : statValueStyle}>{value}</strong>
        <span style={statLabelStyle}>{label}</span>
      </div>
    </div>
  );
}