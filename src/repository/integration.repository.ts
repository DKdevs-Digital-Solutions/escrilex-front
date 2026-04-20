import api from "../services/api";

export const integrationRepository = {
  getCompanyByCnpj: async (cnpj: string) => {
    const { data } = await api.get(`/api/integrations/cnpj/${cnpj}`);
    return data;
  },
};