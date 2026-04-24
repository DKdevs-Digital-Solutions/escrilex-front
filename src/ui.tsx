import React, { CSSProperties } from "react";
import { Loader2 } from "lucide-react";

// ── Color system ──────────────────────────────────────────────────────────────
export const clr = {
  primary:     "#2563eb",
  primaryDark: "#1d4ed8",
  primaryBg:   "rgba(37,99,235,0.07)",
  danger:      "#ef4444",
  dangerBg:    "#fef2f2",
  dangerBorder:"#fecaca",
  text:        "#0f172a",
  textMuted:   "#64748b",
  border:      "#e2e8f0",
  borderHover: "#cbd5e1",
  bg:          "#fff",
  bgSubtle:    "#f8fafc",
};

// ── Loading ───────────────────────────────────────────────────────────────────
export function Loading({ message = "Carregando..." }: { message?: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "64px 24px", gap: 14, color: clr.textMuted,
    }}>
      <style>{`@keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }`}</style>
      <Loader2 size={28} color={clr.primary} style={{ animation: "spin 0.9s linear infinite" }} />
      <span style={{ fontSize: 13.5, fontWeight: 500 }}>{message}</span>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
export function Skeleton({ width = "100%", height = 16, borderRadius = 6 }: {
  width?: number | string; height?: number; borderRadius?: number;
}) {
  return (
    <div style={{
      width, height, borderRadius,
      background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
    }}>
      <style>{`@keyframes shimmer { from { background-position:200% 0 } to { background-position:-200% 0 } }`}</style>
    </div>
  );
}

// ── Button ──────────────────────────────────────────────────────────────────
type BtnVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: "sm" | "md";
}

const BTN_BASE: Record<BtnVariant, CSSProperties> = {
  primary:   { background: clr.primary,   color: "#fff",        border: `1px solid ${clr.primary}`,  boxShadow: "0 2px 8px rgba(37,99,235,0.22)" },
  secondary: { background: "#fff",          color: "#374151",     border: `1px solid ${clr.border}`,   boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  outline:   { background: "transparent",   color: clr.primary,   border: `1px solid ${clr.primary}`,  boxShadow: "none" },
  danger:    { background: "#fff",           color: "#dc2626",     border: "1px solid #fca5a5",          boxShadow: "none" },
  ghost:     { background: "transparent",    color: clr.textMuted, border: "1px solid transparent",     boxShadow: "none" },
};
const BTN_HOVER: Record<BtnVariant, Partial<CSSProperties>> = {
  primary:   { background: clr.primaryDark, boxShadow: "0 4px 14px rgba(37,99,235,0.32)" },
  secondary: { background: clr.bgSubtle, borderColor: clr.borderHover },
  outline:   { background: clr.primaryBg },
  danger:    { background: clr.dangerBg },
  ghost:     { background: "#f1f5f9", color: "#374151" },
};

export function Btn({ variant = "primary", size = "md", style, children, disabled, ...rest }: BtnProps) {
  const pad  = size === "sm" ? "5px 11px"  : "8px 16px";
  const fs   = size === "sm" ? 12.5         : 13.5;
  const base = BTN_BASE[variant];
  const hover = BTN_HOVER[variant];
  return (
    <button
      {...rest}
      disabled={disabled}
      style={{
        ...base, padding: pad, fontSize: fs, fontWeight: 600,
        borderRadius: 9, cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "all 0.15s ease",
        display: "inline-flex", alignItems: "center", gap: 6,
        whiteSpace: "nowrap", letterSpacing: "-0.01em",
        fontFamily: "inherit",
        ...style,
      }}
      onMouseOver={e => { if (disabled) return; Object.assign(e.currentTarget.style, hover); }}
      onMouseOut={e => { Object.assign(e.currentTarget.style, base); if (style) Object.assign(e.currentTarget.style, style); }}
    >
      {children}
    </button>
  );
}

// ── PrimaryBtn helper ─────────────────────────────────────────────────────────
export function PrimaryBtn({ children, onClick, disabled, title, style }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; title?: string; style?: CSSProperties;
}) {
  return (
    <button
      onClick={onClick} disabled={disabled} title={title}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "8px 16px", fontSize: 13.5, fontWeight: 600,
        borderRadius: 9, border: "none", background: clr.primary, color: "#fff",
        cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit",
        transition: "background 0.15s", boxShadow: "0 2px 8px rgba(37,99,235,0.22)",
        opacity: disabled ? 0.45 : 1, ...style,
      }}
      onMouseOver={e => { if (!disabled) e.currentTarget.style.background = clr.primaryDark; }}
      onMouseOut={e => { e.currentTarget.style.background = clr.primary; }}
    >
      {children}
    </button>
  );
}

// ── IconBtn helper ────────────────────────────────────────────────────────────
export function IconBtn({ icon, title, onClick, variant = "secondary" }: {
  icon: React.ReactNode; title: string; onClick: () => void; variant?: "secondary" | "danger" | "success" | "ghost";
}) {
  const base = {
    secondary: { bg: "#fff",      color: "#374151", border: "#e2e8f0", hover: "#f8fafc", hoverBorder: "#cbd5e1" },
    danger:    { bg: "#fff",      color: "#dc2626", border: "#fca5a5", hover: "#fef2f2", hoverBorder: "#fca5a5" },
    success:   { bg: "#fff",      color: "#16a34a", border: "#bbf7d0", hover: "#f0fdf4", hoverBorder: "#bbf7d0" },
    ghost:     { bg: "transparent", color: "#94a3b8", border: "transparent", hover: "#f1f5f9", hoverBorder: "#e2e8f0" },
  }[variant];
  return (
    <button
      title={title} onClick={onClick}
      style={{
        width: 40, height: 47, borderRadius: 8, border: `1.5px solid ${base.border}`,
        background: base.bg, color: base.color, cursor: "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.12s, border-color 0.12s", fontFamily: "inherit",
      }}
      onMouseOver={e => { e.currentTarget.style.background = base.hover; e.currentTarget.style.borderColor = base.hoverBorder; }}
      onMouseOut={e => { e.currentTarget.style.background = base.bg; e.currentTarget.style.borderColor = base.border; }}
    >
      {icon}
    </button>
  );
}

// ── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; hint?: string;
}
export function Input({ label, hint, style, ...rest }: InputProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && <label style={{ fontSize: 11.5, fontWeight: 700, color: "#475569", letterSpacing: "0.07em", textTransform: "uppercase" }}>{label}</label>}
      <input
        {...rest}
        style={{
          padding: "9px 12px", fontSize: 13.5, borderRadius: 9,
          border: `1.5px solid ${clr.border}`, outline: "none",
          color: clr.text, background: clr.bgSubtle,
          transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
          width: "100%", boxSizing: "border-box", ...style,
        }}
        onFocus={e => { e.target.style.borderColor = clr.primary; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.12)"; e.target.style.background = "#fff"; }}
        onBlur={e => { e.target.style.borderColor = clr.border; e.target.style.boxShadow = "none"; e.target.style.background = clr.bgSubtle; }}
      />
      {hint && <span style={{ fontSize: 11.5, color: "#94a3b8" }}>{hint}</span>}
    </div>
  );
}

// ── Select ───────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { label?: string; }
export function Select({ label, style, children, ...rest }: SelectProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && <label style={{ fontSize: 11.5, fontWeight: 700, color: "#475569", letterSpacing: "0.07em", textTransform: "uppercase" }}>{label}</label>}
      <select
        {...rest}
        style={{
          padding: "9px 12px", fontSize: 13.5, borderRadius: 9,
          border: `1.5px solid ${clr.border}`, background: clr.bgSubtle,
          color: clr.text, outline: "none", cursor: "pointer",
          transition: "border-color 0.15s", width: "100%", boxSizing: "border-box", ...style,
        }}
        onFocus={e => { e.target.style.borderColor = clr.primary; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.12)"; }}
        onBlur={e => { e.target.style.borderColor = clr.border; e.target.style.boxShadow = "none"; }}
      >
        {children}
      </select>
    </div>
  );
}

// ── Badge ────────────────────────────────────────────────────────────────────
type BadgeVariant = "green" | "red" | "blue" | "gray" | "yellow" | "dark" | "purple";
const BADGE_COLORS: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  green:  { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  red:    { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  blue:   { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  gray:   { bg: "#f8fafc", color: "#475569", border: "#e2e8f0" },
  yellow: { bg: "#fefce8", color: "#ca8a04", border: "#fef08a" },
  dark:   { bg: "#1e293b", color: "#e2e8f0", border: "#334155" },
  purple: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
};
export function Badge({ label, variant = "gray" }: { label: string; variant?: BadgeVariant }) {
  const c = BADGE_COLORS[variant];
  return (
    <span style={{
      padding: "3px 9px", borderRadius: 6, fontSize: 11.5, fontWeight: 600,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      display: "inline-flex", alignItems: "center", letterSpacing: "0.02em", whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12, border: `1px solid ${clr.border}`,
      boxShadow: "0 1px 4px rgba(15,23,42,0.05)", overflow: "hidden", ...style,
    }}>
      {children}
    </div>
  );
}

// ── SectionCard ───────────────────────────────────────────────────────────────
export function SectionCard({
  title,
  action,
  children,
  style,
  headerStyle,
}: {
  title: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
}) {
  return (
    <Card style={{ marginBottom: 20, ...style }}>
      <div
        style={{
          padding: "25px 25px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fafbfc",
          ...headerStyle,
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: 13.5,
            color: clr.text,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </span>
        {action}
      </div>
      {children}
    </Card>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────
type TableProps = React.TableHTMLAttributes<HTMLTableElement>;

export function Table({ children }: { children: React.ReactNode }) {
  return <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>{children}</table></div>;
}
export function Thead({ children }: { children: React.ReactNode }) {
  return <thead style={{ background: "#fafbfc", borderBottom: `1px solid ${clr.border}` }}>{children}</thead>;
}
export function Th({ children, align, style }: { children?: React.ReactNode; align?: "left" | "right" | "center"; style?: CSSProperties }) {
  return <th style={{ padding: "10px 18px", textAlign: align || "left", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", ...style }}>{children}</th>;
}
export function Td({ children, align, style }: { children?: React.ReactNode; align?: "left" | "right" | "center"; style?: CSSProperties }) {
  return <td style={{ padding: "13px 18px", color: "#334155", verticalAlign: "middle", borderBottom: "1px solid #f1f5f9", textAlign: align, ...style }}>{children}</td>;
}
export function Tr({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return (
    <tr style={{ transition: "background 0.1s", ...style }}
      onMouseOver={e => { (e.currentTarget as HTMLTableRowElement).style.background = "#f8fafc"; }}
      onMouseOut={e => { (e.currentTarget as HTMLTableRowElement).style.background = ""; }}>
      {children}
    </tr>
  );
}

// ── Empty ─────────────────────────────────────────────────────────────────────
export function Empty({ message }: { message: string }) {
  return (
    <div style={{ textAlign: "center", padding: "56px 24px", color: "#94a3b8" }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 22 }}>—</div>
      <div style={{ fontSize: 13.5, fontWeight: 500 }}>{message}</div>
    </div>
  );
}

// ── PageHeader ────────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 14,
        marginBottom: 24,
        flexWrap: "wrap",
      }}
    >
      <div style={{ minWidth: 0, flex: "1 1 260px" }}>
        <h1 style={{ margin: 0, fontSize: "clamp(18px, 4vw, 22px)", fontWeight: 800, color: clr.text, letterSpacing: "-0.04em" }}>
          {title}
        </h1>
        {subtitle && <p style={{ margin: "5px 0 0", fontSize: 13, color: "#94a3b8" }}>{subtitle}</p>}
      </div>

      {action && (
        <div style={{ flex: "0 1 auto", width: "fit-content" }}>
          {action}
        </div>
      )}
    </div>
  );
}

// ── FormGrid ──────────────────────────────────────────────────────────────────
export function FormGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(240px, 1fr))`,
        gap: 14,
      }}
    >
      {children}
    </div>
  );
}
// ── Divider ───────────────────────────────────────────────────────────────────
export function Divider({ label }: { label?: string }) {
  if (label) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0 4px" }}>
        <div style={{ flex: 1, height: 1, background: clr.border }} />
        <span style={{ fontSize: 10.5, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{label}</span>
        <div style={{ flex: 1, height: 1, background: clr.border }} />
      </div>
    );
  }
  return <hr style={{ border: "none", borderTop: `1px solid ${clr.border}`, margin: "18px 0" }} />;
}

// ── InfoRow ───────────────────────────────────────────────────────────────────
export function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        padding: "10px 0",
        borderBottom: "1px solid #f1f5f9",
        alignItems: "flex-start",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          minWidth: 120,
          flex: "0 0 120px",
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontSize: 13.5,
          color: clr.text,
          flex: "1 1 180px",
          minWidth: 0,
          wordBreak: "break-word",
        }}
      >
        {value || <span style={{ color: "#cbd5e1" }}>—</span>}
      </span>
    </div>
  );
}

// ── Toggle ────────────────────────────────────────────────────────────────────
export function Toggle({ checked, onChange, disabled, label }: {
  checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; label?: string;
}) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}>
      <div
        onClick={() => !disabled && onChange(!checked)}
        style={{
          width: 40, height: 22, borderRadius: 11,
          background: checked ? "#16a34a" : "#dc2626",
          position: "relative", transition: "background 0.2s", flexShrink: 0,
        }}
      >
        <div style={{
          position: "absolute", top: 3, left: checked ? 21 : 3,
          width: 16, height: 16, borderRadius: "50%", background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
          transition: "left 0.18s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
      {label && <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{label}</span>}
    </label>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

export function Tabs<T extends string>({ active, onChange, tabs }: {
  active: T;
  onChange: (t: T) => void;
  tabs: { id: T; label: string; count?: number }[];
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        marginBottom: 14,
        background: "#fff",
        borderRadius: 10,
        padding: 5,
        width: "100%",
        position: "relative",
        top: 7,
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {tabs.map(t => {
        const isActive = t.id === active;

        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              flex: "1 0 140px",
              minWidth: 120,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 7,
              padding: "11px 12px",
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              borderRadius: 12,
              border: "solid 1px #ccc",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
              background: isActive ? "#BB9F58" : "transparent",
              color: isActive ? "#fff" : "#64748b",
              whiteSpace: "nowrap",
            }}
          >
            {t.label}

            {t.count !== undefined && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "1px 7px",
                  borderRadius: 99,
                  background: isActive ? "#ccc" : "#e2e8f0",
                  color: isActive ? clr.primary : "#94a3b8",
                }}
              >
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
