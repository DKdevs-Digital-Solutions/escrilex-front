// repositories/authRepository.ts
import api from "../services/api";

export const authRepository = {

  async login(email: string, password: string) {
    const { data } = await api.post("/api/auth/login", { email, password });
    return data;
  },

  async me() {
    const { data } = await api.get("/api/auth/me");
    return data;
  },
};