import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";
export interface Toast { id: string; message: string; type: ToastType; }
interface ToastCtx { toast: (message: string, type?: ToastType) => void; }

const ToastContext = createContext<ToastCtx>({ toast: () => {} });
export function useToast() { return useContext(ToastContext); }

const CONFIG: Record<ToastType, {
  bg: string; border: string; iconColor: string;
  titleColor: string; msgColor: string; icon: JSX.Element;
}> = {
  success: {
    bg: "#f0fdf4", border: "#bbf7d0", iconColor: "#16a34a",
    titleColor: "#15803d", msgColor: "#4ade80",
    icon: <CheckCircle2 size={16} strokeWidth={2} />,
  },
  error: {
    bg: "#fef2f2", border: "#fecaca", iconColor: "#dc2626",
    titleColor: "#b91c1c", msgColor: "#f87171",
    icon: <XCircle size={16} strokeWidth={2} />,
  },
  warning: {
    bg: "#fffbeb", border: "#fde68a", iconColor: "#d97706",
    titleColor: "#b45309", msgColor: "#fcd34d",
    icon: <AlertTriangle size={16} strokeWidth={2} />,
  },
  info: {
    bg: "#f0f9ff", border: "#bae6fd", iconColor: "#0284c7",
    titleColor: "#0369a1", msgColor: "#7dd3fc",
    icon: <Info size={16} strokeWidth={2} />,
  },
};

const LABELS: Record<ToastType, string> = {
  success: "Sucesso", error: "Erro", warning: "Atenção", info: "Info",
};

function ToastItem({ t, onRemove }: { t: Toast; onRemove: () => void }) {
  const c = CONFIG[t.type];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onRemove, 300);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      onClick={() => { setVisible(false); setTimeout(onRemove, 300); }}
      style={{
        display: "flex", alignItems: "flex-start", gap: 11, padding: "12px 16px",
        background: c.bg, border: `1px solid ${c.border}`, borderRadius: 11,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)", minWidth: 270, maxWidth: 380,
        cursor: "pointer",
        transform: visible ? "translateX(0)" : "translateX(110%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease",
      }}
    >
      <span style={{ color: c.iconColor, marginTop: 1, flexShrink: 0 }}>{c.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: c.titleColor, marginBottom: 2 }}>
          {LABELS[t.type]}
        </div>
        <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.4 }}>{t.message}</div>
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const ref = useRef(0);
  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = `t${++ref.current}`;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{
        position: "fixed", bottom: 22, right: 22,
        display: "flex", flexDirection: "column", gap: 8, zIndex: 9999,
      }}>
        {toasts.map(t => (
          <ToastItem
            key={t.id} t={t}
            onRemove={() => setToasts(p => p.filter(x => x.id !== t.id))}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
