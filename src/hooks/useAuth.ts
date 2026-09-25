import { useState } from "react";
import { authRepository } from "../repository/auth.repository";

export function useAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 👇 novos estados de validação
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  function validate() {
    let valid = true;

    // valida email
    if (!email) {
      setEmailError("E-mail obrigatório");
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("E-mail inválido");
      valid = false;
    } else {
      setEmailError(null);
    }

    // valida senha
    if (!password) {
      setPasswordError("Senha obrigatória");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Mínimo 6 caracteres");
      valid = false;
    } else {
      setPasswordError(null);
    }

    return valid;
  }

  // Traduz a falha técnica em algo que o usuário entenda.
  function friendlyError(err: any) {
    if (err?.response) {
      const status = err.response.status;

      if (status === 400) return "Confira o e-mail e a senha informados.";
      if (status === 401) return "E-mail ou senha incorretos.";
      if (status === 403) return "Seu usuário não tem permissão de acesso.";
      if (status === 404) return "Serviço de login não encontrado. Avise o suporte.";
      if (status === 429) return "Muitas tentativas seguidas. Aguarde um instante e tente de novo.";
      if (status >= 500) return "O servidor não respondeu como esperado. Tente novamente em instantes.";

      return "Não foi possível entrar. Tente novamente.";
    }

    // Sem response: rede fora, servidor inacessível ou tempo esgotado.
    if (err?.code === "ECONNABORTED") return "O servidor demorou para responder. Tente novamente.";

    return "Não foi possível conectar ao servidor. Verifique sua conexão.";
  }

  async function login(): Promise<{ ok: boolean; message?: string }> {
    setError(null);

    if (!validate()) {
      return { ok: false, message: "Preencha o e-mail e a senha para continuar." };
    }

    setLoading(true);

    try {
      const data = await authRepository.login(email, password);
      localStorage.setItem("token", data.token);
      setTimeout(() => {
        setLoading(false);
      }, 500); // simula um carregamento mais suave
      return { ok: true };
    } catch (err: any) {
      const message = friendlyError(err);
      setError(message);
      return { ok: false, message };
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPw,
    setShowPw,
    login,
    loading,
    error,
    emailError,
    passwordError,
  };
}