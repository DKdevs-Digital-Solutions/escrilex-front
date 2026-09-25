import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";
export interface Toast { id: string; message: string; type: ToastType; }
interface ToastCtx { toast: (message: string, type?: ToastType) => void; }

const ToastContext = createContext<ToastCtx>({ toast: () => {} });
export function useToast() { return useContext(ToastContext); }

// Cartão claro: legível tanto sobre o fundo escuro do login quanto dentro do sistema.
const SURFACE = "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)";

const CONFIG: Record<ToastType, { accent: string; soft: string; icon: JSX.Element }> = {
  success: {
    accent: "#16A34A", soft: "#F0FDF4",
    icon: <CheckCircle2 size={17} strokeWidth={2.6} />,
  },
  error: {
    accent: "#DC2626", soft: "#FEF2F2",
    icon: <XCircle size={17} strokeWidth={2.6} />,
  },
  warning: {
    accent: "#A17C2F", soft: "rgba(187,159,88,0.14)",
    icon: <AlertTriangle size={17} strokeWidth={2.6} />,
  },
  info: {
    accent: "#0284C7", soft: "#F0F9FF",
    icon: <Info size={17} strokeWidth={2.6} />,
  },
};

const LABELS: Record<ToastType, string> = {
  success: "Sucesso", error: "Erro", warning: "Atenção", info: "Info",
};

// Erro fica mais tempo na tela: costuma exigir leitura e ação.
const DURATION: Record<ToastType, number> = {
  success: 4200, info: 4200, warning: 5200, error: 6000,
};

function ToastItem({ t, onRemove }: { t: Toast; onRemove: () => void }) {
  const c = CONFIG[t.type];
  const total = DURATION[t.type];

  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  // A barra é animada por ref (sem re-render a cada frame) e compartilha o mesmo
  // contador do fechamento — o que se vê encolhendo é o tempo real restante.
  const barRef = useRef<HTMLDivElement>(null);
  const remainingRef = useRef(total);
  const pausedRef = useRef(false);
  const closedRef = useRef(false);

  const close = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    setVisible(false);
    setTimeout(onRemove, 260);
  }, [onRemove]);

  useEffect(() => {
    const entrance = requestAnimationFrame(() => setVisible(true));

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = now - last;
      last = now;

      if (!pausedRef.current) {
        remainingRef.current -= delta;

        if (barRef.current) {
          const percent = Math.max(0, remainingRef.current / total) * 100;
          barRef.current.style.width = `${percent}%`;
        }

        if (remainingRef.current <= 0) {
          close();
          return;
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(entrance);
      cancelAnimationFrame(frame);
    };
  }, [close, total]);

  function setPaused(value: boolean) {
    pausedRef.current = value;
    setHovered(value);
  }

  return (
    <div
      role="status"
      aria-live={t.type === "error" ? "assertive" : "polite"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: "relative",
        overflow: "hidden",

        display: "flex",
        alignItems: "flex-start",
        gap: 12,

        width: "calc(100vw - 40px)",
        maxWidth: 400,

        padding: "13px 14px 15px",
        borderRadius: 14,

        background: SURFACE,
        border: "1px solid #e2e8f0",
        borderLeft: `4px solid ${c.accent}`,

        boxShadow: hovered
          ? "0 22px 50px rgba(15,23,42,0.20), 0 6px 16px rgba(15,23,42,0.10)"
          : "0 16px 40px rgba(15,23,42,0.16), 0 3px 10px rgba(15,23,42,0.07)",

        opacity: visible ? 1 : 0,
        transform: visible
          ? `translateX(0) scale(${hovered ? 1.015 : 1})`
          : "translateX(24px) scale(0.97)",
        transition: "opacity .26s ease, transform .26s cubic-bezier(.22,1,.36,1), box-shadow .2s ease",
      }}
    >
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: c.soft,
          color: c.accent,
          border: `1px solid ${c.accent}2e`,
          flexShrink: 0,
        }}
      >
        {c.icon}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 900,
            color: c.accent,
            textTransform: "uppercase",
            letterSpacing: ".08em",
            marginBottom: 3,
          }}
        >
          {LABELS[t.type]}
        </div>

        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#334155",
            lineHeight: 1.45,
            wordBreak: "break-word",
          }}
        >
          {t.message}
        </div>
      </div>

      <button
        type="button"
        onClick={close}
        title="Fechar"
        aria-label="Fechar"
        style={{
          width: 24,
          height: 24,
          flexShrink: 0,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 7,
          border: "none",
          background: "transparent",
          color: "#94a3b8",
          cursor: "pointer",
          transition: "background .15s ease, color .15s ease",
          fontFamily: "inherit",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "#f1f5f9";
          e.currentTarget.style.color = "#334155";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#94a3b8";
        }}
      >
        <X size={14} strokeWidth={2.6} />
      </button>

      {/* Tempo restante: encolhe até sumir e congela enquanto o mouse estiver em cima. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 3,
          background: "#eef2f7",
        }}
      >
        <div
          ref={barRef}
          style={{
            width: "100%",
            height: "100%",
            background: `linear-gradient(90deg, ${c.accent}, ${c.accent}b3)`,
            opacity: hovered ? 0.45 : 1,
            transition: "opacity .15s ease",
          }}
        />
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
          pointerEvents: "none",
        }}
      >
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: "auto" }}>
            <ToastItem
              t={t}
              onRemove={() => setToasts(p => p.filter(x => x.id !== t.id))}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
