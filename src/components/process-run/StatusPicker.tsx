import React from "react";
import { ChevronDown, Clock, CheckCircle2, Hash, MinusCircle } from "lucide-react";

export type ItemStatus = "PENDENTE" | "CONCLUIDO" | "EM_ANDAMENTO" | "NA";

const STATUS_CONFIG: Record<
  ItemStatus,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  PENDENTE: {
    label: "Pendente",
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
    icon: <Clock size={13} strokeWidth={2} />,
  },
  EM_ANDAMENTO: {
    label: "Em andamento",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    icon: <Hash size={13} strokeWidth={2.5} />,
  },
  CONCLUIDO: {
    label: "Concluído",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    icon: <CheckCircle2 size={13} strokeWidth={2} />,
  },
  NA: {
    label: "Não se aplica",
    color: "#94a3b8",
    bg: "#f1f5f9",
    border: "#e2e8f0",
    icon: <MinusCircle size={13} strokeWidth={2} />,
  },
};

export function StatusPicker({
  value,
  onChange,
  disabled,
}: {
  value: ItemStatus;
  onChange: (s: ItemStatus) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const cfg = STATUS_CONFIG[value] ?? STATUS_CONFIG.PENDENTE;

  React.useEffect(() => {
    if (!open) return;

    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "5px 10px 5px 8px",
          borderRadius: 7,
          border: `1.5px solid ${cfg.border}`,
          background: cfg.bg,
          color: cfg.color,
          fontSize: 12.5,
          fontWeight: 600,
          fontFamily: "inherit",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.12s",
          opacity: disabled ? 0.55 : 1,
          whiteSpace: "nowrap",
        }}
      >
        {cfg.icon}
        {cfg.label}
        <ChevronDown size={11} strokeWidth={2.5} style={{ marginLeft: 2, opacity: 0.6 }} />
      </button>

      {open &&
        (() => {
          const el = ref.current?.getBoundingClientRect();
          const menuWidth = 168;
          const estimatedMenuHeight = 210;
          const margin = 8;

          const left = el
            ? Math.min(Math.max(el.left, margin), window.innerWidth - menuWidth - margin)
            : margin;

          const shouldOpenUp =
            !!el && el.bottom + estimatedMenuHeight > window.innerHeight - margin;

          const top = el
            ? shouldOpenUp
              ? Math.max(margin, el.top - estimatedMenuHeight - 6)
              : el.bottom + 5
            : margin;

          return (
            <div
              style={{
                position: "fixed",
                top,
                left,
                zIndex: 9999,
                background: "#fff",
                borderRadius: 10,
                border: "1.5px solid #e2e8f0",
                boxShadow: "0 8px 24px rgba(15,23,42,0.13)",
                minWidth: menuWidth,
                overflow: "hidden",
              }}
            >
              {(Object.entries(STATUS_CONFIG) as [
                ItemStatus,
                typeof STATUS_CONFIG[ItemStatus]
              ][]).map(([k, c]) => (
                <button
                  key={k}
                  onClick={() => {
                    onChange(k);
                    setOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    width: "100%",
                    padding: "9px 14px",
                    border: "none",
                    background: k === value ? "#f8fafc" : "#fff",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: 13,
                    fontWeight: k === value ? 700 : 500,
                    color: c.color,
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      background: c.bg,
                      border: `1.5px solid ${c.border}`,
                      flexShrink: 0,
                    }}
                  >
                    {c.icon}
                  </span>
                  {c.label}
                  {k === value && (
                    <span style={{ marginLeft: "auto", fontSize: 11, color: "#94a3b8" }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          );
        })()}
    </div>
  );
}