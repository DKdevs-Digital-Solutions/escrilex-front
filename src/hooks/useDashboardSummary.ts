import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  Building2,
  Users,
  UserX,
} from "lucide-react";
import { getDashboardSummary, DashboardSummary } from "../repository/dashboard.repository";

function toInputDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getMonthStartDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export function useDashboardSummary() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [startDate, setStartDate] = useState(() =>
    toInputDate(getMonthStartDate())
  );

  const [endDate, setEndDate] = useState(() => toInputDate(new Date()));

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const summary = await getDashboardSummary({
        startDate,
        endDate,
      });

      setData(summary);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);




  return {
    data,
    loading,
    error,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    loadDashboard,
  };
}