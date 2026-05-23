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
import { FileDown, FileSpreadsheet } from "lucide-react";
import {
  exportMatrixToExcel,
  exportMatrixToPDF,
} from "./utils/exportMatrix";

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
  saveMatrix,
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
          {/* <button
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
          </button> */}

          <button
          onClick={() =>
            exportMatrixToExcel(items, visibleColumns, users)
          }
          style={{
            height: 40,
            padding: "0 16px",

            display: "inline-flex",
            alignItems: "center",
            gap: 8,

            borderRadius: 14,
            border: "2px solid #ccc",

            background:
              "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",

            color: "#065f46",

            fontSize: 13,
            fontWeight: 800,
            letterSpacing: ".02em",

            cursor: "pointer",

            boxShadow:
              "0 10px 25px rgba(16,185,129,.10), inset 0 1px 0 rgba(255,255,255,.7)",

            transition:
              "all .18s ease",
          }}
          
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 8,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              background:
                "linear-gradient(135deg, #22c55e, #16a34a)",

              color: "#fff",

              boxShadow:
                "0 8px 18px rgba(34,197,94,.28)",
            }}
          >
            <FileSpreadsheet size={14} />
          </div>

          Exportar Excel
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
          onUpdateCell={async ({
            companyId,
            field,
            value,
            row,
          }: {
            companyId: string;
            field: string;
            value: unknown;
            row: any;
          }) => {
            await saveMatrix(companyId, {
              [field]: value,
            });
          }}
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