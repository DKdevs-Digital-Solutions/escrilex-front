import api from "../services/api";

export type ItemStatus = "PENDENTE" | "CONCLUIDO" | "EM_ANDAMENTO" | "NA";

export async function getChecklistRun(runId: string) {
  const { data } = await api.get(`/api/checklists/run/${runId}`);
  return data;
}

export async function updateChecklistItemStatus(
  itemRunId: string,
  status: ItemStatus
) {
  const { data } = await api.patch(`/api/checklists/item/${itemRunId}`, {
    status,
  });
  return data;
}

export async function updateChecklistItemObservation(
  itemRunId: string,
  observation: string
) {
  const { data } = await api.patch(`/api/checklists/item/${itemRunId}`, {
    observation,
  });
  return data;
}