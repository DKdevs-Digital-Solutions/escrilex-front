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
    icon: <CheckCircle2 size={18} strokeWidth={2.4} />,
  },
  error: {
    bg: "#fef2f2", border: "#fecaca", iconColor: "#dc2626",
    titleColor: "#b91c1c", msgColor: "#f87171",
    icon: <XCircle size={18} strokeWidth={2.4} />,
  },
  warning: {
    bg: "#fffbeb", border: "#fde68a", iconColor: "#d97706",
    titleColor: "#b45309", msgColor: "#fcd34d",
    icon: <AlertTriangle size={18} strokeWidth={2.4} />,
  },
  info: {
    bg: "#f0f9ff", border: "#bae6fd", iconColor: "#0284c7",
    titleColor: "#0369a1", msgColor: "#7dd3fc",
    icon: <Info size={18} strokeWidth={2.4} />,
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
      setTimeout(onRemove, 280);
    }, 4200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      onClick={() => {
        setVisible(false);
        setTimeout(onRemove, 280);
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,

        width: "calc(100vw - 40px)", // 👈 chave
        maxWidth: 420,

        padding: "14px 16px",
        borderRadius: 16,

        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(14px)",

        border: "1px solid rgba(226,232,240,0.9)",
        borderLeft: `4px solid ${c.iconColor}`,

        boxShadow:
          "0 18px 45px rgba(15,23,42,0.16), 0 4px 12px rgba(15,23,42,0.08)",

        cursor: "pointer",
      }}
          >
      <span
        style={{
          width: 34,
          height: 34,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: c.bg,
          color: c.iconColor,
          flexShrink: 0,
        }}
      >
        {c.icon}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: 2,
            letterSpacing: "-0.01em",
          }}
        >
          {LABELS[t.type]}
        </div>

        <div
          style={{
            fontSize: 13,
            color: "#475569",
            lineHeight: 1.45,
            wordBreak: "break-word",
          }}
        >
          {t.message}
        </div>
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
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          zIndex: 999999,
        }}
      >
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
