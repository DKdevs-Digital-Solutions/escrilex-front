import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../toast";
import {
  ItemStatus,
  getChecklistRun,
  updateChecklistItemObservation,
  updateChecklistItemStatus
} from "../repository/checklistRun.repository";

export function useChecklistRun(runId: string) {
  const { toast } = useToast();

  const [run, setRun] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string>("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getChecklistRun(runId);
      setRun(data);
    } catch (e: any) {
      toast(e?.response?.data?.message || e.message || "Erro ao carregar checklist", "error");
    } finally {
      setLoading(false);
    }
  }, [runId, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = useCallback(
    async (itemRunId: string, status: ItemStatus) => {
      setSaving(itemRunId);
      try {
        await updateChecklistItemStatus(itemRunId, status);
        await load();
      } catch (e: any) {
        toast(e?.response?.data?.message || e.message || "Erro ao atualizar", "error");
      } finally {
        setSaving("");
      }
    },
    [load, toast]
  );

  const setObservation = useCallback(
    async (itemRunId: string, observation: string) => {
      setSaving(itemRunId);
      try {
        await updateChecklistItemObservation(itemRunId, observation);
      } catch (e: any) {
        toast(e?.response?.data?.message || e.message || "Erro ao salvar observação", "error");
      } finally {
        setSaving("");
      }
    },
    [toast]
  );

  const summary = useMemo(() => {
    if (!run?.template?.sections) {
      return { totalItems: 0, doneItems: 0, pct: 0 };
    }

    const totalItems = run.template.sections.reduce(
      (acc: number, section: any) => acc + section.items.length,
      0
    );

    const doneItems = run.template.sections.reduce(
      (acc: number, section: any) =>
        acc +
        section.items.filter(
          (item: any) => item.status === "CONCLUIDO" || item.status === "NA"
        ).length,
      0
    );

    const pct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

    return { totalItems, doneItems, pct };
  }, [run]);

  return {
    run,
    loading,
    saving,
    load,
    setStatus,
    setObservation,
    ...summary,
  };
}