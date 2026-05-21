import { Database, RefreshCw } from "lucide-react";
import {
  heroStyle,
  heroIconStyle,
  heroBadgeStyle,
  liveDotStyle,
  heroTitleStyle,
  heroTextStyle,
  refreshButtonStyle,
} from "../../styles/ExpectationMatrix.styled";

type Props = {
  loading: boolean;
  onRefresh: () => void;
};

export function MatrixHero({ loading, onRefresh }: Props) {
  return (
    <div style={heroStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={heroIconStyle}>
          <Database size={28} color="#38bdf8" />
        </div>

        <div>
          <div style={heroBadgeStyle}>
            <span style={liveDotStyle} />
            Base operacional
          </div>

          <h1 style={heroTitleStyle}>Matriz de Expectativas</h1>

          <p style={heroTextStyle}>
            Uma visão dinâmica dos clientes, responsáveis, obrigações, prazos e
            status operacionais.
          </p>
        </div>
      </div>

      <button onClick={onRefresh} disabled={loading} style={refreshButtonStyle}>
        <RefreshCw size={16} />
        Atualizar dados
      </button>
    </div>
  );
}