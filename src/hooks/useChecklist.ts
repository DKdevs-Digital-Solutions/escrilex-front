import { useState } from "react";
import { checklistRepository } from "../repository/checklist.repository";

export function useChecklist(companyId: string) {
  const [runs, setRuns] = useState<any[]>([]);
  const [run, setRun] = useState<any>(null);
  const [loading, setLoadingChecklist] = useState(false);

  // ─────────────────────────────
  async function loadRuns(type: string) {
    setLoadingChecklist(true);
    try {
      const data = await checklistRepository.getByCompany(companyId, type);
      setRuns(data);
      return data;
    } finally {
      setLoadingChecklist(false);
    }
  }

  async function getRun(id: string) {
    const data = await checklistRepository.getRun(id);
    setRun(data);
    return data;
  }

  async function startRun(payload: any) {
    const data = await checklistRepository.start(payload);
    return data;
  }

  async function updateItem(id: string, payload: any) {
    return checklistRepository.updateItem(id, payload);
  }

  return {
    runs,
    run,
    loading,

    loadRuns,
    getRun,
    startRun,
    updateItem,
    setLoadingChecklist
  };
}