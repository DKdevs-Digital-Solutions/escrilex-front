import React, { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Check,
  CheckCircle2,
  Columns3,
  Database,
  DatabaseSearch,
  Eye,
  LayoutGrid,
  Pencil,
  RefreshCw,
  RotateCcw,
  Rows3,
  Search,
  SlidersHorizontal,
  Table2,
  X,
} from "lucide-react";
import { useExpectationMatrix } from "../hooks/useExpectationMatrix";
import { MatrixHero } from "../components/ExpectationMatrix/MatrixHero";
import { MatrixStats } from "../components/ExpectationMatrix/MatrixStats";
import { MatrixFilters } from "../components/ExpectationMatrix/MatrixFilters";

import {
  pageStyle,

  avatarStyle,
  statusBadgeStyle,

  clearButtonStyle,
  columnKeyStyle,
  columnLabelStyle,
  columnRowStyle,
  columnTypeBadgeStyle,
 
  columnsListStyle,
  columnsPanelActionsStyle,
  columnsPanelHeaderStyle,
  columnsPanelStyle,
 
  drawerFieldLabelStyle,
  drawerFieldStyle,
  drawerFieldValueStyle,
  drawerFieldsGridStyle,
  drawerHeaderActionsStyle,
  drawerHeaderStyle,
  drawerKickerStyle,
  drawerOverlayStyle,
  drawerSectionStyle,
  drawerSectionTitleStyle,
  drawerStyle,
  drawerSubtitleStyle,
  drawerTitleStyle,

  errorStyle,

  mutedTextStyle,
  panelKickerStyle,
  panelOverlayStyle,
  panelSubtitleStyle,
  panelTitleStyle,
 
  selectPillStyle,
  softActionButtonStyle,

  textareaCellStyle,


} from "../styles/ExpectationMatrix.styled";
import { AdvancedFiltersModal } from "../components/ExpectationMatrix/AdvancedFiltersModal";
import { MatrixDatabase } from "../components/ExpectationMatrix/MatrixDatabase";
import { EditableField } from "../components/ExpectationMatrix/EditableField";



const DEFAULT_VISIBLE_COLUMNS = [
  "codigo",
  "empresa",
  "cnpjCpf",
  "grupo",
  "status",
];

export function ExpectationMatrixPage() {

const {
    total,
  loading,
  loadingOptions,
  saving,
  error,
  columns,
  options,
  users,
  search,
  setSearch,
  status,
  setStatus,
  grupo,
  setGrupo,
  tributacao,
  setTributacao,
  ramo,
  setRamo,
  perfil,
  setPerfil,
  loadMatrix,
  clearFilters,
  saveMatrix,
  
} = useExpectationMatrix();

  const [columnsOpen, setColumnsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [compact, setCompact] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState<string[]>(DEFAULT_VISIBLE_COLUMNS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  const visibleColumns = useMemo(() => {
    return columns.filter((column: any) => visibleKeys.includes(column.key));
  }, [columns, visibleKeys]);


  function toggleColumn(key: string) {
    setVisibleKeys((prev) =>
      prev.includes(key)
        ? prev.filter((item) => item !== key)
        : [...prev, key]
    );
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadMatrix({ offset: 0 });
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, grupo]);


  return (
    <div style={pageStyle}>
      
      <MatrixHero loading={loading} onRefresh={() => loadMatrix()} />

      <MatrixStats
        items={[]}
        total={total}
        visibleColumnsCount={visibleColumns.length}
      />

      {/* <MatrixFilters
        search={search}
        setSearch={setSearch}
        onOpenFilters={() => setFiltersOpen(true)}
      /> */}

      {filtersOpen && (
        <AdvancedFiltersModal
          status={status}
          setStatus={setStatus}
          grupo={grupo}
          setGrupo={setGrupo}
          tributacao={tributacao}
          setTributacao={setTributacao}
          ramo={ramo}
          setRamo={setRamo}
          perfil={perfil}
          setPerfil={setPerfil}
          options={options}
          clearFilters={clearFilters}
          loadMatrix={loadMatrix}
          onClose={() => setFiltersOpen(false)}
        />
      )}

      {error && <div style={errorStyle}>{error}</div>}

      <MatrixDatabase
        
        users={users}
        total={total}
        loading={loading}
        loadingOptions={loadingOptions}
        visibleColumns={visibleColumns}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenColumns={() => setColumnsOpen(true)}
        onSelectRow={setSelectedRow}
        saveMatrix={saveMatrix}
      />

      
      {columnsOpen && (
        <ColumnsPanel
          columns={columns}
          visibleKeys={visibleKeys}
          setVisibleKeys={setVisibleKeys}
          toggleColumn={toggleColumn}
          onClose={() => setColumnsOpen(false)}
        />
      )}

      {selectedRow && (
        <MatrixDrawer
        row={selectedRow}
        columns={columns}
        users={users}
        options={options}
        saving={saving}
        onSave={saveMatrix}
        onClose={() => setSelectedRow(null)}
        />
      )}
    </div>
  );
}

function ColumnsPanel({
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
              Escolha os campos que devem aparecer na sua visualização principal.
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

                        filter: checked
                        ? "drop-shadow(0 0 6px rgba(187,159,88,.45))"
                        : "none",
                    }}
                    />

                {/* <span style={columnTypeIconStyle}>{getColumnIcon(column.type)}</span> */}

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


function buildChangedPayload(original: any, form: any) {
  const payload: Record<string, any> = {};

  Object.keys(form).forEach((key) => {
    if (form[key] !== original[key]) {
      payload[key] = form[key];
    }
  });

  return payload;
}


function MatrixDrawer({
  row,
  columns,
  users,
  options,
  saving,
  onSave,
  onClose,
}: any) {

  const [form, setForm] = React.useState<any>(row);
  const [editing, setEditing] = React.useState(false);

const companyColumns = columns
  .filter((c: any) =>
    [
      "codigo",
      "empresa",
      "cnpjCpf",
      "grupo",
      "matrizFilial",
      "tributacao",
      "ramo",
      "perfilComercial",
      "status",
    ].includes(c.key)
  )
  .map((column: any) => ({
    ...column,
    label:
      column.key === "status"
        ? "Situação"
        : column.label,
  }));

  const responsibleColumns = columns.filter((c: any) => c.type === "user");

  const otherColumns = columns.filter(
    (c: any) =>
      !companyColumns.some((cc: any) => cc.key === c.key) &&
      !responsibleColumns.some((rc: any) => rc.key === c.key)
  );

  function updateField(key: string, value: any) {
    setForm((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  }

  function cancelEdit() {
    setForm(row);
    setEditing(false);
  }

  async function handleSave() {
  try {
    const payload = buildChangedPayload(row, form);

    if (Object.keys(payload).length === 0) {
      setEditing(false);
      return;
    }

    await onSave(row.companyId, payload);

    setEditing(false);
    onClose();
  } catch (err) {
    console.error("Erro ao salvar:", err);
  }
}

  return (
    <div style={drawerOverlayStyle} onClick={onClose}>
      <div style={drawerStyle} onClick={(e) => e.stopPropagation()}>
        <div style={drawerHeaderStyle}>
          <div>
            <div style={drawerKickerStyle}>
              {editing ? "Editando registro" : "Registro selecionado"}
            </div>

            <h2 style={drawerTitleStyle}>{form.empresa || "--"}</h2>

            <p style={drawerSubtitleStyle}>
              {form.codigo || "--"} • {form.cnpjCpf || "--"}
            </p>
          </div>

          <div style={drawerHeaderActionsStyle}>
            <button onClick={onClose} style={clearButtonStyle}>
                  <X size={16} />
                </button>
            
          </div>
        </div>

        <DrawerSection
          title="Empresa"
          columns={companyColumns}
          row={form}
          users={users}
          options={options}
          editing={editing}
          onChange={updateField}
        />

        <DrawerSection
          title="Responsáveis"
          columns={responsibleColumns}
          row={form}
          users={users}
          options={options}
          editing={editing}
          onChange={updateField}
        />

        <DrawerSection
          title="Demais informações"
          columns={otherColumns}
          row={form}
          users={users}
          options={options}
          editing={editing}
          onChange={updateField}
        />
        {/* <div style={drawerActionBarStyle}>
        {!editing ? (
            <button
            onClick={() => setEditing(true)}
            style={drawerEditButtonStyle}
            >
            <Pencil size={16} />
            Editar registro
            </button>
        ) : (
            <>
            <button onClick={cancelEdit} style={drawerCancelButtonStyle}>
                <X size={16} />
                Cancelar
            </button>

            <button
            onClick={handleSave}
            disabled={saving}
            style={{
                ...drawerSaveButtonStyle,
                opacity: saving ? 0.7 : 1,
                cursor: saving ? "not-allowed" : "pointer",
            }}
            >
            <Check size={16} />
            {saving ? "Salvando..." : "Salvar alterações"}
            </button>
            </>
        )}
        </div> */}
      </div>
      
    </div>
  );
}



function DrawerSection({
  title,
  columns,
  row,
  users,
  options,
  editing,
  onChange,
}: any) {
  if (!columns.length) return null;

  return (
    <div style={drawerSectionStyle}>
      <h3 style={drawerSectionTitleStyle}>{title}</h3>
      <br />

      <div style={drawerFieldsGridStyle}>
        {columns.map((column: any) => (
          <div key={column.key} style={drawerFieldStyle}>
            <span style={drawerFieldLabelStyle}>{column.label}</span>

            {!editing ? (
              <div style={drawerFieldValueStyle}>
                {renderCell(row, column, users)}
              </div>
            ) : (
              <EditableField
                column={column}
                value={row[column.key]}
                users={users}
                options={options}
                onChange={(value: any) => onChange(column.key, value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderCell(item: any, column: any, users: any[]) {
  const value = item[column.key];

  if (column.type === "user") {
    const user = users.find((u: any) => u.id === value);

    if (!user) return <span style={mutedTextStyle}>—</span>;

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={avatarStyle}>{getInitials(user.name)}</span>
        <div>
          <strong>{user.name}</strong>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
            {user.sector?.name || ""}
          </div>
        </div>
      </div>
    );
  }

  if (column.type === "date") {
    return value ? new Date(value).toLocaleDateString("pt-BR") : <span style={mutedTextStyle}>—</span>;
  }

  if (column.key === "status") {
    return <StatusBadge status={value} />;
  }

  if (column.type === "select") {
    return <SelectPill value={value} />;
  }

  if (column.type === "textarea") {
    return (
      <span style={textareaCellStyle}>
        {value || "—"}
      </span>
    );
  }

  return value || <span style={mutedTextStyle}>—</span>;
}

function SelectPill({ value }: { value: string }) {
  if (!value) return <span style={mutedTextStyle}>—</span>;

  return <span style={selectPillStyle}>{value}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status?.toUpperCase();
  const isActive = normalized === "ATIVA" || normalized === "ATIVO";

  return (
    <span
      style={{
        ...statusBadgeStyle,
        background: isActive ? "rgba(34,197,94,.12)" : "rgba(239,68,68,.10)",
        border: isActive ? "1px solid rgba(34,197,94,.20)" : "1px solid rgba(239,68,68,.18)",
        color: isActive ? "#15803d" : "#dc2626",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: isActive ? "#22c55e" : "#ef4444",
        }}
      />
      {status || "—"}
    </span>
  );
}


function getInitials(name?: string) {
  return (name || "?")
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

