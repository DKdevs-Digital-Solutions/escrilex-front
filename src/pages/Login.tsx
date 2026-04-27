import React, { useState } from "react";
import { LogIn, Eye, EyeOff, Loader2 } from "lucide-react";
import { LoginForm } from "../components/FormAuth";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/logo.png";
import { Zap, ShieldCheck, Activity } from "lucide-react";

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
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

  :root {
    --blue: #012942;
    --blue-2: #063b5c;
    --gold: #BB9F58;
    --gold-2: #e2c878;
    --text: #0f172a;
    --muted: #64748b;
    --border: #e5e7eb;
  }

  html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100%;
  }

  body {
    font-family: 'DM Sans', system-ui, sans-serif;
    background: var(--blue);
  }

  * {
    box-sizing: border-box;
  }
.lw {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(820px, 650px) minmax(420px, 480px);
  justify-content: center;
  background:
    radial-gradient(circle at 18% 18%, rgba(187,159,88,0.25), transparent 28%),
    radial-gradient(circle at 78% 72%, rgba(255,255,255,0.10), transparent 32%),
    linear-gradient(135deg, #011827 0%, var(--blue) 48%, #03111c 100%);
  overflow: hidden;
}

.ll {
  position: relative;
  padding: 52px 42px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #fff;
}

  .ll::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: linear-gradient(to bottom, black 0%, transparent 92%);
    pointer-events: none;
  }



  .ll-logo,
  .ll-body,
  .ll-footer {
    position: relative;
    z-index: 1;
  }

  .ll-logo {
    display: flex;
    align-items: center;
    gap: 13px;
  }

  .ll-logo-icon {
    width: 44px;
    height: 44px;
    border-radius: 16px;
    background: linear-gradient(135deg, var(--gold), var(--gold-2));
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 18px 42px rgba(187,159,88,0.28);
  }

  .ll-logo-name {
    font-size: 17px;
    font-weight: 900;
    color: #fff;
    letter-spacing: -0.04em;
    line-height: 1;
  }

  .ll-logo-pro {
    margin-top: 4px;
    font-size: 10px;
    font-weight: 900;
    color: var(--gold-2);
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .ll-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 650px;
    position: relative;
    bottom: 30px;
  }

  .ll-tag {
    width: fit-content;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 15px;
    margin-bottom: 30px;
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.14);
    color: #f8fafc;
    font-size: 12px;
    font-weight: 800;
    backdrop-filter: blur(14px);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
  }

  .ll-tag-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: var(--gold);
    box-shadow: 0 0 0 6px rgba(187,159,88,0.16);
  }

  .ll-h1 {
    margin: 0;
    max-width: 680px;
    font-size: clamp(46px, 5.4vw, 78px);
    line-height: 0.94;
    font-weight: 900;
    letter-spacing: -0.075em;
    color: #fff;
  }

  .ll-h1 span {
    background: linear-gradient(135deg, var(--gold) 0%, #f7e6a4 48%, #ffffff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .ll-desc {
    margin: 26px 0 42px;
    max-width: 520px;
    font-size: 16px;
    line-height: 1.75;
    color: #cbd5e1;
  }

  .ll-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
  }

  .ll-stat {
    min-width: 138px;
    padding: 17px 18px;
    border-radius: 20px;
    background: rgba(255,255,255,0.075);
    border: 1px solid rgba(255,255,255,0.12);
    backdrop-filter: blur(16px);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
  }

  .ll-stat-sep {
    display: none;
  }

  .ll-stat-val {
    font-size: 28px;
    font-weight: 900;
    color: #fff;
    letter-spacing: -0.05em;
    line-height: 1;
  }

  .ll-stat-lbl {
    margin-top: 7px;
    font-size: 12px;
    color: #cbd5e1;
    font-weight: 700;
  }

  .ll-footer {
    font-size: 12px;
    color: rgba(255,255,255,0.42);
  }

.lr {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 42px 32px;
}

  .lr::before {
  content: "";
  position: absolute;
  inset: 22px;
  border-radius: 34px;
  padding: 2px;

  background: linear-gradient(
    120deg,
    transparent 0%,
    transparent 30%,
    rgba(187,159,88,0.6) 50%,
    transparent 70%,
    transparent 100%
  );

  background-size: 200% 200%;
  animation: borderMove 3s linear infinite;

  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;

  pointer-events: none;
}

@keyframes borderMove {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

  .lr-wrap {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 390px;
    padding: 36px;
    border-radius: 30px;
    background: rgba(255,255,255,0.96);
    border: 1px solid rgba(226,232,240,0.95);
    box-shadow:
      0 28px 80px rgba(15,23,42,0.14),
      0 1px 0 rgba(255,255,255,0.9) inset;
  }

  .lr-h2 {
    margin: 0 0 7px;
    font-size: 30px;
    font-weight: 900;
    color: var(--text);
    letter-spacing: -0.06em;
  }

  .lr-sub {
    margin: 0 0 30px;
    font-size: 14px;
    color: var(--muted);
    line-height: 1.55;
  }

  .lr-label {
    display: block;
    margin-bottom: 8px;
    font-size: 11px;
    font-weight: 900;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.09em;
  }

  .lr-field {
    margin-bottom: 16px;
  }

  .lr-input {
    width: 100%;
    height: 48px;
    padding: 0 15px;
    font-size: 14px;
    border-radius: 15px;
    border: 1.5px solid #e2e8f0;
    color: var(--text);
    background: #f8fafc;
    outline: none;
    transition: all 0.16s ease;
    font-family: inherit;
  }

  .lr-input:hover {
    border-color: #cbd5e1;
    background: #fff;
  }

  .lr-input:focus {
    border-color: var(--gold);
    background: #fff;
    box-shadow: 0 0 0 4px rgba(187,159,88,0.18);
  }

  .lr-pw {
    position: relative;
  }

  .lr-pw .lr-input {
    padding-right: 46px;
  }

  .lr-pw-btn {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: transparent;
    color: #94a3b8;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0;
    transition: color 0.14s ease;
  }

  .lr-pw-btn:hover {
    color: var(--gold);
  }

  .lr-btn {
    width: 100%;
    height: 50px;
    margin-top: 8px;
    border: none;
    border-radius: 16px;
    background: linear-gradient(135deg, var(--blue) 0%, var(--blue-2) 100%);
    color: #fff;
    font-size: 14px;
    font-weight: 900;
    cursor: pointer;
    font-family: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow:
      0 18px 38px rgba(1,41,66,0.32),
      inset 0 1px 0 rgba(255,255,255,0.12);
    transition: transform 0.16s ease, box-shadow 0.16s ease, filter 0.16s ease;
  }

  .lr-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: brightness(1.04);
    box-shadow:
      0 22px 48px rgba(1,41,66,0.42),
      inset 0 1px 0 rgba(255,255,255,0.16);
  }

  .lr-btn:disabled {
    opacity: 0.58;
    cursor: not-allowed;
  }

  .lr-err {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-bottom: 14px;
    padding: 11px 13px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 15px;
    color: #b91c1c;
    font-size: 13px;
    font-weight: 700;
  }

  .lr-div {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 22px 0 14px;
    font-size: 10px;
    color: #cbd5e1;
    font-weight: 900;
    letter-spacing: 0.08em;
  }

  .lr-div::before,
  .lr-div::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }

  .lr-demo {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 12px;
    padding: 15px;
    border-radius: 18px;
    background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
    border: 1px solid #e2e8f0;
  }

  .lr-demo-lbl {
    margin-bottom: 3px;
    font-size: 10px;
    font-weight: 900;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .lr-demo-val {
    font-family: monospace;
    font-size: 12.5px;
    color: #334155;
    font-weight: 800;
    word-break: break-word;
  }

  @media (max-width: 1180px) {
    .lw {
      grid-template-columns: minmax(0, 1fr) 440px;
    }

    .ll {
      padding: 44px 52px;
    }
  }

  @media (max-width: 999px) {
    html, body, #root {
      min-height: 100%;
      overflow: auto;
    }

    .lw {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 22px 16px;
      overflow: auto;
      background:
        radial-gradient(circle at top left, rgba(187,159,88,0.28), transparent 34%),
        radial-gradient(circle at bottom right, rgba(255,255,255,0.10), transparent 30%),
        linear-gradient(135deg, var(--blue) 0%, #03111c 100%);
    }

    .ll {
      display: none;
    }

    .lr {
      width: 100%;
      min-height: auto;
      padding: 0;
      background: transparent;
      box-shadow: none;
      backdrop-filter: none;
    }

    .lr::before {
      display: none;
    }

    .lr-wrap {
      width: 100%;
      max-width: 430px;
      padding: 30px 22px;
      border-radius: 26px;
      background: rgba(255,255,255,0.98);
    }

    .lr-h2 {
      font-size: 27px;
    }

    .lr-sub {
      margin-bottom: 26px;
      font-size: 13.5px;
    }

    .lr-input {
      height: 48px;
    }

    .lr-demo {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 420px) {
    .lw {
      padding: 14px;
      align-items: stretch;
    }

    .lr {
      align-items: center;
    }

    .lr-wrap {
      max-width: none;
      padding: 26px 18px;
      border-radius: 22px;
    }

    .lr-h2 {
      font-size: 25px;
    }

    .lr-btn {
      height: 48px;
    }
  }

  .ll-logo {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  right: 10px;
}

.ll-logo-img {
  height: 55px;
  max-width: 210px;
  object-fit: contain;
}

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .spin {
    animation: spin 0.8s linear infinite;
  }
`}</style>

      <div className="lw">

        {/* ── LEFT ── */}
        <div className="ll">

           <div className="ll-logo">
            <img src={Logo} alt="Logo da empresa" className="ll-logo-img" />
          </div>

          <div className="ll-body">
            <h1 className="ll-h1">
              Controle total<br />
              <span>da sua operação</span>
            </h1>

          

            <div className="ll-premium-card">
              <div className="ll-premium-top">
                <span className="ll-premium-pulse" />
                Operação conectada
              </div>

              <div className="ll-premium-title">
                Fluxos, responsáveis e auditoria em uma única visão.
              </div>

             <div className="ll-premium-grid">
              <div className="ll-premium-item highlight">
                <Zap className="ll-icon" />
                <strong>Tempo real</strong>
                <span>Atualizações instantâneas</span>
              </div>

              <div className="ll-premium-item">
                <ShieldCheck className="ll-icon" />
                <strong>Seguro</strong>
                <span>Controle de acesso avançado</span>
              </div>

              <div className="ll-premium-item">
                <Activity className="ll-icon" />
                <strong>Auditável</strong>
                <span>Histórico completo</span>
              </div>
            </div>
            </div>
          </div>

          <div className="ll-footer">
            © 2025 SGE · Todos os direitos reservados
          </div>
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
