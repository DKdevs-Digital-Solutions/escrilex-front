// services/api.ts
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Retry para "cold start" do servidor ────────────────────────────────────
// Hospedagens com suspensão por inatividade (ex.: Render free) respondem o
// primeiro acesso pelo proxy (502/503/504) ou falham sem cabeçalhos de CORS
// enquanto o serviço "acorda". Isso aparece no navegador como erro de CORS /
// ERR_FAILED. Aqui re-tentamos automaticamente, dando tempo para subir.
const MAX_RETRIES = 4;
const BASE_DELAY_MS = 3000;
const RETRY_STATUSES = [502, 503, 504];

type RetryConfig = AxiosRequestConfig & { _retryCount?: number };

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined;
    if (!config) return Promise.reject(error);

    const status = error.response?.status;
    // Sem response = falha de rede/preflight (típico de serviço dormindo);
    // 502/503/504 = erro do proxy antes da aplicação processar → seguro re-tentar.
    const isColdStart = !error.response || (status !== undefined && RETRY_STATUSES.includes(status));

    config._retryCount = config._retryCount ?? 0;
    if (isColdStart && config._retryCount < MAX_RETRIES) {
      config._retryCount += 1;
      const delay = BASE_DELAY_MS * config._retryCount; // backoff: 3s, 6s, 9s, 12s
      await new Promise((resolve) => setTimeout(resolve, delay));
      return api(config);
    }

    return Promise.reject(error);
  }
);

export default api;