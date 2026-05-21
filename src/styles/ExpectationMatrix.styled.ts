import React from "react";

export const pageStyle: React.CSSProperties = {
  fontFamily: "Inter, system-ui, sans-serif",
  display: "grid",
  gap: 18,
};

export const heroStyle: React.CSSProperties = {
  padding: "clamp(18px, 4vw, 28px)",
  borderRadius: 18,

  background:
    "linear-gradient(135deg, #012942 0%, #012942 55%, #012942 100%)",

  color: "#fff",

  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",

  gap: 20,
  width: "100%",

  boxSizing: "border-box",

  boxShadow: "0 24px 60px rgba(1,41,66,.20)",
};

export const heroIconStyle: React.CSSProperties = {
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

export const heroBadgeStyle: React.CSSProperties = {
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

export const liveDotStyle: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: "#22c55e",
  boxShadow: "0 0 0 5px rgba(34,197,94,.14)",
};

export const heroTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 29,
  fontWeight: 950,
  letterSpacing: "-.04em",
};

export const heroTextStyle: React.CSSProperties = {
  margin: "7px 0 0",
  color: "rgba(255,255,255,.72)",
  fontSize: 13.5,
  maxWidth: 620,
};

export const refreshButtonStyle: React.CSSProperties = {
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

export const statsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 16,
  alignItems: "stretch",
  width: "100%",
};

export const statCardStyle: React.CSSProperties = {
  padding: 16,
  borderRadius: 20,
  background: "#fff",
  border: "1px solid #e2e8f0",
  boxShadow: "0 12px 30px rgba(15,23,42,.05)",
  display: "flex",
  alignItems: "center",
  gap: 12,
};

export const statIconStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 14,
  background: "#eff6ff",
  color: "#2563eb",
  display: "grid",
  placeItems: "center",
};

export const statValueStyle: React.CSSProperties = {
  display: "block",
  color: "#0f172a",
  fontSize: 21,
  fontWeight: 950,
};

export const statLabelStyle: React.CSSProperties = {
  display: "block",
  marginTop: 2,
  color: "#64748b",
  fontSize: 12,
  fontWeight: 800,
};

export const filterPanelStyle: React.CSSProperties = {
  width: "100%",
  padding: "clamp(14px, 3vw, 18px)",
  borderRadius: "clamp(16px, 3vw, 22px)",

  background: "#fff",
  border: "1px solid #e2e8f0",

  boxSizing: "border-box",

  boxShadow: "0 12px 30px rgba(15,23,42,.05)",
};

export const filterHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 15,
};

export const filterTitleStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: 15,
  fontWeight: 950,
};

export const filterSubtitleStyle: React.CSSProperties = {
  margin: "4px 0 0",
  color: "#64748b",
  fontSize: 12.5,
  fontWeight: 600,
};

export const filtersGridStyle: React.CSSProperties = {
  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",

  gap: 10,
  width: "100%",
  alignItems: "end",
};

export const inputStyle: React.CSSProperties = {
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

export const primaryButtonStyle: React.CSSProperties = {
  height: 44,
  padding: "0 18px",
  borderRadius: 14,
  border: "1px solid #012942",
  background: "#012942",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};

export const clearButtonStyle: React.CSSProperties = {
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

export const errorStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 14,
  background: "#fef2f2",
  border: "1px solid #fecaca",
  color: "#991b1b",
  fontSize: 13,
  fontWeight: 700,
};

export const databaseCardStyle: React.CSSProperties = {
  width: "100%",

  borderRadius: "clamp(14px, 3vw, 20px) clamp(14px, 3vw, 20px) 0 0",

  background: "#fff",
  border: "1px solid #e2e8f0",

  overflow: "hidden",
  boxSizing: "border-box",

  boxShadow: "0 18px 45px rgba(15,23,42,.07)",
};

export const databaseHeaderStyle: React.CSSProperties = {
  padding: "clamp(14px, 3vw, 18px)",

  borderBottom: "1px solid #e2e8f0",

  display: "flex",
  flexWrap: "wrap",

  justifyContent: "space-between",
  alignItems: "center",

  gap: 12,
  width: "100%",

  boxSizing: "border-box",

  background: "linear-gradient(180deg, #fff 0%, #f8fafc 100%)",
};

export const databaseMiniIconStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 10,
  display: "grid",
  placeItems: "center",
  background: "#f8fafc",
  color: "#012942",
  border: "1px solid #ccc",
};

export const databaseTitleStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: 15,
  fontWeight: 950,
};

export const databaseSubtitleStyle: React.CSSProperties = {
  margin: "3px 0 0",
  color: "#64748b",
  fontSize: 12.5,
  fontWeight: 600,
};

export const viewButtonStyle: React.CSSProperties = {
  height: 40,
  padding: "0 14px",
  borderRadius: 14,
  border: "2px solid #ccc",
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


export const columnsButtonStyle: React.CSSProperties = {
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


export const tableScrollStyle: React.CSSProperties = {
  overflow: "auto",
  maxHeight: "68vh",
  position: "relative",
};

export const thStyle: React.CSSProperties = {
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

export const columnHeaderInnerStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
};

export const actionThStyle: React.CSSProperties = {
  ...thStyle,
  width: 80,
  textAlign: "center",
};

export const tdStyle: React.CSSProperties = {
  color: "#0f172a",
  fontWeight: 700,
  borderBottom: "1px solid #f1f5f9",
  borderRight: "1px solid #f1f5f9",
  verticalAlign: "middle",
  whiteSpace: "nowrap",
  background: "inherit",
};

export const stickyHeaderFirstColumnStyle: React.CSSProperties = {
  left: 0,
  zIndex: 8,
  minWidth: 150,
  boxShadow: "8px 0 18px rgba(15,23,42,.05)",
};

export const stickyFirstColumnStyle: React.CSSProperties = {
  position: "sticky",
  left: 0,
  zIndex: 4,
  minWidth: 150,
  boxShadow: "8px 0 18px rgba(15,23,42,.04)",
};

export const emptyStyle: React.CSSProperties = {
  padding: 30,
  textAlign: "center",
  color: "#64748b",
  fontWeight: 800,
};

export const eyeButtonStyle: React.CSSProperties = {
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

export const selectPillStyle: React.CSSProperties = {
  display: "inline-flex",
  padding: "6px 9px",
  borderRadius: 999,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#334155",
  fontSize: 11,
  fontWeight: 900,
};

export const statusBadgeStyle: React.CSSProperties = {
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

export const textareaCellStyle: React.CSSProperties = {
  display: "block",
  maxWidth: 260,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: "#0f172a",
};

export const mutedTextStyle: React.CSSProperties = {
  color: "#94a3b8",
};

export const miniIconTextStyle: React.CSSProperties = {
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

export const avatarStyle: React.CSSProperties = {
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

export const panelOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,.35)",
  backdropFilter: "blur(4px)",
  zIndex: 9999,
  display: "flex",
  justifyContent: "flex-end",
};

export const columnsPanelStyle: React.CSSProperties = {
  width: "min(440px, 100%)",
  height: "100%",
  background: "#fff",
  boxShadow: "-25px 0 70px rgba(15,23,42,.24)",
  padding: 22,
  overflowY: "auto",
};

export const columnsPanelHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  alignItems: "flex-start",
  paddingBottom: 18,
  borderBottom: "1px solid #e2e8f0",
  marginBottom: 14,
};

export const panelKickerStyle: React.CSSProperties = {
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

export const panelTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#0f172a",
  fontSize: 21,
  fontWeight: 950,
};

export const panelSubtitleStyle: React.CSSProperties = {
  margin: "5px 0 0",
  color: "#64748b",
  fontSize: 13,
  lineHeight: 1.45,
};

export const columnsPanelActionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  marginBottom: 14,
};

export const softActionButtonStyle: React.CSSProperties = {
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

export const columnsListStyle: React.CSSProperties = {
  display: "grid",
  gap: 9,
};

export const columnRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "12px",
  borderRadius: 14,
  border: "1px solid #e2e8f0",
  cursor: "pointer",
};

export const columnTypeIconStyle: React.CSSProperties = {
  display: "inline-flex",
};

export const columnLabelStyle: React.CSSProperties = {
  display: "block",
  color: "#0f172a",
  fontSize: 12.5,
  fontWeight: 900,
};

export const columnKeyStyle: React.CSSProperties = {
  display: "block",
  color: "#94a3b8",
  fontSize: 11,
  marginTop: 2,
};

export const columnTypeBadgeStyle: React.CSSProperties = {
  fontSize: 10,
  color: "#64748b",
  fontWeight: 900,
  textTransform: "uppercase",
};

export const drawerOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,.35)",
  backdropFilter: "blur(4px)",
  zIndex: 9999,
  display: "flex",
  justifyContent: "flex-end",
};

export const drawerStyle: React.CSSProperties = {
  width: "min(560px, 100%)",
  height: "100%",
  background: "#fff",
  boxShadow: "-25px 0 70px rgba(15,23,42,.24)",
  padding: 22,
  overflowY: "auto",
};

export const drawerHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  alignItems: "flex-start",
  paddingBottom: 18,
  borderBottom: "1px solid #e2e8f0",
  marginBottom: 18,
};

export const drawerKickerStyle: React.CSSProperties = {
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

export const drawerTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#0f172a",
  fontSize: 21,
  fontWeight: 950,
};

export const drawerSubtitleStyle: React.CSSProperties = {
  margin: "5px 0 0",
  color: "#64748b",
  fontSize: 13,
};

export const drawerSectionStyle: React.CSSProperties = {
  marginBottom: 18,
  padding: 16,
  borderRadius: 18,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

export const drawerSectionTitleStyle: React.CSSProperties = {
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
export const drawerFieldsGridStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
};

export const drawerFieldStyle: React.CSSProperties = {
  display: "grid",
  gap: 5,
  paddingBottom: 10,
  borderBottom: "1px solid #e2e8f0",
};

export const drawerFieldLabelStyle: React.CSSProperties = {
  color: "#64748b",
  fontSize: 11,
  fontWeight: 950,
  textTransform: "uppercase",
  letterSpacing: ".04em",
};

export const drawerFieldValueStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: 13,
  fontWeight: 800,
};


export const filterBarStyle: React.CSSProperties = {
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

export const openFiltersButtonStyle: React.CSSProperties = {
  minHeight: 42,

  width: "100%",
  maxWidth: 100,

  padding: "0 clamp(10px, 2vw, 16px)",

  borderRadius: "clamp(12px, 3vw, 14px)",

  border: "1px solid rgba(37,99,235,.16)",
  background: "#eff6ff",
  color: "#0f172af5",

  fontSize: "clamp(12px, 2vw, 12.5px)",
  fontWeight: 950,

  cursor: "pointer",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  gap: 8,

  boxSizing: "border-box",

  transition: "all .18s ease",
};

export const filterModalOverlayStyle: React.CSSProperties = {
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

export const filterModalStyle: React.CSSProperties = {
  width: "min(760px, 100%)",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#fff",
  borderRadius: 26,
  padding: 24,
  boxShadow: "0 35px 90px rgba(15,23,42,.30)",
  border: "1px solid rgba(226,232,240,.9)",
};

export const filterModalHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 18,
  alignItems: "flex-start",
  paddingBottom: 18,
  borderBottom: "1px solid #e2e8f0",
  marginBottom: 20,
};

export const filterModalKickerStyle: React.CSSProperties = {
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

export const filterModalTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#0f172a",
  fontSize: 23,
  fontWeight: 950,
  letterSpacing: "-.03em",
};

export const filterModalSubtitleStyle: React.CSSProperties = {
  margin: "6px 0 0",
  color: "#64748b",
  fontSize: 13.5,
  lineHeight: 1.45,
};

export const filterModalGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 14,
};

export const fieldStyle: React.CSSProperties = {
  display: "grid",
  gap: 7,
};

export const fieldLabelStyle: React.CSSProperties = {
  color: "#334155",
  fontSize: 12,
  fontWeight: 950,
};

export const filterModalFooterStyle: React.CSSProperties = {
  marginTop: 22,
  paddingTop: 18,
  borderTop: "1px solid #e2e8f0",
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
};

export const filterGhostButtonStyle: React.CSSProperties = {
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

export const filterApplyButtonStyle: React.CSSProperties = {
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

export const drawerInputStyle: React.CSSProperties = {
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

export const drawerFooterStyle: React.CSSProperties = {
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

export const drawerHeaderActionsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

export const drawerActionBarStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  gap: 10,
  marginTop: 18,
};

export const drawerEditButtonStyle: React.CSSProperties = {
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

export const drawerSaveButtonStyle: React.CSSProperties = {
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

export const drawerCancelButtonStyle: React.CSSProperties = {
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

export const cardsViewStyle: React.CSSProperties = {
  padding: "clamp(12px, 3vw, 18px)",

  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",

  gap: "clamp(12px, 2vw, 16px)",

  width: "100%",
  boxSizing: "border-box",

  background: "#f8fafc",
};

export const databaseCardItemStyle: React.CSSProperties = {
  borderRadius: 22,
  background: "#fff",
  border: "1px solid #ccc",
  boxShadow: "0 14px 34px rgba(15,23,42,.06)",
  padding: 18,
  cursor: "pointer",
  transition: "all .18s ease",
};

export const cardItemHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 14,
  alignItems: "flex-start",
  paddingBottom: 14,
  borderBottom: "1px solid #f1f5f9",
  marginBottom: 14,
};

export const cardCompanyNameStyle: React.CSSProperties = {
  display: "block",
  color: "#0f172a",
  fontSize: 14.5,
  fontWeight: 950,
  lineHeight: 1.35,
};

export const cardCompanyMetaStyle: React.CSSProperties = {
  marginTop: 4,
  color: "#64748b",
  fontSize: 12,
  fontWeight: 700,
};

export const cardFieldsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
};

export const cardFieldStyle: React.CSSProperties = {
  display: "grid",
  gap: 5,
  minWidth: 0,
};

export const cardFieldLabelStyle: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: 10.5,
  fontWeight: 950,
  textTransform: "uppercase",
  letterSpacing: ".06em",
};

export const cardFieldValueStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: 12.5,
  fontWeight: 800,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
};

export const cardOpenButtonStyle: React.CSSProperties = {
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

export const emptyCardsStyle: React.CSSProperties = {
  gridColumn: "1 / -1",
  padding: 34,
  textAlign: "center",
  color: "#64748b",
  fontWeight: 800,
};