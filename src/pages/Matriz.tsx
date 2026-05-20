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

const DEFAULT_VISIBLE_COLUMNS = [
  "codigo",
  "empresa",
  "cnpjCpf",
  "grupo",
  "tributacao",
  "ramo",
  "perfilComercial",
  "status",
];

export function ExpectationMatrixPage() {

const {
  items,
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

  const activeCount = items.filter((item: any) => {
    const value = String(item.status || "").toUpperCase();
    return value === "ATIVA" || value === "ATIVO";
  }).length;

  const inactiveCount = items.length - activeCount;

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
    }, [
    search,
    grupo,
    ]);


  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={heroIconStyle}>
            <Database size={28} color="#38bdf8" />
          </div>

          <div>
            <div style={heroBadgeStyle}>
              <span style={liveDotStyle} />
              Base operacional
            </div>

            <h1 style={heroTitleStyle}>Matriz de Expectativas</h1>

            <p style={heroTextStyle}>
              Uma visão dinâmica dos clientes, responsáveis, obrigações, prazos e status operacionais.
            </p>
          </div>
        </div>

        <button
          onClick={() => loadMatrix()}
          disabled={loading}
          style={refreshButtonStyle}
        >
          <RefreshCw size={16} />
          Atualizar dados
        </button>
      </div>

     <div style={statsGridStyle}>
        <StatCard
            icon={
            <div
                style={{
                ...statIconStyle,
                background: "rgba(59,130,246,.12)",
                color: "#3b82f6",
                }}
            >
                <Building2 size={18} />
            </div>
            }
            label="Registros"
            value={total}
        />

        <StatCard
            icon={
            <div
                style={{
                ...statIconStyle,
                background: "rgba(34,197,94,.12)",
                color: "#22c55e",
                }}
            >
                <CheckCircle2 size={18} />
            </div>
            }
            label="Ativos"
            value={activeCount}
        />

        <StatCard
            icon={
            <div
                style={{
                ...statIconStyle,
                background: "rgba(239,68,68,.12)",
                color: "#ef4444",
                }}
            >
                <X size={18} />
            </div>
            }
            label="Inativos"
            value={inactiveCount}
        />

        <StatCard
            icon={
            <div
                style={{
                ...statIconStyle,
                background: "rgba(144, 0, 246, 0.16)",
                color: "#925cbc",
                }}
            >
                <Columns3 size={18} />
            </div>
            }
            label="Colunas visíveis"
            value={visibleColumns.length}
        />
        </div>

      <div style={filterPanelStyle}>
        <div style={filterHeaderStyle}>
          <div>
            <strong style={filterTitleStyle}>Filtros inteligentes</strong>
            <p style={filterSubtitleStyle}>Refine a base por busca, status, tributação, ramo e perfil.</p>
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

          <button
                onClick={() => setFiltersOpen(true)}
                style={openFiltersButtonStyle}
            >
                <SlidersHorizontal size={18} />
            </button>
        </div>
      </div>

      {filtersOpen && (
  <div style={filterModalOverlayStyle} onClick={() => setFiltersOpen(false)}>
    <div style={filterModalStyle} onClick={(e) => e.stopPropagation()}>
      <div style={filterModalHeaderStyle}>
        <div>
          <div style={filterModalKickerStyle}>Filtros avançados</div>

          <h2 style={filterModalTitleStyle}>
            Refinar Matriz
          </h2>

          <p style={filterModalSubtitleStyle}>
            Selecione os critérios para encontrar empresas específicas na base.
          </p>
        </div>

        <button
          onClick={() => setFiltersOpen(false)}
          style={clearButtonStyle}
        >
          <X size={16} />
        </button>
      </div>

      <div style={filterModalGridStyle}>
        

        <label style={fieldStyle}>
          <span style={fieldLabelStyle}>Status</span>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={inputStyle}
          >
            <option value="">Todos</option>
            {(options?.status ?? []).map((item: string) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label style={fieldStyle}>
          <span style={fieldLabelStyle}>Grupo</span>

          <input
            placeholder="Grupo"
            value={grupo}
            onChange={(e) => setGrupo(e.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={fieldStyle}>
          <span style={fieldLabelStyle}>Tributação</span>

          <select
            value={tributacao}
            onChange={(e) => setTributacao(e.target.value)}
            style={inputStyle}
          >
            <option value="">Todas</option>
            {(options?.tributacao ?? []).map((item: string) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label style={fieldStyle}>
          <span style={fieldLabelStyle}>Ramo</span>

          <select
            value={ramo}
            onChange={(e) => setRamo(e.target.value)}
            style={inputStyle}
          >
            <option value="">Todos</option>
            {(options?.ramo ?? []).map((item: string) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label style={fieldStyle}>
          <span style={fieldLabelStyle}>Perfil comercial</span>

          <select
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
            style={inputStyle}
          >
            <option value="">Todos</option>
            {(options?.perfilComercial ?? []).map((item: string) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={filterModalFooterStyle}>
        <button
          onClick={clearFilters}
          style={filterGhostButtonStyle}
        >
          <X size={15} />
          Limpar filtros
        </button>

        <button
          onClick={() => {
            loadMatrix({ offset: 0 });
            setFiltersOpen(false);
          }}
          style={filterApplyButtonStyle}
        >
          <SlidersHorizontal size={15} />
          Aplicar filtros
        </button>
      </div>
    </div>
  </div>
)}

      {error && <div style={errorStyle}>{error}</div>}

      <div style={databaseCardStyle}>
        <div style={databaseHeaderStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={databaseMiniIconStyle}>
              <DatabaseSearch size={18} color="#bb9f58" />
            </div>

            <div>
              <p style={databaseSubtitleStyle}>
                {loading || loadingOptions
                  ? "Carregando estrutura e registros..."
                  : `${total} registros carregados • ${visibleColumns.length} colunas em exibição`}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
            onClick={() =>
                setViewMode((prev) => (prev === "table" ? "cards" : "table"))
            }
            style={viewButtonStyle}
            title={viewMode === "table" ? "Visualizar em cards" : "Visualizar em tabela"}
            >
            {viewMode === "table" ? (
                <LayoutGrid size={15} />
            ) : (
                <Rows3 size={15} />
            )}
            </button>

            <button
            onClick={() => setColumnsOpen(true)}
            style={columnsButtonStyle}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                "0 18px 36px rgba(15,23,42,.28), inset 0 1px 0 rgba(255,255,255,.08)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                "0 12px 28px rgba(15,23,42,.22), inset 0 1px 0 rgba(255,255,255,.05)";
            }}
            >
            <div
                style={{
                width: 24,
                height: 24,
                borderRadius: 8,
                background: "rgba(187,159,88,.18)",
                border: "1px solid rgba(187,159,88,.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#BB9F58",
                flexShrink: 0,
                }}
            >
                <Columns3 size={14} />
            </div>

            <span>Gerenciar colunas</span>
            </button>
          </div>
        </div>

        {viewMode === "table" ? (
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
              <span style={columnHeaderInnerStyle}>{column.label}</span>
            </th>
          ))}

          <th style={actionThStyle}>Ações</th>
        </tr>
      </thead>

      <tbody>
        {loading || loadingOptions ? (
          <tr>
            <td colSpan={(visibleColumns.length || 1) + 1} style={emptyStyle}>
              Carregando matriz de expectativas...
            </td>
          </tr>
        ) : (
          items.map((item: any, rowIndex: number) => (
            <tr
              key={item.companyId}
              onClick={() => setSelectedRow(item)}
              style={{
                cursor: "pointer",
                background: rowIndex % 2 === 0 ? "#fff" : "#fcfcfd",
                transition: "background .15s ease, box-shadow .15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f8fafc";
                e.currentTarget.style.boxShadow = "inset 4px 0 0 #2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  rowIndex % 2 === 0 ? "#fff" : "#fcfcfd";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {visibleColumns.map((column: any, index: number) => (
                <td
                  key={column.key}
                  style={{
                    ...tdStyle,
                    padding: compact ? "10px 13px" : "15px 15px",
                    ...(index === 0 ? stickyFirstColumnStyle : {}),
                  }}
                >
                  {renderCell(item, column, users)}
                </td>
              ))}

              <td style={{ ...tdStyle, textAlign: "center", width: 80 }}>
                <button
                  style={eyeButtonStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRow(item);
                  }}
                >
                  <Eye size={15} />
                </button>
              </td>
            </tr>
          ))
        )}

        {!loading && !loadingOptions && items.length === 0 && (
          <tr>
            <td colSpan={(visibleColumns.length || 1) + 1} style={emptyStyle}>
              Nenhum registro encontrado.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
) : (
  <div style={cardsViewStyle}>
    {loading || loadingOptions ? (
      <div style={emptyCardsStyle}>Carregando matriz de expectativas...</div>
    ) : (
      items.map((item: any) => (
        <div
          key={item.companyId}
          style={databaseCardItemStyle}
          onClick={() => setSelectedRow(item)}
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

            {renderCell(
              item,
              { key: "status", type: "select", label: "STATUS" },
              users
            )}
          </div>

          <div style={cardFieldsGridStyle}>
            {visibleColumns
              .filter(
                (column: any) =>
                  !["empresa", "codigo", "cnpjCpf", "status"].includes(
                    column.key
                  )
              )
              .slice(0, 8)
              .map((column: any) => (
                <div key={column.key} style={cardFieldStyle}>
                  <span style={cardFieldLabelStyle}>{column.label}</span>
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
              setSelectedRow(item);
            }}
          >
            <Eye size={15} />
            Ver detalhes
          </button>
        </div>
      ))
    )}

    {!loading && !loadingOptions && items.length === 0 && (
      <div style={emptyCardsStyle}>Nenhum registro encontrado.</div>
    )}
  </div>
)}
</div>


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

  const companyColumns = columns.filter((c: any) =>
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
  );

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
        <div style={drawerActionBarStyle}>
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
        </div>
      </div>
      
    </div>
  );
}

function EditableDrawerSection({
  title,
  columns,
  form,
  users,
  options,
  onChange,
}: any) {
  if (!columns.length) return null;

  return (
    <div style={drawerSectionStyle}>
      <h3 style={drawerSectionTitleStyle}>{title}</h3>

      <div style={drawerFieldsGridStyle}>
        {columns.map((column: any) => (
          <div key={column.key} style={drawerFieldStyle}>
            <span style={drawerFieldLabelStyle}>{column.label}</span>

            <EditableField
              column={column}
              value={form[column.key]}
              users={users}
              options={options}
              onChange={(value: any) => onChange(column.key, value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function EditableField({ column, value, users, options, onChange }: any) {
  if (column.type === "automatic") {
    return (
      <input
        value={value || ""}
        disabled
        style={{
          ...drawerInputStyle,
          background: "#f8fafc",
          color: "#64748b",
          cursor: "not-allowed",
        }}
      />
    );
  }

  if (column.type === "user") {
    return (
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        style={drawerInputStyle}
      >
        <option value="">Sem responsável</option>

        {users.map((user: any) => (
          <option key={user.id} value={user.id}>
            {user.name} {user.sector?.name ? `• ${user.sector.name}` : ""}
          </option>
        ))}
      </select>
    );
  }

  if (column.type === "select") {
    const list = options?.[column.optionsKey] ?? [];

    return (
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        style={drawerInputStyle}
      >
        <option value="">Selecione</option>

        {list.map((item: string) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    );
  }

  if (column.type === "date") {
    return (
      <input
        type="date"
        value={value ? String(value).slice(0, 10) : ""}
        onChange={(e) => onChange(e.target.value || null)}
        style={drawerInputStyle}
      />
    );
  }

  if (column.type === "textarea") {
    return (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...drawerInputStyle,
          height: 92,
          paddingTop: 10,
          resize: "vertical",
        }}
      />
    );
  }

  return (
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      style={drawerInputStyle}
    />
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
            {user.sector?.name || user.email}
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

function getColumnIcon(type?: string) {
  if (type === "user") return <UsersMini />;
  if (type === "date") return <span style={miniIconTextStyle}>D</span>;
  if (type === "select") return <span style={miniIconTextStyle}>S</span>;
  if (type === "textarea") return <span style={miniIconTextStyle}>T</span>;
  return <span style={miniIconTextStyle}>A</span>;
}

function UsersMini() {
  return <span style={miniIconTextStyle}>U</span>;
}

function StatCard({ icon, label, value }: any) {
  return (
    <div style={statCardStyle}>
      <div style={statIconStyle}>{icon}</div>
      <div>
        <strong style={statValueStyle}>{value}</strong>
        <span style={statLabelStyle}>{label}</span>
      </div>
    </div>
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

const pageStyle: React.CSSProperties = {
  fontFamily: "Inter, system-ui, sans-serif",
  display: "grid",
  gap: 18,
};

const heroStyle: React.CSSProperties = {
  padding: 28,
  borderRadius: 10,
   background:
              "linear-gradient(135deg, #012942 0%, #012942 55%, #012942 100%)",
  color: "#fff",
  display: "flex",
  justifyContent: "space-between",
  gap: 20,
  boxShadow: "0 24px 60px rgba(1,41,66,.20)",
};

const heroIconStyle: React.CSSProperties = {
  width: 58,
  height: 58,
  borderRadius: 20,
    background:
        "linear-gradient(135deg, rgba(56,189,248,.28), rgba(34,197,94,.18))",
    border: "1px solid rgba(255,255,255,.28)",
    boxShadow:
        "inset 0 1px 0 rgba(255,255,255,.18), 0 14px 30px rgba(56,189,248,.18)",
    display: "grid",
  placeItems: "center",
};

const heroBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 8,
  padding: "5px 10px",
  borderRadius: 999,
  background: "rgba(255,255,255,.10)",
  border: "1px solid rgba(255,255,255,.14)",
  color: "#bae6fd",
  fontSize: 11,
  fontWeight: 950,
  textTransform: "uppercase",
  letterSpacing: ".08em",
};

const liveDotStyle: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: "#22c55e",
  boxShadow: "0 0 0 5px rgba(34,197,94,.14)",
};

const heroTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 29,
  fontWeight: 950,
  letterSpacing: "-.04em",
};

const heroTextStyle: React.CSSProperties = {
  margin: "7px 0 0",
  color: "rgba(255,255,255,.72)",
  fontSize: 13.5,
  maxWidth: 620,
};

const refreshButtonStyle: React.CSSProperties = {
  height: 44,
  padding: "0 16px",
  borderRadius: 15,
  border: "1px solid rgba(255,255,255,.18)",
  background: "rgba(255,255,255,.10)",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

const statsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 14,
};

const statCardStyle: React.CSSProperties = {
  padding: 16,
  borderRadius: 20,
  background: "#fff",
  border: "1px solid #e2e8f0",
  boxShadow: "0 12px 30px rgba(15,23,42,.05)",
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const statIconStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 14,
  background: "#eff6ff",
  color: "#2563eb",
  display: "grid",
  placeItems: "center",
};

const statValueStyle: React.CSSProperties = {
  display: "block",
  color: "#0f172a",
  fontSize: 21,
  fontWeight: 950,
};

const statLabelStyle: React.CSSProperties = {
  display: "block",
  marginTop: 2,
  color: "#64748b",
  fontSize: 12,
  fontWeight: 800,
};

const filterPanelStyle: React.CSSProperties = {
  padding: 18,
  borderRadius: 22,
  background: "#fff",
  border: "1px solid #e2e8f0",
  boxShadow: "0 12px 30px rgba(15,23,42,.05)",
};

const filterHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 15,
};

const filterTitleStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: 15,
  fontWeight: 950,
};

const filterSubtitleStyle: React.CSSProperties = {
  margin: "4px 0 0",
  color: "#64748b",
  fontSize: 12.5,
  fontWeight: 600,
};

const filtersGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "2fr repeat(2, 1fr) auto auto",
  gap: 10,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#0f172a",
  padding: "0 12px",
  fontSize: 13,
  outline: "none",
};

const primaryButtonStyle: React.CSSProperties = {
  height: 44,
  padding: "0 18px",
  borderRadius: 14,
  border: "1px solid #012942",
  background: "#012942",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};

const clearButtonStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 14,
  border: "1px solid #e2e8f0",
  background: "#fff",
  color: "#64748b",
  fontWeight: 900,
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
};

const errorStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 14,
  background: "#fef2f2",
  border: "1px solid #fecaca",
  color: "#991b1b",
  fontSize: 13,
  fontWeight: 700,
};

const databaseCardStyle: React.CSSProperties = {
  borderRadius: "20px 20px 0px 0px",
  background: "#fff",
  border: "1px solid #e2e8f0",
  boxShadow: "0 18px 45px rgba(15,23,42,.07)",
  overflow: "hidden",
};

const databaseHeaderStyle: React.CSSProperties = {
  padding: "16px 18px",
  borderBottom: "1px solid #e2e8f0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  background: "linear-gradient(180deg, #fff 0%, #f8fafc 100%)",
};

const databaseMiniIconStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 10,
  display: "grid",
  placeItems: "center",
  background: "#f8fafc",
  color: "#012942",
  border: "1px solid #ccc",
};

const databaseTitleStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: 15,
  fontWeight: 950,
};

const databaseSubtitleStyle: React.CSSProperties = {
  margin: "3px 0 0",
  color: "#64748b",
  fontSize: 12.5,
  fontWeight: 600,
};

const viewButtonStyle: React.CSSProperties = {
  height: 40,
  padding: "0 14px",
  borderRadius: 14,
  border: "1px solid #e2e8f0",
  background: "#fff",
  color: "#334155",
  fontSize: 12.5,
  fontWeight: 900,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  boxShadow: "0 6px 16px rgba(15,23,42,.05)",
};


const columnsButtonStyle: React.CSSProperties = {
  height: 42,
  padding: "0 16px",

  borderRadius: 14,

  border: "1px solid rgba(255,255,255,.08)",

  background:
    "linear-gradient(135deg, rgba(15,23,42,.96), rgba(30,41,59,.96))",

  color: "#f8fafc",

  fontSize: 12.5,
  fontWeight: 900,
  letterSpacing: ".01em",

  cursor: "pointer",

  display: "inline-flex",
  alignItems: "center",
  gap: 9,

  boxShadow:
    "0 12px 28px rgba(15,23,42,.22), inset 0 1px 0 rgba(255,255,255,.05)",

  transition:
    "all .18s cubic-bezier(.4,0,.2,1)",

  position: "relative",

  overflow: "hidden",

  backdropFilter: "blur(12px)",
};


const tableScrollStyle: React.CSSProperties = {
  overflow: "auto",
  maxHeight: "68vh",
  position: "relative",
};

const thStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 6,
  padding: "12px 14px",
  textAlign: "left",
  color: "#475569",
  fontSize: 11,
  fontWeight: 950,
  borderBottom: "1px solid #e2e8f0",
  borderRight: "1px solid #eef2f7",
  textTransform: "uppercase",
  letterSpacing: ".04em",
  whiteSpace: "nowrap",
  background: "#f8fafc",
};

const columnHeaderInnerStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
};

const actionThStyle: React.CSSProperties = {
  ...thStyle,
  width: 80,
  textAlign: "center",
};

const tdStyle: React.CSSProperties = {
  color: "#0f172a",
  fontWeight: 700,
  borderBottom: "1px solid #f1f5f9",
  borderRight: "1px solid #f1f5f9",
  verticalAlign: "middle",
  whiteSpace: "nowrap",
  background: "inherit",
};

const stickyHeaderFirstColumnStyle: React.CSSProperties = {
  left: 0,
  zIndex: 8,
  minWidth: 150,
  boxShadow: "8px 0 18px rgba(15,23,42,.05)",
};

const stickyFirstColumnStyle: React.CSSProperties = {
  position: "sticky",
  left: 0,
  zIndex: 4,
  minWidth: 150,
  boxShadow: "8px 0 18px rgba(15,23,42,.04)",
};

const emptyStyle: React.CSSProperties = {
  padding: 30,
  textAlign: "center",
  color: "#64748b",
  fontWeight: 800,
};

const eyeButtonStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  background: "#fff",
  color: "#334155",
  cursor: "pointer",
  display: "inline-grid",
  placeItems: "center",
};

const selectPillStyle: React.CSSProperties = {
  display: "inline-flex",
  padding: "6px 9px",
  borderRadius: 999,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#334155",
  fontSize: 11,
  fontWeight: 900,
};

const statusBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  minWidth: 88,
  padding: "7px 10px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 950,
};

const textareaCellStyle: React.CSSProperties = {
  display: "block",
  maxWidth: 260,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: "#0f172a",
};

const mutedTextStyle: React.CSSProperties = {
  color: "#94a3b8",
};

const miniIconTextStyle: React.CSSProperties = {
  width: 18,
  height: 18,
  borderRadius: 6,
  background: "#e0f2fe",
  color: "#0369a1",
  display: "inline-grid",
  placeItems: "center",
  fontSize: 9,
  fontWeight: 950,
};

const avatarStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 999,
  background: "#012942",
  color: "#fff",
  display: "grid",
  placeItems: "center",
  fontSize: 10.5,
  fontWeight: 950,
  flexShrink: 0,
};

const panelOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,.35)",
  backdropFilter: "blur(4px)",
  zIndex: 9999,
  display: "flex",
  justifyContent: "flex-end",
};

const columnsPanelStyle: React.CSSProperties = {
  width: "min(440px, 100%)",
  height: "100%",
  background: "#fff",
  boxShadow: "-25px 0 70px rgba(15,23,42,.24)",
  padding: 22,
  overflowY: "auto",
};

const columnsPanelHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  alignItems: "flex-start",
  paddingBottom: 18,
  borderBottom: "1px solid #e2e8f0",
  marginBottom: 14,
};

const panelKickerStyle: React.CSSProperties = {
  display: "inline-flex",
  marginBottom: 8,
  padding: "4px 8px",
  borderRadius: 999,
  background: "#eff6ff",
  color: "#2563eb",
  fontSize: 11,
  fontWeight: 950,
  textTransform: "uppercase",
};

const panelTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#0f172a",
  fontSize: 21,
  fontWeight: 950,
};

const panelSubtitleStyle: React.CSSProperties = {
  margin: "5px 0 0",
  color: "#64748b",
  fontSize: 13,
  lineHeight: 1.45,
};

const columnsPanelActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  marginBottom: 14,
};

const softActionButtonStyle: React.CSSProperties = {
  height: 36,
  padding: "0 13px",
  borderRadius: 12,
  border: "1px solid #ccc",
  background: "#012942",
  color:"#fff",
  fontSize: 12,
  fontWeight: 800,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  transition: "all .16s ease",
  backdropFilter: "blur(10px)",
};

const columnsListStyle: React.CSSProperties = {
  display: "grid",
  gap: 9,
};

const columnRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "12px",
  borderRadius: 14,
  border: "1px solid #e2e8f0",
  cursor: "pointer",
};

const columnTypeIconStyle: React.CSSProperties = {
  display: "inline-flex",
};

const columnLabelStyle: React.CSSProperties = {
  display: "block",
  color: "#0f172a",
  fontSize: 12.5,
  fontWeight: 900,
};

const columnKeyStyle: React.CSSProperties = {
  display: "block",
  color: "#94a3b8",
  fontSize: 11,
  marginTop: 2,
};

const columnTypeBadgeStyle: React.CSSProperties = {
  fontSize: 10,
  color: "#64748b",
  fontWeight: 900,
  textTransform: "uppercase",
};

const drawerOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,.35)",
  backdropFilter: "blur(4px)",
  zIndex: 9999,
  display: "flex",
  justifyContent: "flex-end",
};

const drawerStyle: React.CSSProperties = {
  width: "min(560px, 100%)",
  height: "100%",
  background: "#fff",
  boxShadow: "-25px 0 70px rgba(15,23,42,.24)",
  padding: 22,
  overflowY: "auto",
};

const drawerHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  alignItems: "flex-start",
  paddingBottom: 18,
  borderBottom: "1px solid #e2e8f0",
  marginBottom: 18,
};

const drawerKickerStyle: React.CSSProperties = {
  display: "inline-flex",
  marginBottom: 8,
  padding: "4px 8px",
  borderRadius: 999,
  background: "#eff6ff",
  color: "#2563eb",
  fontSize: 11,
  fontWeight: 950,
  textTransform: "uppercase",
};

const drawerTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#0f172a",
  fontSize: 21,
  fontWeight: 950,
};

const drawerSubtitleStyle: React.CSSProperties = {
  margin: "5px 0 0",
  color: "#64748b",
  fontSize: 13,
};

const drawerSectionStyle: React.CSSProperties = {
  marginBottom: 18,
  padding: 16,
  borderRadius: 18,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const drawerSectionTitleStyle: React.CSSProperties = {
  margin: 0,

  padding: "16px 20px",

  display: "flex",
  alignItems: "center",
  gap: 10,

  fontSize: 11.5,

  fontWeight: 950,

  letterSpacing: ".12em",

  textTransform: "uppercase",

  color: "#8b6b2e",

  background:
    "linear-gradient(90deg, rgba(187,159,88,.14), rgba(255,255,255,0))",

  borderBottom: "1px solid rgba(187,159,88,.12)",
};
const drawerFieldsGridStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
};

const drawerFieldStyle: React.CSSProperties = {
  display: "grid",
  gap: 5,
  paddingBottom: 10,
  borderBottom: "1px solid #e2e8f0",
};

const drawerFieldLabelStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: 11,
  fontWeight: 950,
  textTransform: "uppercase",
  letterSpacing: ".04em",
};

const drawerFieldValueStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: 13,
  fontWeight: 800,
};


const filterBarStyle: React.CSSProperties = {
  padding: "16px 18px",
  borderRadius: 20,
  background: "#fff",
  border: "1px solid #e2e8f0",
  boxShadow: "0 12px 30px rgba(15,23,42,.05)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
};

const openFiltersButtonStyle: React.CSSProperties = {
  height: 42,
  padding: "0 16px",
  borderRadius: 14,
  border: "1px solid rgba(37,99,235,.16)",
  background: "#eff6ff",
  color: "#0f172af5",
  fontSize: 12.5,
  fontWeight: 950,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 8,
  width:"50px",
  justifyContent:"center"
};

const filterModalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,.45)",
  backdropFilter: "blur(6px)",
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
};

const filterModalStyle: React.CSSProperties = {
  width: "min(760px, 100%)",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#fff",
  borderRadius: 26,
  padding: 24,
  boxShadow: "0 35px 90px rgba(15,23,42,.30)",
  border: "1px solid rgba(226,232,240,.9)",
};

const filterModalHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 18,
  alignItems: "flex-start",
  paddingBottom: 18,
  borderBottom: "1px solid #e2e8f0",
  marginBottom: 20,
};

const filterModalKickerStyle: React.CSSProperties = {
  display: "inline-flex",
  marginBottom: 8,
  padding: "4px 9px",
  borderRadius: 999,
  background: "#eff6ff",
  color: "#2563eb",
  fontSize: 11,
  fontWeight: 950,
  textTransform: "uppercase",
  letterSpacing: ".06em",
};

const filterModalTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#0f172a",
  fontSize: 23,
  fontWeight: 950,
  letterSpacing: "-.03em",
};

const filterModalSubtitleStyle: React.CSSProperties = {
  margin: "6px 0 0",
  color: "#64748b",
  fontSize: 13.5,
  lineHeight: 1.45,
};

const filterModalGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 14,
};

const fieldStyle: React.CSSProperties = {
  display: "grid",
  gap: 7,
};

const fieldLabelStyle: React.CSSProperties = {
  color: "#334155",
  fontSize: 12,
  fontWeight: 950,
};

const filterModalFooterStyle: React.CSSProperties = {
  marginTop: 22,
  paddingTop: 18,
  borderTop: "1px solid #e2e8f0",
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
};

const filterGhostButtonStyle: React.CSSProperties = {
  height: 42,
  padding: "0 15px",
  borderRadius: 14,
  border: "2px solid #ccc",
  background: "#fff",
  color: "#64748b",
  fontSize: 12.5,
  fontWeight: 900,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

const filterApplyButtonStyle: React.CSSProperties = {
  height: 42,
  padding: "0 17px",
  borderRadius: 14,
  border: "1px solid #012942",
  background: "#012942",
  color: "#fff",
  fontSize: 12.5,
  fontWeight: 950,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  boxShadow: "0 12px 24px rgba(1,41,66,.20)",
};

const drawerInputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 42,
  borderRadius: 13,
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#0f172a",
  padding: "0 12px",
  fontSize: 13,
  fontWeight: 700,
  outline: "none",
};

const drawerFooterStyle: React.CSSProperties = {
  position: "sticky",
  bottom: 0,
  marginTop: 18,
  paddingTop: 16,
  background: "#fff",
  borderTop: "1px solid #e2e8f0",
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
};

const drawerHeaderActionsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const drawerActionBarStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  gap: 10,
  marginTop: 18,
};

const drawerEditButtonStyle: React.CSSProperties = {
  width: "100%",
  height: 46,
  padding: "0 16px",
  borderRadius: 14,
  border: "1px solid rgba(37,99,235,.16)",
  background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
  color: "#2563eb",
  fontSize: 13,
  fontWeight: 950,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  boxShadow: "0 10px 24px rgba(37,99,235,.10)",
};

const drawerSaveButtonStyle: React.CSSProperties = {
  flex: 1,
  height: 46,
  padding: "0 16px",
  borderRadius: 14,
  border: "2px solid #012942",
  background: "linear-gradient(135deg, #012942, #064663)",
  color: "#fff",
  fontSize: 13,
  fontWeight: 950,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  boxShadow: "0 12px 26px rgba(1,41,66,.22)",
};

const drawerCancelButtonStyle: React.CSSProperties = {
  flex: 1,
  height: 46,
  padding: "0 16px",
  borderRadius: 14,
  border: "2px solid #ccc",
  background: "#fff",
  color: "#64748b",
  fontSize: 13,
  fontWeight: 900,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
};

const cardsViewStyle: React.CSSProperties = {
  padding: 18,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
  gap: 16,
  background: "#f8fafc",
};

const databaseCardItemStyle: React.CSSProperties = {
  borderRadius: 22,
  background: "#fff",
  border: "1px solid #e2e8f0",
  boxShadow: "0 14px 34px rgba(15,23,42,.06)",
  padding: 18,
  cursor: "pointer",
  transition: "all .18s ease",
};

const cardItemHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 14,
  alignItems: "flex-start",
  paddingBottom: 14,
  borderBottom: "1px solid #f1f5f9",
  marginBottom: 14,
};

const cardCompanyNameStyle: React.CSSProperties = {
  display: "block",
  color: "#0f172a",
  fontSize: 14.5,
  fontWeight: 950,
  lineHeight: 1.35,
};

const cardCompanyMetaStyle: React.CSSProperties = {
  marginTop: 4,
  color: "#64748b",
  fontSize: 12,
  fontWeight: 700,
};

const cardFieldsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
};

const cardFieldStyle: React.CSSProperties = {
  display: "grid",
  gap: 5,
  minWidth: 0,
};

const cardFieldLabelStyle: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: 10.5,
  fontWeight: 950,
  textTransform: "uppercase",
  letterSpacing: ".06em",
};

const cardFieldValueStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: 12.5,
  fontWeight: 800,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const cardOpenButtonStyle: React.CSSProperties = {
  marginTop: 16,
  width: "100%",
  height: 40,
  borderRadius: 14,
  border: "1px solid rgba(37,99,235,.14)",
  background: "#eff6ff",
  color: "#2563eb",
  fontSize: 12.5,
  fontWeight: 950,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

const emptyCardsStyle: React.CSSProperties = {
  gridColumn: "1 / -1",
  padding: 34,
  textAlign: "center",
  color: "#64748b",
  fontWeight: 800,
};