import React, { useState } from "react";
import { LogIn, Eye, EyeOff, Loader2 } from "lucide-react";
import { LoginForm } from "../components/formAuth";
import { useAuth } from "../hooks/useAuth";

export function Login({ onLogin }: { onLogin: () => void }) {


  const { 
    email, 
    setEmail, 
    password, 
    setPassword, 
    showPw, 
    setShowPw, 
    login, 
    loading, 
    emailError,
    passwordError,
    error 
  } = useAuth();

  

  async function handleLogin() {
    const ok = await login();

    if (ok) {
      onLogin(); 
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
        html, body, #root { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }

        .lw {
          position: fixed; inset: 0;
          display: grid;
          grid-template-columns: 1fr 420px;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        /* ── LEFT ── */
        .ll {
          position: relative;
          background: #0d1117;
          display: flex;
          flex-direction: column;
          padding: 44px 64px;
          overflow: hidden;
        }
        .ll::before {
          content: '';
          position: absolute; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }
        .ll::after {
          content: '';
          position: absolute; z-index: 0;
          bottom: -140px; right: -100px;
          width: 560px; height: 560px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(37,99,235,0.16) 0%, transparent 68%);
          pointer-events: none;
        }

        /* logo row */
        .ll-logo {
          display: flex; align-items: center; gap: 10px;
          position: relative; z-index: 1; flex-shrink: 0;
        }
        .ll-logo-icon {
          width: 36px; height: 36px; border-radius: 9px; background: #2563eb; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .ll-logo-name { font-weight: 800; font-size: 15px; color: #fff; letter-spacing: -0.03em; line-height: 1; }
        .ll-logo-pro  { font-size: 9px; color: #60a5fa; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 2px; }

        /* center block */
        .ll-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;     /* ✅ centraliza horizontal */
  text-align: center;      /* ✅ centraliza texto */
  position: relative;
  z-index: 1;
  padding: 20px 0;
}
        .ll-tag {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(37,99,235,0.13); border: 1px solid rgba(37,99,235,0.28);
          border-radius: 99px; padding: 5px 14px; margin-bottom: 28px; width: fit-content;
          font-size: 11.5px; font-weight: 600; color: #93c5fd; letter-spacing: 0.05em;
        }
        .ll-tag-dot { width: 6px; height: 6px; border-radius: 50%; background: #3b82f6; flex-shrink: 0; }
        .ll-h1 {
          margin: 0 0 18px; font-size: 54px; font-weight: 800; color: #fff;
          letter-spacing: -0.045em; line-height: 1.04;
        }
        .ll-h1 span {
          background: linear-gradient(135deg, #60a5fa 0%, #2563eb 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .ll-desc { margin: 0 0 52px; font-size: 15px; color: #4b5563; line-height: 1.7; max-width: 400px; }
        .ll-stats { display: flex; align-items: center; gap: 0; }
        .ll-stat { padding: 0 32px; }
        .ll-stat:first-child { padding-left: 0; }
        .ll-stat-sep { width: 1px; height: 36px; background: #1e2535; flex-shrink: 0; }
        .ll-stat-val { font-size: 28px; font-weight: 800; color: #fff; letter-spacing: -0.03em; line-height: 1; }
        .ll-stat-lbl { font-size: 11.5px; color: #4b5563; font-weight: 500; margin-top: 5px; }

        /* footer row */
        .ll-footer { font-size: 11px; color: #1e2535; position: relative; z-index: 1; flex-shrink: 0; }

        /* ── RIGHT ── */
        .lr {
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          padding: 40px 44px;
          box-shadow: -1px 0 0 rgba(0,0,0,0.07);
        }
        .lr-wrap { width: 100%; }
        .lr-h2  { margin: 0 0 5px; font-size: 23px; font-weight: 800; color: #0f172a; letter-spacing: -0.04em; }
        .lr-sub { margin: 0 0 26px; font-size: 13.5px; color: #94a3b8; }
        .lr-label { display: block; font-size: 10.5px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
        .lr-field { margin-bottom: 15px; }
        .lr-input {
          width: 100%; padding: 10px 13px; font-size: 13.5px;
          border-radius: 8px; border: 1.5px solid #e2e8f0;
          color: #0f172a; font-family: inherit; background: #f8fafc;
          outline: none; box-sizing: border-box;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
        }
        .lr-input:focus { border-color: #2563eb; background: #fff; box-shadow: 0 0 0 3px rgba(37,99,235,0.11); }
        .lr-pw { position: relative; }
        .lr-pw-btn {
          position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #94a3b8;
          display: flex; align-items: center; padding: 0; transition: color 0.12s;
        }
        .lr-pw-btn:hover { color: #2563eb; }
        .lr-err {
          display: flex; align-items: center; gap: 9px;
          background: #fef2f2; border: 1.5px solid #fecaca;
          border-radius: 8px; padding: 9px 13px; margin-bottom: 13px;
          font-size: 13px; color: #b91c1c; font-weight: 500;
        }
        .lr-btn {
          width: 100%; padding: 11px; font-size: 14px; font-weight: 700;
          border-radius: 9px; background: #2563eb; color: #fff; border: none;
          cursor: pointer; font-family: inherit; margin-top: 6px;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          box-shadow: 0 2px 10px rgba(37,99,235,0.28);
          transition: background 0.15s, box-shadow 0.15s;
        }
        .lr-btn:hover:not(:disabled) { background: #1d4ed8; box-shadow: 0 4px 16px rgba(37,99,235,0.36); }
        .lr-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .lr-div {
          display: flex; align-items: center; gap: 10px;
          margin: 18px 0 13px; font-size: 10px; color: #cbd5e1; font-weight: 700; letter-spacing: 0.06em;
        }
        .lr-div::before, .lr-div::after { content: ''; flex: 1; height: 1px; background: #f1f5f9; }
        .lr-demo {
          background: #f8fafc; border: 1.5px solid #e2e8f0;
          border-radius: 9px; padding: 12px 14px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 3px 12px;
        }
        .lr-demo-lbl { font-size: 9.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 2px; }
        .lr-demo-val { font-family: monospace; font-size: 12.5px; color: #334155; font-weight: 600; }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>

      <div className="lw">

        {/* ── LEFT ── */}
        <div className="ll">
          <div className="ll-logo">
            <div className="ll-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <div>
              <div className="ll-logo-name">Gestão</div>
              <div className="ll-logo-pro">PRO</div>
            </div>
          </div>

          <div className="ll-body">
            <div className="ll-tag">
              <span className="ll-tag-dot" />
              Sistema de Gestão
            </div>
            <h1 className="ll-h1">
              Sistema de<br />
              <span>Gestão</span>
            </h1>
            <p className="ll-desc">
              Controle completo de entradas e saídas com rastreabilidade e auditoria em tempo real.
            </p>
            <div className="ll-stats">
              {[["100%","Rastreável"],["24/7","Disponível"],["∞","Empresas"]].map(([v,l], i) => (
                <React.Fragment key={l}>
                  {i > 0 && <div className="ll-stat-sep" />}
                  <div className="ll-stat">
                    <div className="ll-stat-val">{v}</div>
                    <div className="ll-stat-lbl">{l}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="ll-footer">© 2025 Gestão · Todos os direitos reservados</div>
        </div>

        {/* ── RIGHT ── */}
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPw={showPw}
          setShowPw={setShowPw}
          onSubmit={handleLogin}
          loading={loading}
          error={error}
          emailError={emailError}
          passwordError={passwordError}
        />

      </div>
    </>
  );
}
