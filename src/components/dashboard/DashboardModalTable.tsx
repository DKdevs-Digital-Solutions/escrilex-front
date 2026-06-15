import { CalendarDays } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 760,
};

const thStyle: React.CSSProperties = {
  padding: "12px 14px",
  textAlign: "center",
  color: "#475569",
  fontSize: 12,
  fontWeight: 900,
  borderBottom: "1px solid #e2e8f0",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 14px",
  color: "#0f172a",
  fontWeight: 700,
  borderBottom: "1px solid #f1f5f9",
  textAlign: "center",
  fontSize: 14,

};

export function DashboardModalTable({
  modalChart,
  selectedDrilldownLabel,
  selectedDrilldownType,
  drilldownLoading,
  data,
  isResponsibleModal,
  isExitModal,
  getModalRows,
  getExtraColumnByDrilldown,
  getStatusStyle,
  getDiasPermanencia,
}: any) {

    const PAGE_SIZE = 20;

    const [page, setPage] = useState(1);

    const modalRows = getModalRows();

    const totalPages = Math.max(1, Math.ceil(modalRows.length / PAGE_SIZE));

    useEffect(() => {
    setPage(1);
    }, [
    modalChart,
    selectedDrilldownLabel,
    isResponsibleModal,
    isExitModal,
    modalRows.length,
    ]);

    const paginatedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return modalRows.slice(start, start + PAGE_SIZE);
    }, [modalRows, page]);

    const showPagination =
    modalChart !== "alterations" &&
    modalChart !== "responsibleChanges" &&
    !drilldownLoading &&
    modalRows.length > PAGE_SIZE;




  return (
    <>
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: !selectedDrilldownLabel ? 15 : 10,
        top: !selectedDrilldownLabel ? 0 : 10,
        overflowX: "auto",
        overflowY: "hidden",
        WebkitOverflowScrolling: "touch",
        position: "relative",
        marginTop:
          modalChart === "alterations" || modalChart === "responsibleChanges"
            ? 22
            : 0,
      }}
    >
      {modalChart === "alterations" ? (
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={thStyle}>Tipo de alteração</th>
              <th style={thStyle}>Total</th>
            </tr>
          </thead>

          <tbody>
            {(data?.charts?.alterations ?? []).map((item: any) => (
              <tr key={item.label}>
                <td style={tdStyle}>
                  <strong>{item.label || "--"}</strong>
                </td>

                <td style={tdStyle}>
                  {item.total?.toLocaleString("pt-BR") ?? 0}
                </td>
              </tr>
            ))}

            {(data?.charts?.alterations ?? []).length === 0 && (
              <tr>
                <td colSpan={2} style={emptyStyle}>
                  Nenhuma alteração encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : modalChart === "responsibleChanges" ? (
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={thStyle}>Departamento</th>
              <th style={thStyle}>Trocas</th>
              <th style={thStyle}>Empresas</th>
            </tr>
          </thead>

          <tbody>
            {(data?.charts?.responsibleChanges?.byDepartment ?? []).map(
              (item: any) => (
                <tr key={item.label}>
                  <td style={tdStyle}>
                    <strong>{item.label || "--"}</strong>
                  </td>

                  <td style={tdStyle}>
                    {item.total?.toLocaleString("pt-BR") ?? 0}
                  </td>

                  <td style={tdStyle}>
                    {item.companiesTotal?.toLocaleString("pt-BR") ?? 0}
                  </td>
                </tr>
              )
            )}

            {(data?.charts?.responsibleChanges?.byDepartment ?? []).length ===
              0 && (
              <tr>
                <td colSpan={3} style={emptyStyle}>
                  Nenhuma troca de responsável encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : drilldownLoading ? (
        <div
          style={{
            minHeight: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              border: "3px solid #dbeafe",
              borderTopColor: "#2563eb",
              animation: "spin 0.9s linear infinite",
            }}
          />

          <div
            style={{
              color: "#64748b",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            Carregando detalhamento...
          </div>
        </div>
      ) : (
        <table style={tableStyle}>
          <thead>
            {isResponsibleModal ? (
              <tr style={{ background: "#f8fafc" }}>
                <th style={thStyle}>Empresa</th>
                <th style={thStyle}>CNPJ</th>
                <th style={thStyle}>Departamento</th>
                <th style={thStyle}>Responsável</th>
                <th style={thStyle}>Data</th>
              </tr>
            ) : (
              (() => {
                const extraColumn = getExtraColumnByDrilldown();

                return (
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={thStyle}>Código</th>
                    <th style={thStyle}>Empresa</th>
                    <th style={thStyle}>CNPJ</th>

                    {isExitModal ? (
                      <>
                        <th style={thStyle}>Permanência</th>
                        <th style={thStyle}>Motivo saída</th>
                      </>
                    ) : (
                      <th style={thStyle}>Grupo</th>
                    )}

                    <th style={thStyle}>Status</th>

                    {extraColumn && (
                      <th style={thStyle}>{extraColumn.label}</th>
                    )}
                  </tr>
                );
              })()
            )}
          </thead>

          <tbody>
            {paginatedRows?.map((item: any) => {
              if (isResponsibleModal) {
                return (
                  <tr key={`${item.id}-${item.date}`}>
                    <td style={tdStyle}>
                      <strong>{item.razaoSocial || "--"}</strong>

                      {item.nomeFantasia && (
                        <div
                          style={{
                            fontSize: 11,
                            color: "#64748b",
                            marginTop: 3,
                          }}
                        >
                          {item.nomeFantasia} 
                        </div>
                      )}
                    </td>

                    <td style={tdStyle}>
                      <span style={{ fontFamily: "monospace", fontSize: 12 }}>
                        {item.cnpj || "--"}
                      </span>
                    </td>

                    <td style={tdStyle}>{item.department || "--"}</td>

                    <td style={tdStyle}>
                      <strong>{item.newResponsible?.name || "--"}</strong>

                      {item.newResponsible?.email && (
                        <div
                          style={{
                            fontSize: 11,
                            color: "#64748b",
                            marginTop: 3,
                          }}
                        >
                          {item.newResponsible.email}
                        </div>
                      )}
                    </td>

                    <td style={tdStyle}>
                      {item.date
                        ? new Date(item.date).toLocaleDateString("pt-BR")
                        : "--"}
                    </td>
                  </tr>
                );
              }

              const extraColumn = getExtraColumnByDrilldown();

              return (
                <tr key={item.id}>
                  <td style={tdStyle}>{item?.cod}</td>

                  <td style={tdStyle}>
                    <strong title={item.razaoSocial}>
                      {item.razaoSocial || "--"}
                    </strong>

                    {item.nomeFantasia && (
                      <div
                        style={{
                          color: "#64748b",
                          marginTop: 3,
                          fontSize: 11,
                        }}
                      >
                        {item.nomeFantasia}
                      </div>
                    )}
                  </td>

                  <td style={tdStyle}>
                    <span style={{ fontFamily: "monospace", fontSize: 13 }}>
                      {item.cnpj || "--"}
                    </span>
                  </td>

                  {isExitModal ? (
                    <>
                      <td style={tdStyle}>
                        {(() => {
                          const dias = getDiasPermanencia(item);
                          const dataSaidaReal =
                            item.inactivatedAt || item.dataSaida;

                          return (
                            <>
                              <strong
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 6,
                                  padding: "6px 10px",
                                  borderRadius: 999,
                                  background: "rgba(37,99,235,.08)",
                                  border: "1px solid rgba(37,99,235,.16)",
                                  color: "#2563eb",
                                  fontSize: 12,
                                  fontWeight: 900,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <CalendarDays size={13} strokeWidth={2.5} />
                                {dias !== null ? `${dias} dias` : "--"}
                              </strong>

                              <div
                                style={{
                                  marginTop: 6,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                  fontSize: 11,
                                  fontWeight: 800,
                                  color: "#64748b",
                                }}
                              >
                                <span
                                  style={{
                                    padding: "3px 7px",
                                    borderRadius: 999,
                                    background: "rgba(34,197,94,.10)",
                                    color: "#16a34a",
                                  }}
                                >
                                  {item.dataEntrada
                                    ? new Date(
                                        item.dataEntrada
                                      ).toLocaleDateString("pt-BR")
                                    : "--"}
                                </span>

                                <span
                                  style={{
                                    padding: "3px 7px",
                                    borderRadius: 999,
                                    background: "rgba(239,68,68,.10)",
                                    color: "#dc2626",
                                  }}
                                >
                                  {dataSaidaReal
                                    ? new Date(
                                        dataSaidaReal
                                      ).toLocaleDateString("pt-BR")
                                    : "--"}
                                </span>
                              </div>
                            </>
                          );
                        })()}
                      </td>

                      <td style={tdStyle}>
                        <span
                          title={item.motivoSaida}
                          style={{
                            display: "block",
                            maxWidth: 240,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: 12.5,
                          }}
                        >
                          {item.motivoSaida || "--"}
                        </span>
                      </td>
                    </>
                  ) : (
                    <td style={tdStyle}>
                      {item.grupo ||
                        item.department ||
                        item.newResponsible?.name ||
                        "--"}
                    </td>
                  )}

                  <td style={tdStyle}>
                    {(() => {
                      const statusStyle = getStatusStyle(item.situacao);

                      return (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "7px 8px",
                            borderRadius: 999,
                            background: statusStyle.bg,
                            border: `1px solid ${statusStyle.border}`,
                            color: statusStyle.color,
                            fontWeight: 900,
                            fontSize: 11,
                            width: "110px",
                            justifyContent: "center",
                          }}
                        >
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: 999,
                              background: statusStyle.dot,
                            }}
                          />

                          {statusStyle.label}
                        </span>
                      );
                    })()}
                  </td>

                  {extraColumn && (
                    <td style={tdStyle}>
                      <span
                        title={item[extraColumn.key]}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "7px 10px",
                          borderRadius: 999,
                          background: "rgba(37,99,235,.08)",
                          border: "1px solid rgba(37,99,235,.14)",
                          color: "#2563eb",
                          fontSize: 11.5,
                          fontWeight: 900,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item[extraColumn.key] || "--"}
                      </span>
                    </td>
                  )}
                </tr>
              );
            })}

            {modalRows?.length === 0 && (
              <tr>
                <td colSpan={6} style={emptyStyle}>
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>

    {showPagination && (
  <div
    style={{
      marginTop: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      flexWrap: "wrap",
    }}
  >
    <span
      style={{
        color: "#64748b",
        fontSize: 12,
        fontWeight: 800,
      }}
    >
      Mostrando {(page - 1) * PAGE_SIZE + 1}-
      {Math.min(page * PAGE_SIZE, modalRows.length)} de {modalRows.length}
    </span>

    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <button
        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
        disabled={page === 1}
        style={paginationButtonStyle(page === 1)}
      >
        Anterior
      </button>

      <span
        style={{
          padding: "8px 10px",
          borderRadius: 999,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          color: "#0f172a",
          fontSize: 12,
          fontWeight: 900,
        }}
      >
        {page} / {totalPages}
      </span>

      <button
        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
        disabled={page === totalPages}
        style={paginationButtonStyle(page === totalPages)}
      >
        Próxima
      </button>
    </div>
  </div>
)}

  </>
  );
}

const emptyStyle: React.CSSProperties = {
  padding: 24,
  textAlign: "center",
  color: "#64748b",
  fontWeight: 700,
};

function paginationButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    border: "1px solid #e2e8f0",
    background: disabled ? "#f8fafc" : "#012942",
    color: disabled ? "#94a3b8" : "#fff",
    borderRadius: 12,
    padding: "9px 13px",
    fontSize: 12,
    fontWeight: 900,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}