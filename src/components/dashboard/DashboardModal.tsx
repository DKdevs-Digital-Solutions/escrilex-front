import { CalendarDays, X } from "lucide-react";
import { ModalOption } from "./ModalOption";
import { DashboardModalTable } from "./DashboardModalTable";

export function DashboardModal(props: any) {
  const {
    modalChart,
    modalTab,
    selectedDrilldownLabel,
    selectedChartType,
    chartTypeLabels,
    isMobile,
    periodLabel,
    closeModal,
    openModal,
    data,
  } = props;

  return (
    <div
      onClick={closeModal}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,.55)",
        backdropFilter: "blur(6px)",
        zIndex: 9999,
        display: "flex",
        padding: isMobile ? 10 : 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: isMobile ? "95%" : 900,
          maxHeight: "90vh",
          overflow: "auto",
          borderRadius: "5px",
          background: "#fff",
          padding: isMobile ? 16 : 24,
          boxShadow: "0 30px 80px rgba(15,23,42,.35)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: isMobile ? 18 : 22,
                lineHeight: 1.2,
                fontWeight: 950,
                color: "#0f172a",
                letterSpacing: "-0.02em",
              }}
            >
              {modalChart === "alterations"
                ? "Alterações no período"
                : modalChart === "responsibleChanges"
                ? "Trocas de responsável"
                : modalChart === "clientes" && selectedDrilldownLabel
                ? `${chartTypeLabels[selectedChartType]}: ${selectedDrilldownLabel}`
                : modalChart === "movimento"
                ? "Movimento de clientes"
                : "Entradas x Saídas"}
            </h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#64748b",
                fontSize: 13,
                lineHeight: 1.5,
                fontWeight: 500,
                maxWidth: 520,
              }}
            >
              {modalChart === "alterations"
                ? "Visualize os tipos de alterações realizadas nas empresas durante o período selecionado."
                : modalChart === "responsibleChanges"
                ? "Acompanhe as movimentações de responsáveis por departamento e quantidade de empresas impactadas."
                : modalChart === "movimento"
                ? "Consulte empresas ativas, inativas e movimentações registradas no período."
                : "Detalhamento completo das entradas e saídas registradas no dashboard."}
            </p>

            <div
              style={{
                marginTop: 10,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 999,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                color: "#475569",
                fontSize: 11,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: ".04em",
              }}
            >
              <CalendarDays size={13} />
              {periodLabel}
            </div>
          </div>

          <button
            onClick={closeModal}
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
              cursor: "pointer",
              fontWeight: 900,
            }}
          >
            <X size={20} style={{ top: "2px", position: "relative" }} />
          </button>
        </div>

        {modalChart !== "alterations" &&
          modalChart !== "responsibleChanges" &&
          !selectedDrilldownLabel && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(2, minmax(0, 1fr))",
                gap: 12,
                marginTop: 22,
                marginBottom: 18,
              }}
            >
              {modalChart === "movimento" ? (
                <>
                  <ModalOption
                    active={modalTab === "ativos"}
                    label="Ativos"
                    value={data?.cards.totalActive ?? 0}
                    color="#059669"
                    onClick={() => openModal("movimento", "ativos")}
                  />

                  <ModalOption
                    active={modalTab === "Encerrada"}
                    label="Encerrados"
                    value={data?.cards.totalInactive ?? 0}
                    color="#ea580c"
                    onClick={() => openModal("movimento", "Encerrada")}
                  />
                </>
              ) : (
                <>
                  <ModalOption
                    active={modalTab === "entradas"}
                    label="Entradas"
                    value={data?.cards?.newClients ?? 0}
                    color="#2563eb"
                    onClick={() => openModal("clientes", "entradas")}
                  />

                  <ModalOption
                    active={modalTab === "saidas"}
                    label="Saídas"
                    value={data?.cards?.inactiveClients ?? 0}
                    color="#dc2626"
                    onClick={() => openModal("clientes", "saidas")}
                  />
                </>
              )}
            </div>
          )}

        <DashboardModalTable {...props} />
      </div>
    </div>
  );
}