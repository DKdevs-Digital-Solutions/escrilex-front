import { useState } from "react";
import { Eye, ScanEye } from "lucide-react";
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
  stickyActionColumnStyle,
} from "../../styles/ExpectationMatrix.styled";

export function MatrixTable({
  items,
  users,
  loading,
  loadingOptions,
  visibleColumns,
  onSelectRow,
  onUpdateCell,
}: any) {
  const [editingCell, setEditingCell] = useState<any>(null);
  const [cellValue, setCellValue] = useState("");

  function getCellId(rowIndex: number, columnIndex: number) {
    return `${rowIndex}-${columnIndex}`;
  }

  function startEdit(item: any, column: any, rowIndex: number, columnIndex: number) {
    setEditingCell({
      id: getCellId(rowIndex, columnIndex),
      rowIndex,
      columnIndex,
      item,
      column,
    });

    setCellValue(item[column.key] ?? "");
  }

  async function saveCell() {
    if (!editingCell) return;

    const { item, column } = editingCell;
    const oldValue = item[column.key] ?? "";

    setEditingCell(null);

    if (String(oldValue) === String(cellValue)) return;

    await onUpdateCell?.({
      companyId: item.companyId,
      field: column.key,
      value: cellValue,
      row: item,
    });
  }

  function cancelEdit() {
    setEditingCell(null);
    setCellValue("");
  }

  function moveToCell(rowIndex: number, columnIndex: number) {
    const nextItem = items[rowIndex];
    const nextColumn = visibleColumns[columnIndex];

    if (!nextItem || !nextColumn) return;

    startEdit(nextItem, nextColumn, rowIndex, columnIndex);
  }

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
                // ...(index === 0 ? stickyHeaderFirstColumnStyle : {}),
              }}
            >
              <span style={columnHeaderInnerStyle}>
                {column.key === "status" ? "Situação" : column.label}
              </span>
            </th>
            ))}
            <th
              style={{
                ...actionThStyle,
                ...stickyActionColumnStyle,
                right: 0,
                zIndex: 20,
                background:"#333"
              }}
            >
              <ScanEye size={20} />
            </th>

          </tr>
        </thead>

        <tbody>
          {loading || loadingOptions ? (
            <tr>
              <td colSpan={(visibleColumns.length || 1) + 1} style={emptyStyle}>
                Carregando matriz de expectativas...
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={(visibleColumns.length || 1) + 1} style={emptyStyle}>
                Nenhum registro encontrado.
              </td>
            </tr>
          ) : (
            items.map((item: any, rowIndex: number) => (
              <tr
                key={item.companyId}
                style={{
                  background: rowIndex % 2 === 0 ? "#fff" : "#fcfcfd",
                }}
              >
                {visibleColumns.map((column: any, columnIndex: number) => {
                  const isEditing =
                    editingCell?.id === getCellId(rowIndex, columnIndex);

                  return (
                    <td
                      key={column.key}
                      style={{
                        ...tdStyle,
                        padding: 0,
                      }}
                    >
                      {isEditing ? (
                        <input
                          autoFocus
                          value={cellValue}
                          onChange={(e) => setCellValue(e.target.value)}
                          onBlur={saveCell}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              saveCell();
                            }

                            if (e.key === "Escape") {
                              e.preventDefault();
                              cancelEdit();
                            }

                            if (e.key === "Tab") {
                              e.preventDefault();

                              const nextColumn = e.shiftKey
                                ? columnIndex - 1
                                : columnIndex + 1;

                              saveCell();

                              setTimeout(() => {
                                moveToCell(rowIndex, nextColumn);
                              }, 0);
                            }
                          }}
                          style={{
                            width: "100%",
                            minHeight: 42,
                            padding: "10px 12px",
                            border: "2px solid #2563eb",
                            outline: "none",
                            background: "#eff6ff",
                            color: "#0f172a",
                            fontSize: 13,
                            fontWeight: 700,
                            boxSizing: "border-box",
                          }}
                        />
                      ) : (
                        <div
                          onClick={() =>
                            startEdit(item, column, rowIndex, columnIndex)
                          }
                          style={{
                            minHeight: 42,
                            padding: "10px 12px",
                            cursor: "cell",
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid transparent",
                          }}
                        >
                          {renderCell(item, column, users)}
                        </div>
                      )}
                    </td>
                  );
                })}
                
                <td
                  style={{
                    ...tdStyle,
                    ...stickyActionColumnStyle,

                    textAlign: "center",
                    width: 80,

                    right: 0,

                    background:
                      rowIndex % 2 === 0
                        ? "#fff"
                        : "#fcfcfd",
                  }}
                >
                  <button
                    style={eyeButtonStyle}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRow(item);
                    }}
                  >
                    <Eye size={20} />
                  </button>
                </td>
               
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}