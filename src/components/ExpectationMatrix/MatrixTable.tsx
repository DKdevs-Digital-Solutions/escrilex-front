import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  ScanEye,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { renderCell } from "./utils/matrixRenderers";

import {
  actionThStyle,
  columnHeaderInnerStyle,
  emptyStyle,
  eyeButtonStyle,
  tableScrollStyle,
  tdStyle,
  thStyle,
  stickyActionColumnStyle,
} from "../../styles/ExpectationMatrix.styled";

const FIELD_OPTIONS: Record<string, string[]> = {
  matrizFilial: ["Matriz", "Filial", "Matriz-Filial", "Pessoa Física"],
  tributacao: [
    "Simples Nacional",
    "Lucro Presumido",
    "Lucro Real Trimestral",
    "Lucro Real Anual (Estimativa Mensal)",
  ],
  ramo: [
    "Serviço",
    "Comércio",
    "Indústria",
    "Serviço + Comércio",
    "Serviço + Indústria",
    "Comércio + Indústria",
    "Serviço + Comércio + Indústria",
  ],
  perfilComercial: ["Black", "Blue", "Light"],
  reunioesFechamentos: [
    "Mensal",
    "Trimestral",
    "Semestral",
    "Sob demanda",
    "Não se aplica",
  ],
  consultoria: ["24 horas", "48 horas", "Sob demanda", "Não se aplica"],
  fechamentoContabil: ["Mensal", "Trimestral", "Anual", "Não se aplica"],
  analiseCompliance: [
    "Mensal",
    "Trimestral",
    "Semestral",
    "Anual",
    "Não se aplica",
  ],
  cobrancaServExtras: ["Sim", "Não"],
  complexidadeFiscal: ["Baixa", "Média", "Alta", "Não se aplica"],
  complexidadeContabil: ["Baixa", "Média", "Alta", "Não se aplica"],
  complexidade: ["Baixa", "Média", "Alta", "Não se aplica"],
  status: [
    "Em Implantação",
    "Pendente de Documentação",
    "Ativo",
    "Sem atividade",
    "Sem Movimento",
    "Baixada",
    "Em Saída",
    "Encerrado",
    "Bloqueado",
    "Doméstica",
  ],
};

const QUICK_FILTER_KEYS = [
  "status",
  "tributacao",
  "ramo",
  "perfilComercial",
  "matrizFilial",
  "complexidadeFiscal",
  "complexidadeContabil",
  "respAtendimentoUserId",
  "analistaLiderFiscalUserId",
  "analistaLiderContabilUserId",
];

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

  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  function getCellId(rowIndex: number, columnIndex: number) {
    return `${rowIndex}-${columnIndex}`;
  }

  function getColumnLabel(column: any) {
    return  column.label;
  }

  function toDateInputValue(value: any) {
    if (!value) return "";

    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.slice(0, 10);
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toISOString().slice(0, 10);
  }

  function formatDateBR(value: any) {
    if (!value) return "-";

    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      const [year, month, day] = value.slice(0, 10).split("-");
      return `${day}/${month}/${year}`;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function getColumnValue(item: any, column: any) {
    const value = item?.[column?.key];

    if (column?.type === "date") return formatDateBR(value);

    if (column?.type === "user") {
      const user = users?.find((u: any) => u.id === value);
      return user?.name || "";
    }

    return value ?? "";
  }

  function getColumnOptions(column: any) {
    if (!column) return [];

    if (column.type === "user") {
      return users.map((user: any) => ({
        label: user.name,
        value: user.id,
      }));
    }

    let options: any[] = [];

    if (Array.isArray(column.options)) {
      options = column.options;
    } else if (column.optionsKey && FIELD_OPTIONS[column.optionsKey]) {
      options = FIELD_OPTIONS[column.optionsKey];
    } else if (FIELD_OPTIONS[column.key]) {
      options = FIELD_OPTIONS[column.key];
    } else {
      options = Array.from(
        new Set(
          items
            .map((item: any) => String(item[column.key] ?? "").trim())
            .filter(Boolean)
        )
      ).sort((a: any, b: any) => a.localeCompare(b, "pt-BR"));
    }

    return options.map((option) => ({
      label: option,
      value: option,
    }));
  }

  const filterColumns = useMemo(() => {
    const preferred = QUICK_FILTER_KEYS.map((key) =>
      visibleColumns.find((column: any) => column.key === key)
    ).filter(Boolean);

    const fallback = visibleColumns
      .filter((column: any) => {
        if (column.type === "automatic") return false;
        if (column.type === "textarea") return false;
        return !QUICK_FILTER_KEYS.includes(column.key);
      })
      .slice(0, 4);

    return [...preferred, ...fallback];
  }, [visibleColumns]);

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(Boolean).length + (search ? 1 : 0);
  }, [filters, search]);

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (search.trim()) {
      const term = search.trim().toLowerCase();

      result = result.filter((item: any) =>
        visibleColumns.some((column: any) =>
          String(getColumnValue(item, column)).toLowerCase().includes(term)
        )
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;
      result = result.filter((item: any) => String(item[key] || "") === String(value));
    });

    if (sortConfig) {
      const column = visibleColumns.find((c: any) => c.key === sortConfig.key);

      result.sort((a: any, b: any) => {
        const valueA = String(getColumnValue(a, column));
        const valueB = String(getColumnValue(b, column));

        const comparison = valueA.localeCompare(valueB, "pt-BR", {
          numeric: true,
          sensitivity: "base",
        });

        return sortConfig.direction === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [items, search, filters, sortConfig, visibleColumns, users]);

  function startEdit(item: any, column: any, rowIndex: number, columnIndex: number) {
    if (column.type === "automatic") return;

    setEditingCell({
      id: getCellId(rowIndex, columnIndex),
      rowIndex,
      columnIndex,
      item,
      column,
    });

    setCellValue(
      column.type === "date"
        ? toDateInputValue(item[column.key])
        : item[column.key] ?? ""
    );
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
    const nextItem = filteredItems[rowIndex];
    const nextColumn = visibleColumns[columnIndex];

    if (!nextItem || !nextColumn) return;
    if (nextColumn.type === "automatic") return;

    startEdit(nextItem, nextColumn, rowIndex, columnIndex);
  }

  function handleEditorKeyDown(e: React.KeyboardEvent<any>) {
    if (!editingCell) return;

    const { rowIndex, columnIndex, column } = editingCell;

    if (e.key === "Enter" && column.type !== "textarea") {
      e.preventDefault();
      saveCell();
    }

    if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }

    if (e.key === "Tab") {
      e.preventDefault();

      const nextColumn = e.shiftKey ? columnIndex - 1 : columnIndex + 1;

      saveCell();

      setTimeout(() => {
        moveToCell(rowIndex, nextColumn);
      }, 0);
    }
  }

  function clearFilters() {
    setSearch("");
    setFilters({});
    setSortConfig(null);
  }

  function renderEditor(column: any) {
    const baseStyle: React.CSSProperties = {
      width: "100%",
      minHeight: 44,
      padding: "10px 14px",
      border: "2px solid #2563eb",
      outline: "none",
      background:
        "linear-gradient(180deg, rgba(239,246,255,1), rgba(255,255,255,1))",
      color: "#0f172a",
      fontSize: 13,
      fontWeight: 800,
      boxSizing: "border-box",
      fontFamily: "inherit",
      boxShadow: "0 8px 20px rgba(37,99,235,.18)",
    };

    const selectStyle: React.CSSProperties = {
      ...baseStyle,
      cursor: "pointer",
      appearance: "none",
      WebkitAppearance: "none",
      MozAppearance: "none",
      paddingRight: 38,
      backgroundImage:
        "linear-gradient(45deg, transparent 50%, #2563eb 50%), linear-gradient(135deg, #2563eb 50%, transparent 50%), linear-gradient(180deg, rgba(239,246,255,1), rgba(255,255,255,1))",
      backgroundPosition:
        "calc(100% - 20px) 18px, calc(100% - 14px) 18px, 0 0",
      backgroundSize: "6px 6px, 6px 6px, 100% 100%",
      backgroundRepeat: "no-repeat",
    };

    if (column.type === "select" || column.type === "user") {
      const options =
        column.type === "user"
          ? users.map((user: any) => ({ label: user.name, value: user.id }))
          : getColumnOptions(column);

      return (
        <select
          autoFocus
          value={cellValue}
          onChange={(e) => setCellValue(e.target.value)}
          onBlur={saveCell}
          onKeyDown={handleEditorKeyDown}
          style={selectStyle}
        >
          <option value="">
            {column.type === "user" ? "Selecione um usuário..." : "Selecione..."}
          </option>

          {options.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (column.type === "date") {
      return (
        <input
          autoFocus
          type="date"
          value={toDateInputValue(cellValue)}
          onChange={(e) => setCellValue(e.target.value)}
          onBlur={saveCell}
          onKeyDown={handleEditorKeyDown}
          style={baseStyle}
        />
      );
    }

    if (column.type === "textarea") {
      return (
        <textarea
          autoFocus
          value={cellValue}
          onChange={(e) => setCellValue(e.target.value)}
          onBlur={saveCell}
          onKeyDown={handleEditorKeyDown}
          style={{
            ...baseStyle,
            minHeight: 92,
            resize: "vertical",
            lineHeight: 1.4,
          }}
        />
      );
    }

    return (
      <input
        autoFocus
        type="text"
        value={cellValue}
        onChange={(e) => setCellValue(e.target.value)}
        onBlur={saveCell}
        onKeyDown={handleEditorKeyDown}
        style={baseStyle}
      />
    );
  }

  function renderCellValue(item: any, column: any) {
    if (column.type === "date") {
      return (
        <span
          style={{
            fontWeight: 850,
            color: item[column.key] ? "#0f172a" : "#94a3b8",
          }}
        >
          {formatDateBR(item[column.key])}
        </span>
      );
    }

    return renderCell(item, column, users);
  }

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <div style={topFilterBarStyle}>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 5,
      flex: 1,
      minWidth: 280,
      top:"10px",
      position:"relative",
    }}
  >
    <div style={searchWrapperStyle}>
      <Search
        size={16}
        style={{
          position: "absolute",
          left: 35,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#94a3b8",
        }}
      />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por código, empresa, CNPJ ou grupo..."
        style={{
          ...filterInputStyle,
          height: 44,
          paddingLeft: 44,
        }}
      />
    </div>

    <button
      type="button"
      onClick={() => setShowFilters((prev) => !prev)}
      style={{
        ...filterButtonStyle,
        height: 44,
        flexShrink: 0,
        position: "relative",
        right:"10px",

        border:
          activeFiltersCount > 0
            ? "1px solid rgba(187,159,88,.45)"
            : "1px solid #dbe3ef",

        background:
          activeFiltersCount > 0
            ? "linear-gradient(135deg, rgba(187,159,88,.18), #fff)"
            : "linear-gradient(180deg, #ffffff, #f8fafc)",

        color: activeFiltersCount > 0 ? "#8a6d2f" : "#334155",
      }}
    >
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: 10,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",

          background:
            activeFiltersCount > 0
              ? "linear-gradient(135deg, #bb9f58, #8a6d2f)"
              : "#f1f5f9",

          color: activeFiltersCount > 0 ? "#fff" : "#64748b",

          transform: showFilters
            ? "rotate(360deg)"
            : "rotate(0deg)",

         transition:
  "transform 1.6s cubic-bezier(.16,1,.3,1), background .25s ease",
        }}
      >
        <SlidersHorizontal size={15} />
      </span>

      Filtros

      {activeFiltersCount > 0 && (
        <span style={filterCounterStyle}>
          {activeFiltersCount}
        </span>
      )}
    </button>

    {activeFiltersCount > 0 && !isMobile &&(
      <button
        type="button"
        onClick={clearFilters}
        style={clearButtonStyle}
      >
        <X size={14} />
        Limpar
      </button>
    )}
  </div>
{!isMobile && (
  <div style={resultBadgeStyle}>
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: 999,

        background:
          filteredItems.length === items.length
            ? "#22c55e"
            : "#bb9f58",

        boxShadow:
          filteredItems.length === items.length
            ? "0 0 0 4px rgba(34,197,94,.12)"
            : "0 0 0 4px rgba(187,159,88,.15)",
      }}
    />

    <span>
      {filteredItems.length === items.length
        ? `${items.length} registros`
        : `${filteredItems.length} de ${items.length} registros`}
    </span>
  </div>
)}

</div>

      {showFilters && (
        <div style={filterPanelContainerStyle}>
          <div style={filterPanelHeaderStyle}>
            <div>
              <strong
                style={{
                  display: "block",
                  fontSize: 15,
                  fontWeight: 950,
                  color: "#0f172a",
                }}
              >
                Filtros avançados
              </strong>

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 750,
                  color: "#64748b",
                }}
              >
                Use os campos abaixo para refinar a matriz.
              </span>
            </div>

           
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 14,
            }}
          >
            <div>
              <label style={filterLabelStyle}>Ordenação</label>

              <select
                value={
                  sortConfig ? `${sortConfig.key}:${sortConfig.direction}` : ""
                }
                onChange={(e) => {
                  if (!e.target.value) {
                    setSortConfig(null);
                    return;
                  }

                  const [key, direction] = e.target.value.split(":");

                  setSortConfig({
                    key,
                    direction: direction as "asc" | "desc",
                  });
                }}
                style={premiumSelectStyle}
              >
                <option value="">Ordenar registros</option>

                {visibleColumns
                  .filter((column: any) => column.type !== "textarea")
                  .map((column: any) => (
                    <option key={`${column.key}:asc`} value={`${column.key}:asc`}>
                      {getColumnLabel(column)} A → Z
                    </option>
                  ))}
              </select>
            </div>

            {filterColumns.map((column: any) => {
              const options = getColumnOptions(column);

              return (
                <div key={column.key}>
                  <label style={filterLabelStyle}>{getColumnLabel(column)}</label>

                  <select
                    value={filters[column.key] || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        [column.key]: e.target.value,
                      }))
                    }
                    style={premiumSelectStyle}
                  >
                    <option value="">Todos</option>

                   {options.map((option: any) => {
                    const isDateColumn = column.type === "date";

                    const formattedLabel =
                      isDateColumn && option.label
                        ? formatDateBR(option.label)
                        : option.label;

                    return (
                      <option key={option.value} value={option.value}>
                        {formattedLabel}
                      </option>
                    );
                  })}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
              {visibleColumns.map((column: any) => (
                <th key={column.key} style={thStyle}>
                  <span style={columnHeaderInnerStyle}>
                    {getColumnLabel(column)}
                  </span>
                </th>
              ))}

              <th
                style={{
                  ...actionThStyle,
                  ...stickyActionColumnStyle,
                  right: 0,
                  zIndex: 20,
                  background: "#fff",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <ScanEye color="#334155" size={23} />
              </th>
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
            ) : filteredItems.length === 0 ? (
              <tr>
                <td
                  colSpan={(visibleColumns.length || 1) + 1}
                  style={emptyStyle}
                >
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              filteredItems.map((item: any, rowIndex: number) => (
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
                      <td key={column.key} style={{ ...tdStyle, padding: 0 }}>
                        {isEditing ? (
                          renderEditor(column)
                        ) : (
                          <div
                            onClick={() =>
                              startEdit(item, column, rowIndex, columnIndex)
                            }
                            style={{
                              minHeight: 42,
                              padding: "10px 12px",
                              cursor:
                                column.type === "automatic" ? "default" : "cell",
                              display: "flex",
                              alignItems: "center",
                              border: "1px solid transparent",
                            }}
                          >
                            {renderCellValue(item, column)}
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
                      background: rowIndex % 2 === 0 ? "#fff" : "#fcfcfd",
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
    </div>
  );
}

const topFilterBarStyle: React.CSSProperties = {
  width: "100%",
  display: "grid",
  gridTemplateColumns: "1fr auto auto auto",
  alignItems: "center",
  gap: 12,
  marginBottom: 14,
};

const searchWrapperStyle: React.CSSProperties = {
  flex: 1,
  maxWidth: 520,
  position: "relative",
  padding: "25px 20px",
};

const filterButtonStyle: React.CSSProperties = {
  height: 44,
  padding: "0 16px",
  borderRadius: 16,
  display: "inline-flex",
  alignItems: "center",
  gap: 9,
  fontSize: 13,
  fontWeight: 950,
  cursor: "pointer",
  boxShadow: "0 10px 24px rgba(15,23,42,.07)",
};

const filterCounterStyle: React.CSSProperties = {
  minWidth: 22,
  height: 22,
  padding: "0 7px",
  borderRadius: 999,
  background: "#bb9f58",
  color: "#fff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 11,
  fontWeight: 950,
};

const resultBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  height: 44,
  padding: "0 13px",
  borderRadius: 999,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#475569",
  fontSize: 12,
  fontWeight: 900,
  whiteSpace: "nowrap",
  position:"relative",
  top:"10px",
};

const filterPanelContainerStyle: React.CSSProperties = {
  marginBottom: 0,
  padding: "30px 16px",
  borderRadius: 0,
  width: "100%",
  background:
    "radial-gradient(circle at top left, rgba(187,159,88,.14), transparent 34%), linear-gradient(180deg, #ffffff, #f8fafc)",
  
  boxSizing: "border-box",
};

const filterPanelHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  marginBottom: 16,
  flexWrap: "wrap",
};

const clearButtonStyle: React.CSSProperties = {
  height: 38,
  padding: "0 13px",
  borderRadius: 14,
  border: "1px solid #fee2e2",
  background: "linear-gradient(180deg, #fff, #fff7f7)",
  color: "#dc2626",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontSize: 12,
  fontWeight: 950,
  cursor: "pointer",
};

const filterLabelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 7,
  fontSize: 11,
  fontWeight: 950,
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: ".055em",
};

const filterInputStyle: React.CSSProperties = {
  width: "100%",
  height: 42,
  borderRadius: 16,
  border: "1px solid #dbe3ef",
  outline: "none",
  background: "#fff",
  color: "#0f172a",
  padding: "0 13px",
  fontSize: 13,
  fontWeight: 800,
  boxSizing: "border-box",
  boxShadow: "0 10px 24px rgba(15,23,42,.05)",
};

const premiumSelectStyle: React.CSSProperties = {
  width: "100%",
  height: 42,
  borderRadius: 16,
  border: "1px solid #dbe3ef",
  outline: "none",
  backgroundColor: "#fff",
  color: "#0f172a",
  padding: "0 38px 0 13px",
  fontSize: 13,
  fontWeight: 850,
  cursor: "pointer",
  boxSizing: "border-box",
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  backgroundImage:
    "linear-gradient(45deg, transparent 50%, #bb9f58 50%), linear-gradient(135deg, #bb9f58 50%, transparent 50%)",
  backgroundPosition: "calc(100% - 19px) 18px, calc(100% - 13px) 18px",
  backgroundSize: "6px 6px, 6px 6px",
  backgroundRepeat: "no-repeat",
  boxShadow: "0 10px 24px rgba(15,23,42,.05)",
};