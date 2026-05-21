import { Search, SlidersHorizontal } from "lucide-react";
import {
  filterPanelStyle,
  filterHeaderStyle,
  filterTitleStyle,
  filterSubtitleStyle,
  filtersGridStyle,
  inputStyle,
  openFiltersButtonStyle,
} from "../../styles/ExpectationMatrix.styled";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  onOpenFilters: () => void;
};

export function MatrixFilters({ search, setSearch, onOpenFilters }: Props) {
  return (
    <div style={filterPanelStyle}>
      <div style={filterHeaderStyle}>
        <div>
          <strong style={filterTitleStyle}>Filtros inteligentes</strong>
          <p style={filterSubtitleStyle}>
            Refine a base por busca, status, tributação, ramo e perfil.
          </p>
        </div>
      </div>

      <div style={filtersGridStyle}>
        <div style={{ position: "relative" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 13,
              top: 14,
              color: "#64748b",
            }}
          />

          <input
            placeholder="Buscar empresa, CNPJ ou código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 38 }}
          />
        </div>

        <button onClick={onOpenFilters} style={openFiltersButtonStyle}>
          <SlidersHorizontal size={18} />
        </button>
      </div>
    </div>
  );
}