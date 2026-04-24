import React from "react";
import { Modal } from "../Modal";
import { Input, Select, FormGrid } from "../ui";
import { Plus, Search, Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  saving: boolean;
  loadingCnpj: boolean;
  onSubmit: (payload: any) => void;
  onBuscarCnpj: (cnpj: string) => void;
};

export function CompanyFormModal({
  open,
  onClose,
  form,
  setForm,
  saving,
  loadingCnpj,
  onSubmit,
  onBuscarCnpj,
}: Props) {

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev: any) => ({ ...prev, [field]: e.target.value }));
  }

  function maskCNPJ(value: string) {
  const v = value.replace(/\D/g, "").slice(0, 14);

  return v
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

const cnpjOnlyNumbers = form.cnpj.replace(/\D/g, "");
const isCnpjValid = cnpjOnlyNumbers.length === 14;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nova empresa"
      width={800}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} style={btnSecondary}>
            Cancelar
          </button>

          <button
            onClick={onSubmit}
            disabled={saving || form.cnpj.replace(/\D/g, "").length < 8}
            style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}
          >
            {saving ? <Loader2 size={14} className="spin" /> : <Plus size={14} />}
            {saving ? "Salvando..." : "Cadastrar"}
          </button>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* 🔷 CNPJ */}
        <Section title="Consulta CNPJ">
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
                <Input
                label="CNPJ *"
                placeholder="00.000.000/0000-00"
                value={form.cnpj}
                onChange={(e) =>
                    setForm((p: any) => ({
                    ...p,
                    cnpj: maskCNPJ(e.target.value),
                    }))
                }
                style={{ height: 48 }}
                />
            </div>

            <button
                onClick={() => onBuscarCnpj(form.cnpj)}
                disabled={loadingCnpj || !isCnpjValid}
                style={{
                ...btnSearch,
                height: 48,
                alignSelf: "flex-end",
                opacity: loadingCnpj || !isCnpjValid ? 0.5 : 1,
                cursor: loadingCnpj || !isCnpjValid ? "not-allowed" : "pointer",
                }}
            >
                {loadingCnpj ? (
                <Loader2 size={16} className="spin" />
                ) : (
                <Search size={16} />
                )}
                Buscar
            </button>
            </div>
        </Section>

        {/* 🔷 IDENTIFICAÇÃO */}
        <Section title="Dados da empresa">
          <FormGrid cols={3}>
            <div style={{ gridColumn: "span 2" }}>
              <Input label="Razão social" style={{ height: 48 }} value={form.razaoSocial} onChange={set("razaoSocial")} />
            </div>
            <Input label="Código" style={{ height: 48 }} value={form.cod} onChange={set("cod")} />
          </FormGrid>

          <FormGrid>
            <Input label="Nome fantasia" style={{ height: 48 }} value={form.nomeFantasia} onChange={set("nomeFantasia")} />
            <Input label="Grupo" style={{ height: 48 }} value={form.grupo} onChange={set("grupo")} />
          </FormGrid>

          <FormGrid>
            <Select label="Filial" value={form.filial} style={{height:48}} onChange={set("filial")}>
              <option value="">Selecione...</option>
              <option value="Matriz">Matriz</option>
              <option value="Filial">Filial</option>
            </Select>

            <Input label="Responsável" style={{ height: 48 }} value={form.responsavelComercial} onChange={set("responsavelComercial")} />
          </FormGrid>
        </Section>

        {/* 🔷 FISCAL */}
        <Section title="Fiscal / Tributação">
          <FormGrid cols={3}>
            <Select label="Tributação" style={{height:48}} value={form.tributacao} onChange={set("tributacao")}>
              <option value="">Selecione...</option>
              <option value="SIMPLES">Simples</option>
              <option value="PRESUMIDO">Presumido</option>
              <option value="REAL">Real</option>
            </Select>

            <Input style={{ height: 48 }} label="IE Atual" value={form.ieAtual} onChange={set("ieAtual")} />

            <Input style={{ height: 48 }} type="date" label="Data tributação" value={form.dataTributacao} onChange={set("dataTributacao")} />
          </FormGrid>
        </Section>

        {/* 🔷 SITUAÇÃO */}
        <Section title="Situação">
          <FormGrid cols={3}>
            <Select style={{ height: 48 }} label="Situação" value={form.situacao} onChange={set("situacao")}>
              <option value="">Selecione...</option>
              <option value="ATIVA">Ativa</option>
              <option value="SAIDA">Saída</option>
              <option value="SUSPENSA">Suspensa</option>
              <option value="ENCERRADA">Encerrada</option>
            </Select>

            <Input style={{ height: 48 }} type="date" label="Data situação" value={form.dataSituacao} onChange={set("dataSituacao")} />

            <Select style={{ height: 48 }} label="Motivo entrada" value={form.motivoEntrada} onChange={set("motivoEntrada")}>
              <option value="">Selecione...</option>
              <option value="CONSTITUIÇÃO">Constituição</option>
              <option value="TRANSFERÊNCIA">Transferência</option>
              <option value="INDICAÇÃO">Indicação</option>
            </Select>
          </FormGrid>
        </Section>

        {/* 🔷 OPERACIONAL */}
        <Section title="Operacional">
          <FormGrid cols={3} >
            <Input style={{ height: 48 }} label="Ramo" value={form.ramo} onChange={set("ramo")} />
            <Input style={{ height: 48 }} label="Consultoria" value={form.consultoria} onChange={set("consultoria")} />
            <Input style={{ height: 48 }} label="Qtde folha" value={form.qtdeFolha} onChange={set("qtdeFolha")} />
          </FormGrid>

          <FormGrid cols={3}>
            <Select style={{ height: 48 }} label="Banco" value={form.banco} onChange={set("banco")}>
              <option value="">Selecione...</option>
              <option value="SIM">Sim</option>
              <option value="NÃO">Não</option>
            </Select>

            <Select style={{ height: 48 }} label="Licitação" value={form.licitacao} onChange={set("licitacao")}>
              <option value="">Selecione...</option>
              <option value="SIM">Sim</option>
              <option value="NÃO">Não</option>
            </Select>

            <Input style={{ height: 48 }} label="Perfil" value={form.perfil} onChange={set("perfil")} />
          </FormGrid>
        </Section>

        {/* 🔷 DATAS */}
        <Section title="Datas importantes">
          <FormGrid cols={3} >
            <Input style={{ height: 48 }} type="date" label="Entrada" value={form.dataEntrada} onChange={set("dataEntrada")} />
            <Input style={{ height: 48 }} type="date" label="Início cobrança" value={form.dataInicioCobranca} onChange={set("dataInicioCobranca")} />
            <Input style={{ height: 48 }} type="date" label="Fim cobrança" value={form.dataFimCobranca} onChange={set("dataFimCobranca")} />
          </FormGrid>
        </Section>

      </div>
    </Modal>
  );
}




function Section({ title, children }: any) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: 16,
        background: "#fafafa",
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 12,
          color: "#0f172a",
        }}
      >
        {title}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {children}
      </div>
    </div>
  );
}




/* estilos reutilizáveis */
const btnPrimary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "9px 16px",
  borderRadius: 10,
  border: "none",
  background: "#012942", // Dourado para o destaque principal
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(187, 159, 88, 0.25)",
};

const btnSecondary: React.CSSProperties = {
  padding: "9px 16px",
  borderRadius: 10,
  border: "2px solid #ccc", // Borda no azul marinho
  background: "transparent",
  color: "#012942",             // Texto no azul marinho
  fontWeight: 600,
  cursor: "pointer",
};

const btnSearch: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "0 14px",
  height: 42,
  borderRadius: 10,
  border: "1.5px solid #012942", // Borda azul para seriedade
  background: "#012942",         // Fundo azul marinho
  color: "#fff",                 // Texto branco para contraste
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.15s",
};