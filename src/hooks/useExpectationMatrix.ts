import { useEffect, useState } from "react";
import {
  getExpectationMatrix,
  getExpectationMatrixByCompanyId,
  getExpectationMatrixOptions,
  ExpectationMatrixParams,
  updateExpectationMatrix
} from "../repository/expectationMatrix.repository";
import { useToast } from "../toast";

export function useExpectationMatrix() {
  const [optionsData, setOptionsData] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [grupo, setGrupo] = useState("");
  const [tributacao, setTributacao] = useState("");
  const [ramo, setRamo] = useState("");
  const [perfil, setPerfil] = useState("");

  const [limit, setLimit] = useState(100);
  const [offset, setOffset] = useState(0);

  const [saving, setSaving] = useState(false);


  async function loadOptions() {
    try {
      setLoadingOptions(true);
      const response = await getExpectationMatrixOptions();
      setOptionsData(response);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Erro ao carregar opções da matriz."
      );
    } finally {
      setLoadingOptions(false);
    }
  }

  async function loadMatrix(override?: Partial<ExpectationMatrixParams>) {
    try {
      setLoading(true);
      setError("");

      const response = await getExpectationMatrix({
        search,
        status,
        grupo,
        tributacao,
        ramo,
        perfil,
        limit,
        offset,
        ...override,
      });

      setData(response);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Erro ao carregar matriz de expectativas."
      );
    } finally {
      setLoading(false);
    }
  }

  async function openDetail(companyId: string) {
    try {
      setLoadingDetail(true);
      const response = await getExpectationMatrixByCompanyId(companyId);
      setDetail(response);
    } finally {
      setLoadingDetail(false);
    }
  }

  function closeDetail() {
    setDetail(null);
  }

  function clearFilters() {
    setSearch("");
    setStatus("");
    setGrupo("");
    setTributacao("");
    setRamo("");
    setPerfil("");
    setOffset(0);

    loadMatrix({
      search: "",
      status: "",
      grupo: "",
      tributacao: "",
      ramo: "",
      perfil: "",
      offset: 0,
    });
  }


    async function saveMatrix(companyId: string, payload: Record<string, any>) {
    try {
        setSaving(true);
        setError("");

        const response = await updateExpectationMatrix(companyId, payload);
        toast("Matriz de expectativas atualizada com sucesso", "success");
        await loadMatrix();

        return response;
    } catch (err: any) {
        setError(
        err?.response?.data?.message ||
            err?.message ||
            "Erro ao salvar matriz de expectativas."
        );
        toast(
            "Não foi possível atualizar a matriz de expectativas",
            "error"
        );

        throw err;
    } finally {
        setSaving(false);
    }
    }


  useEffect(() => {
    loadOptions();
    loadMatrix();
  }, []);

const rawColumns = optionsData?.columns ?? [];
const setores = optionsData?.setores ?? [];

// colunas normais da tabela
const tableColumns = rawColumns.filter(
  (column: any) => column.type !== "sector-user"
);

// setores vêm do array setores, não de columns
const sectorColumns = setores.map((setor: any) => ({
  key: setor.name,
  label: `RESP. ${String(setor.name).toUpperCase()}`,
  type: "sector-user",
  sectorId: setor.id,
}));

const COLUMN_SECTIONS = [
  {
    name: "Identificação da empresa",
    keys: [
      "codigo",
      "empresa",
      "cnpjCpf",
      "grupo",
      "matrizFilial",
      "tributacao",
      "ramo",
      "perfilComercial",
      "status",
    ],
  },
  {
    name: "Acompanhamento e serviços",
    keys: [
      "observacoes",
      "reunioesFechamentos",
      "consultoria",
      "fechamentoContabil",
      "analiseCompliance",
      "cobrancaServExtras",
      "complexidadeFiscal",
      "complexidadeContabil",
    ],
  },
  {
    name: "Datas",
    keys: ["entrada", "saida"],
  },
];

const sections = COLUMN_SECTIONS.map((section) => {
  const columns = tableColumns.filter((column: any) =>
    section.keys.includes(column.key)
  );

  return {
    name: section.name,
    columns,
  };
}).filter((section) => section.columns.length > 0);



return {
    optionsData,

    columns: tableColumns,
    sections,

    sectorColumns,

    options: optionsData?.options ?? {},
    users: optionsData?.users ?? [],
    setores,

    data,
    detail,
    total: data?.total ?? 0,

    loading,
    loadingOptions,
    loadingDetail,
    error,

    search,
    setSearch,
    status,
    setStatus,
    grupo,
    setGrupo,
    tributacao,
    setTributacao,
    ramo,
    setRamo,
    perfil,
    setPerfil,

    limit,
    setLimit,
    offset,
    setOffset,

    loadMatrix,
    clearFilters,
    openDetail,
    closeDetail,

    saving,
    saveMatrix,
  };
}