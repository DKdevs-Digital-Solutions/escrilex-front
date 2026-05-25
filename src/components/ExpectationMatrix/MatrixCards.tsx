import { Eye } from "lucide-react";
import { renderCell } from "./utils/matrixRenderers";

import {
  cardsViewStyle,
  cardCompanyMetaStyle,
  cardCompanyNameStyle,
  cardFieldLabelStyle,
  cardFieldStyle,
  cardFieldValueStyle,
  cardFieldsGridStyle,
  cardItemHeaderStyle,
  cardOpenButtonStyle,
  databaseCardItemStyle,
  emptyCardsStyle,
} from "../../styles/ExpectationMatrix.styled";

export function MatrixCards({
  items,
  users,
  loading,
  loadingOptions,
  visibleColumns,
  onSelectRow,
}: any) {
  return (
    <div style={cardsViewStyle}>
      {loading || loadingOptions ? (
        <div style={emptyCardsStyle}>
          Carregando matriz de expectativas...
        </div>
      ) : (
        items.map((item: any) => (
          <div
            key={item.companyId}
            style={databaseCardItemStyle}
            onClick={() => onSelectRow(item)}
          >
            <div style={cardItemHeaderStyle}>
              <div>
                <strong style={cardCompanyNameStyle}>
                  {item.empresa || "--"}
                </strong>

                <div style={cardCompanyMetaStyle}>
                  {item.codigo || "--"} • {item.cnpjCpf || "--"}
                </div>
              </div>

             <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: "#94a3b8",
                  }}
                >
                  Situação
                </span>

                {renderCell(
                  item,
                  {
                    key: "status",
                    type: "select",
                    label: "STATUS",
                  },
                  users
                )}
              </div>
            </div>

            <div style={cardFieldsGridStyle}>
              {visibleColumns
                .filter(
                  (column: any) =>
                    ![
                      "empresa",
                      "codigo",
                      "cnpjCpf",
                      "status",
                    ].includes(column.key)
                )
                .slice(0, 8)
                .map((column: any) => (
                  <div
                    key={column.key}
                    style={cardFieldStyle}
                  >
                    <span style={cardFieldLabelStyle}>
                      {column.label}
                    </span>

                    <div style={cardFieldValueStyle}>
                      {renderCell(item, column, users)}
                    </div>
                  </div>
                ))}
            </div>

            <button
              style={cardOpenButtonStyle}
              onClick={(e) => {
                e.stopPropagation();
                onSelectRow(item);
              }}
            >
              <Eye size={15} />
              Ver detalhes
            </button>
          </div>
        ))
      )}

      {!loading &&
        !loadingOptions &&
        items.length === 0 && (
          <div style={emptyCardsStyle}>
            Nenhum registro encontrado.
          </div>
        )}
    </div>
  );
}