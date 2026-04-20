import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";

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
  emailError:string | null
  passwordError:string | null
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
  passwordError
}: Props) {

  
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <div className="lr">
      <div className="lr-wrap">
        <h2 className="lr-h2">Bem-vindo de volta</h2>
        <p className="lr-sub">Entre com suas credenciais para continuar</p>

        <form onSubmit={handleSubmit}>
          <div className="lr-field">
            <label className="lr-label">E-mail</label>
            <input
            className={`lr-input ${emailError ? "input-error" : ""}`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            {emailError && <span className="input-error-text">{emailError}</span>}
          </div>

            <div className="lr-field">
            <label className="lr-label">Senha</label>

            <div className="lr-pw">
              <input
                className={`lr-input ${passwordError ? "input-error" : ""}`}
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: 38 }}
              />

              <button
                type="button"
                className="lr-pw-btn"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* 👇 AGORA FORA */}
            {passwordError && (
              <span className="input-error-text">{passwordError}</span>
            )}
          </div>

          {error && (
            <div className="lr-err">
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#ef4444",
                }}
              />
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="lr-btn">
            {loading ? (
              <>
                <Loader2 size={15} className="spin" /> Entrando...
              </>
            ) : (
              <>
                <LogIn size={15} /> Entrar
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}