import React from "react";
import { Eye, EyeOff, Loader2, LogIn, Mail, LockKeyhole, ShieldCheck } from "lucide-react";

type Props = {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPw: boolean;
  setShowPw: (v: boolean) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
  emailError: string | null;
  passwordError: string | null;
};

export function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  showPw,
  setShowPw,
  onSubmit,
  loading,
  error,
  emailError,
  passwordError,
}: Props) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <div className="lr">
      <div className="lr-wrap">
        

        <div className="login-head">
          {/* <span className="login-kicker">
            <ShieldCheck className="login-kicker-icon" />
            Acesso seguro
          </span> */}
          <h2 className="lr-h2">Bem-vindo de volta</h2>
          <p className="lr-sub">Entre com suas credenciais para acessar o painel.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="lr-field">
            <label className="lr-label">E-mail</label>

            <div className={`input-shell ${emailError ? "input-shell-error" : ""}`}>
              <Mail size={17} className="input-icon" />
              <input
                className="lr-input input-with-icon"
                type="email"
                value={email}
                placeholder="seuemail@empresa.com"
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {emailError && <span className="input-error-text">{emailError}</span>}
          </div>

          <div className="lr-field">
            <label className="lr-label">Senha</label>

            <div className={`input-shell ${passwordError ? "input-shell-error" : ""}`}>
              <LockKeyhole size={17} className="input-icon" />

              <input
                className="lr-input input-with-icon"
                type={showPw ? "text" : "password"}
                value={password}
                placeholder="Digite sua senha"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="lr-pw-btn"
                onClick={() => setShowPw(!showPw)}
                aria-label={showPw ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {passwordError && <span className="input-error-text">{passwordError}</span>}
          </div>

          {error && (
            <div className="lr-err">
              <span className="error-dot" />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={loading} className="lr-btn">
            {loading ? (
              <>
                <Loader2 size={16} className="spin" />
                Entrando...
              </>
            ) : (
              <>
                Entrar no sistema
                <LogIn size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}