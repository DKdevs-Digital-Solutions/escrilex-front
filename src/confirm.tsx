import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "warning";
}

interface ConfirmState extends ConfirmOptions {
  open: boolean;
  resolve: (ok: boolean) => void;
}

const ConfirmCtx = createContext<(opts: ConfirmOptions) => Promise<boolean>>(async () => false);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConfirmState>({
    open: false, message: "", resolve: () => {},
  });

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise(resolve => {
      setState({ ...opts, open: true, resolve });
    });
  }, []);

  function answer(ok: boolean) {
    setState(s => { s.resolve(ok); return { ...s, open: false }; });
  }

  const variant = state.variant ?? "danger";
  const iconBg   = variant === "danger" ? "#fef2f2" : "#fffbeb";
  const iconClr  = variant === "danger" ? "#ef4444" : "#f59e0b";
  const btnBg    = variant === "danger" ? "#ef4444" : "#f59e0b";
  const btnHover = variant === "danger" ? "#dc2626" : "#d97706";

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}

      {state.open && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 2000,
          background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        }}
          onClick={e => { if (e.target === e.currentTarget) answer(false); }}
        >
          <div style={{
            background: "#fff", borderRadius: 14, width: "100%", maxWidth: 380,
            boxShadow: "0 32px 80px rgba(15,23,42,0.2), 0 0 0 1px rgba(15,23,42,0.06)",
            padding: "28px 28px 24px",
            animation: "confirmIn 0.18s cubic-bezier(0.22,1,0.36,1)",
          }}>
            {/* Ícone */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: iconBg,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {variant === "danger"
                  ? <Trash2 size={20} color={iconClr} strokeWidth={2} />
                  : <AlertTriangle size={20} color={iconClr} strokeWidth={2} />}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a", letterSpacing: "-0.02em", marginBottom: 6 }}>
                  {state.title ?? (variant === "danger" ? "Confirmar exclusão" : "Atenção")}
                </div>
                <div style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.55 }}>
                  {state.message}
                </div>
              </div>
            </div>

            {/* Botões */}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                onClick={() => answer(false)}
                style={{
                  padding: "8px 18px", fontSize: 13.5, fontWeight: 600,
                  borderRadius: 9, border: "1.5px solid #e2e8f0",
                  background: "#fff", color: "#64748b", cursor: "pointer", fontFamily: "inherit",
                  transition: "background 0.12s",
                }}
                onMouseOver={e => { e.currentTarget.style.background = "#f8fafc"; }}
                onMouseOut={e => { e.currentTarget.style.background = "#fff"; }}
              >
                Cancelar
              </button>
              <button
                onClick={() => answer(true)}
                style={{
                  padding: "8px 18px", fontSize: 13.5, fontWeight: 700,
                  borderRadius: 9, border: "none",
                  background: btnBg, color: "#fff", cursor: "pointer", fontFamily: "inherit",
                  transition: "background 0.12s",
                }}
                onMouseOver={e => { e.currentTarget.style.background = btnHover; }}
                onMouseOut={e => { e.currentTarget.style.background = btnBg; }}
              >
                {state.confirmLabel ?? (variant === "danger" ? "Excluir" : "Confirmar")}
              </button>
            </div>
          </div>
          <style>{`@keyframes confirmIn { from { opacity:0; transform:scale(0.95) translateY(8px); } to { opacity:1; transform:none; } }`}</style>
        </div>
      )}
    </ConfirmCtx.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmCtx);
}
