import { useEffect, useState } from "react";
import { companyRepository } from "../repository/company.repository";
import { integrationRepository } from "../repository/integration.repository";

export function useCompanies() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await companyRepository.getAll();
      setItems(data);
    } catch (err: any) {
      setError("Erro ao carregar empresas");
    } finally {
      setLoading(false);
    }
  }

  async function create(payload: any) {
    try {
      await companyRepository.create(payload);
      await load(); // recarrega lista
      return true;
    } catch (err) {
      return false;
    }
  }

  async function buscarCnpj(cnpj: string) {
    try {
      return await integrationRepository.getCompanyByCnpj(cnpj);
    } catch {
      throw new Error("Erro ao buscar CNPJ");
    }
  }

  useEffect(() => {
    load();
  }, []);



  return {
    items,
    loading,
    error,
    load,
    create,
    buscarCnpj,
  };
}