import { RefreshCw } from "lucide-react";
import { Field } from "./Field";

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 46,
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#0f172a",
  padding: "0 13px",
  fontSize: 14,
  outline: "none",
};

export function DashboardFilters({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  loading,
  onRefresh,
}: any) {
  return (
    <div
      className="dashboard-filters"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr auto",
        gap: 12,
        marginBottom: 22,
        alignItems: "end",
      }}
    >
      <Field label="Data inicial">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={inputStyle}
        />
      </Field>

      <Field label="Data final">
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={inputStyle}
        />
      </Field>

      <button
        onClick={onRefresh}
        disabled={loading}
        style={{
          height: 46,
          padding: "0 18px",
          borderRadius: 14,
          border: "1px solid #012942",
          background: "#012942",
          color: "#fff",
          fontSize: 14,
          fontWeight: 900,
          cursor: loading ? "not-allowed" : "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: "300px",
        }}
      >
        <RefreshCw size={18} />
        Atualizar
      </button>
    </div>
  );
}