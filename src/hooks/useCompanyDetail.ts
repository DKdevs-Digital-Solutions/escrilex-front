import { useEffect, useState } from "react";

import { companyRepository } from "../repository/company.repository";
import { lookupRepository } from "../repository/lookup.repository";
import { partnerRepository } from "../repository/partner.repository";

export function useCompanyDetail(companyId: string) {
  const [company, setCompany] = useState<any>(null);
  const [sectors, setSectors] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [socios, setSocios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ─────────────────────────────
  // LOAD BASE
  // ─────────────────────────────
  async function loadBase() {
    setLoading(true);
    try {
      const [c, s, u] = await Promise.all([
        companyRepository.getById(companyId),
        lookupRepository.getSectors(),
        lookupRepository.getUsers(),
      ]);

      setCompany(c);
      setSectors(s);
      setUsers(u);

      try {
        const partners = await partnerRepository.getAll(companyId);
        setSocios(partners);
      } catch {
        setSocios([]);
      }
    } finally {
      setLoading(false);
    }
  }

  // ─────────────────────────────
  // COMPANY
  // ─────────────────────────────
  async function updateCompany(data: any) {
    const updated = await companyRepository.update(companyId, data);
    setCompany(updated);
    return updated;
  }

  // ─────────────────────────────
  // PARTNERS (SÓCIOS)
  // ─────────────────────────────
  async function refreshPartners() {
    const data = await partnerRepository.getAll(companyId);
    setSocios(data);
  }

  async function savePartner(payload: any, id?: string) {
    if (id) {
      await partnerRepository.update(companyId, id, payload);
    } else {
      await partnerRepository.create(companyId, payload);
    }
    await refreshPartners();
  }

  async function deletePartner(id: string) {
    await partnerRepository.remove(companyId, id);
    await refreshPartners();
  }

  // ─────────────────────────────
  useEffect(() => {
    loadBase();
  }, [companyId]);



  // ─────────────────────────────
// RESPONSÁVEIS
// ─────────────────────────────
async function saveResponsibles(responsibles: any[]) {
  await companyRepository.updateResponsibles(companyId, responsibles);

  // atualiza empresa após salvar
  const updated = await companyRepository.getById(companyId);
  setCompany(updated);
}

function setResponsibleLocal(sectorId: string, userId: string) {
  setCompany((prev: any) => {
    const current = [...(prev?.responsibles || [])];

    const idx = current.findIndex((r: any) => r.sectorId === sectorId);

    if (idx >= 0) current[idx] = { ...current[idx], userId };
    else current.push({ sectorId, userId });

    return { ...prev, responsibles: current };
  });
}


function extractObs(sections: any[]) {
  const map: Record<string, string> = {};

  for (const s of sections ?? []) {
    for (const it of s.items ?? []) {
      if (it.itemRunId) {
        map[it.itemRunId] = it.observation ?? "";
      }
    }
  }

  return map;
}




  return {
    company,
    sectors,
    users,
    socios,
    loading,

    loadBase,
    updateCompany,
    savePartner,
    deletePartner,
    refreshPartners,
    saveResponsibles,
    setResponsibleLocal,
    extractObs
  };
}