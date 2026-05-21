import { Eye } from "lucide-react";
import { renderCell } from "./utils/matrixRenderers";

import {
  actionThStyle,
  columnHeaderInnerStyle,
  emptyStyle,
  eyeButtonStyle,
  stickyFirstColumnStyle,
  stickyHeaderFirstColumnStyle,
  tableScrollStyle,
  tdStyle,
  thStyle,
} from "../../styles/ExpectationMatrix.styled";

export function MatrixTable({
  items,
  users,
  loading,
  loadingOptions,
  visibleColumns,
  onSelectRow,
}: any) {
  return (
    <div style={tableScrollStyle}>
      <table
        style={{
          width: "100%",
          minWidth: Math.max(visibleColumns.length * 180, 1180),
          borderCollapse: "separate",
          borderSpacing: 0,
          fontSize: 13,
        }}
      >
        <thead>
          <tr>
            {visibleColumns.map((column: any, index: number) => (
              <th
                key={column.key}
                style={{
                  ...thStyle,
                  ...(index === 0 ? stickyHeaderFirstColumnStyle : {}),
                }}
              >
                <span style={columnHeaderInnerStyle}>
                  {column.label}
                </span>
              </th>
            ))}

            <th style={actionThStyle}>Ações</th>
          </tr>
        </thead>

        <tbody>
          {loading || loadingOptions ? (
            <tr>
              <td
                colSpan={(visibleColumns.length || 1) + 1}
                style={emptyStyle}
              >
                Carregando matriz de expectativas...
              </td>
            </tr>
          ) : (
            items.map((item: any, rowIndex: number) => (
              <tr
                key={item.companyId}
                onClick={() => onSelectRow(item)}
                style={{
                  cursor: "pointer",
                  background:
                    rowIndex % 2 === 0 ? "#fff" : "#fcfcfd",
                  transition:
                    "background .15s ease, box-shadow .15s ease",
                }}
              >
                {visibleColumns.map((column: any, index: number) => (
                  <td
                    key={column.key}
                    style={{
                      ...tdStyle,
                      padding: "12px 14px",
                      ...(index === 0
                        ? stickyFirstColumnStyle
                        : {}),
                    }}
                  >
                    {renderCell(item, column, users)}
                  </td>
                ))}

                <td
                  style={{
                    ...tdStyle,
                    textAlign: "center",
                    width: 80,
                  }}
                >
                  <button
                    style={eyeButtonStyle}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRow(item);
                    }}
                  >
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))
          )}

          {!loading &&
            !loadingOptions &&
            items.length === 0 && (
              <tr>
                <td
                  colSpan={(visibleColumns.length || 1) + 1}
                  style={emptyStyle}
                >
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
        </tbody>
      </table>
    </div>
  );
}