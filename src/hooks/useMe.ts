// hooks/useMe.ts
import { useEffect, useState } from "react";
import { authRepository } from "../repository/auth.repository";

export function useMe() {
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadMe() {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const user = await authRepository.me();
      setMe(user);
    } catch {
      localStorage.removeItem("token");
      setMe(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMe();
  }, []);

  return {
    me,
    loading,
    reload: loadMe,
  };
}