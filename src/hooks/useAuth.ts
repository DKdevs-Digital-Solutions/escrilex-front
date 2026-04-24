import { useState } from "react";
import { authRepository } from "../repository/auth.repository";

export function useAuth() {
  const [email, setEmail] = useState("admin@local.com");
  const [password, setPassword] = useState("admin123");
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

  async function login() {
    setError(null);

    if (!validate()) return false;

    setLoading(true);

    try {
      const data = await authRepository.login(email, password);
      localStorage.setItem("token", data.token);
      setTimeout(() => {
        setLoading(false);
      }, 500); // simula um carregamento mais suave
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao logar");
      return false;
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