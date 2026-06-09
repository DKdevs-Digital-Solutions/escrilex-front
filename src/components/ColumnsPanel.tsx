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
  sections = [],
  visibleKeys,
  setVisibleKeys,
  toggleColumn,
  onClose,
}: any) {
  const allColumns = sections.flatMap(
    (section: any) => section.columns ?? []
  );

  const allSelected = allColumns.every((column: any) =>
    visibleKeys.includes(column.key)
  );

  return (
    <div style={panelOverlayStyle} onClick={onClose}>
      <div style={columnsPanelStyle} onClick={(e) => e.stopPropagation()}>
        <div style={columnsPanelHeaderStyle}>
          <div>
            <div style={panelKickerStyle}>Personalização</div>
            <h2 style={panelTitleStyle}>Gerenciar colunas</h2>
            <p style={panelSubtitleStyle}>
              Escolha as seções e campos que devem aparecer na listagem principal.
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
                setVisibleKeys(allColumns.map((c: any) => c.key));
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
          {sections.map((section: any) => (
            <div
              key={section.name}
              style={{
                background: "#fff",
                marginBottom: 12,
              }}
            >
              <strong
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,

                    marginBottom: 16,
                    padding: "10px 12px",

                    borderRadius: 14,

                    background:
                      "linear-gradient(135deg, rgba(15,23,42,.04), rgba(187,159,88,.12))",

                    border: "1px solid rgba(187,159,88,.20)",

                    boxShadow:
                      "0 10px 24px rgba(15,23,42,.04)",

                    fontSize: 11,
                    fontWeight: 950,

                    color: "#0f172a",

                    textTransform: "uppercase",
                    letterSpacing: ".10em",
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 999,
                      background: "#BB9F58",
                      boxShadow: "0 0 0 4px rgba(187,159,88,.15)",
                    }}
                  />

                  {section.name}
                </strong>

              <div style={{ display: "grid", gap: 8,borderRadius:10 }}>
                {(section.columns ?? []).map((column: any) => {
                  const checked = visibleKeys.includes(column.key);

                  return (
                    <label
                      key={column.key}
                      style={{
                        ...columnRowStyle,
                        background: checked
                          ? "linear-gradient(135deg, rgba(187,159,88,.12), rgba(250,204,21,.08))"
                          : "#f8fafc",
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
                        <strong style={columnLabelStyle}>
                          {column.label}
                        </strong>
                        <span style={columnKeyStyle}>{column.key}</span>
                      </span>

                      {column.type && (
                        <small style={columnTypeBadgeStyle}>
                          {column.type}
                        </small>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}