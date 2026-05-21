import { Columns3, DatabaseSearch, LayoutGrid, Rows3 } from "lucide-react";
import { MatrixTable } from "./MatrixTable";
import { MatrixCards } from "./MatrixCards";
import {
  databaseCardStyle,
  databaseHeaderStyle,
  databaseMiniIconStyle,
  databaseSubtitleStyle,
  viewButtonStyle,
  columnsButtonStyle,
} from "../../styles/ExpectationMatrix.styled";

export function MatrixDatabase({
  items,
  users,
  total,
  loading,
  loadingOptions,
  visibleColumns,
  viewMode,
  setViewMode,
  onOpenColumns,
  onSelectRow,
}: any) {
  return (
    <div style={databaseCardStyle}>
      <div style={databaseHeaderStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={databaseMiniIconStyle}>
            <DatabaseSearch size={18} color="#bb9f58" />
          </div>

          <p style={databaseSubtitleStyle}>
            {loading || loadingOptions
              ? "Carregando estrutura e registros..."
              : `${total} registros carregados • ${visibleColumns.length} colunas em exibição`}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={() =>
              setViewMode((prev: "table" | "cards") =>
                prev === "table" ? "cards" : "table"
              )
            }
            style={viewButtonStyle}
          >
            {viewMode === "table" ? (
              <>
                <LayoutGrid size={15} />
                <span>Modo Cards</span>
              </>
            ) : (
              <>
                <Rows3 size={15} />
                <span>Modo Tabela</span>
              </>
            )}
          </button>

          <button onClick={onOpenColumns} style={columnsButtonStyle}>
            <Columns3 size={14} />
            <span>Gerenciar colunas</span>
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <MatrixTable
          items={items}
          users={users}
          loading={loading}
          loadingOptions={loadingOptions}
          visibleColumns={visibleColumns}
          onSelectRow={onSelectRow}
        />
      ) : (
        <MatrixCards
          items={items}
          users={users}
          loading={loading}
          loadingOptions={loadingOptions}
          visibleColumns={visibleColumns}
          onSelectRow={onSelectRow}
        />
      )}
    </div>
  );
}