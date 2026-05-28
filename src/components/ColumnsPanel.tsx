import React from "react";
import { Eye, RotateCcw, X } from "lucide-react";

import {
  clearButtonStyle,
  columnKeyStyle,
  columnLabelStyle,
  columnRowStyle,
  columnTypeBadgeStyle,
  columnsListStyle,
  columnsPanelActionsStyle,
  columnsPanelHeaderStyle,
  columnsPanelStyle,
  panelKickerStyle,
  panelOverlayStyle,
  panelSubtitleStyle,
  panelTitleStyle,
  softActionButtonStyle,
} from "../styles/ExpectationMatrix.styled";

const DEFAULT_VISIBLE_COLUMNS = [
  "codigo",
  "empresa",
  "cnpjCpf",
  "grupo",
  "status",
];

export function ColumnsPanel({
  columns,
  visibleKeys,
  setVisibleKeys,
  toggleColumn,
  onClose,
}: any) {
  const allSelected = visibleKeys.length === columns.length;

  return (
    <div style={panelOverlayStyle} onClick={onClose}>
      <div style={columnsPanelStyle} onClick={(e) => e.stopPropagation()}>
        <div style={columnsPanelHeaderStyle}>
          <div>
            <div style={panelKickerStyle}>Personalização</div>
            <h2 style={panelTitleStyle}>Gerenciar colunas</h2>
            <p style={panelSubtitleStyle}>
              Escolha os campos que devem aparecer na listagem principal.
            </p>
          </div>

          <button onClick={onClose} style={clearButtonStyle}>
            <X size={16} />
          </button>
        </div>

        <div style={columnsPanelActionsStyle}>
          <button
            style={softActionButtonStyle}
            onClick={() => {
              if (allSelected) {
                setVisibleKeys(DEFAULT_VISIBLE_COLUMNS);
              } else {
                setVisibleKeys(columns.map((c: any) => c.key));
              }
            }}
          >
            {allSelected ? (
              <>
                <RotateCcw size={14} />
                Restaurar padrão
              </>
            ) : (
              <>
                <Eye size={14} />
                Mostrar todas
              </>
            )}
          </button>
        </div>

        <div style={columnsListStyle}>
          {columns.map((column: any) => {
            const checked = visibleKeys.includes(column.key);

            return (
              <label
                key={column.key}
                style={{
                  ...columnRowStyle,
                  background: checked
                    ? "linear-gradient(135deg, rgba(187,159,88,.12), rgba(250,204,21,.08))"
                    : "#fff",
                  borderColor: checked
                    ? "rgba(187,159,88,.30)"
                    : "#e2e8f0",
                  boxShadow: checked
                    ? "0 10px 24px rgba(187,159,88,.12)"
                    : "none",
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleColumn(column.key)}
                  style={{
                    width: 18,
                    height: 18,
                    cursor: "pointer",
                    accentColor: "#BB9F58",
                    transform: "translateY(1px)",
                  }}
                />

                <span style={{ flex: 1 }}>
                  <strong style={columnLabelStyle}>{column.label}</strong>
                  <span style={columnKeyStyle}>{column.key}</span>
                </span>

                <small style={columnTypeBadgeStyle}>{column.type}</small>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}