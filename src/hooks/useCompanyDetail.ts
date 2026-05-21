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
async function saveResponsibles(payload: any) {
  await companyRepository.updateResponsibles(companyId, payload);

  const updatedResponsibles =
    await companyRepository.getResponsibles(companyId);

  setCompany((prev: any) => ({
    ...prev,
    responsibles: updatedResponsibles.responsibles,
    groupedResponsibles: updatedResponsibles.grouped,
  }));
}

function setResponsibleLocal(sectorId: string, userIds: string[]) {
  setCompany((prev: any) => {
    const current = [...(prev?.responsibles || [])];

    const others = current.filter((r: any) => {
      const currentSectorId = r.sectorId || r.sector?.id;
      return currentSectorId !== sectorId;
    });

    const nextForSector = userIds.map((userId) => ({
      sectorId,
      userId,
    }));

    return {
      ...prev,
      responsibles: [...others, ...nextForSector],
    };
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