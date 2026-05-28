import React from "react";
import { Card } from "../ui";
import {
  Pencil,
  Save,
  Building2,
  BadgeCheck,
  CalendarDays,
  Users,
  WalletCards,
  FileText,
  LockKeyhole,
  ShieldCheck,
  X,
  Eye,
  RotateCcw,
  Columns3,
  FileSpreadsheet,
} from "lucide-react";
import * as XLSX from "xlsx";

function DataField({
  label,
  value,
  editing,
  editValue,
  onEditChange,
  type = "text",
  highlight = false,
  multiline = false,
}: {
  label: string;
  value?: React.ReactNode;
  editing?: boolean;
  editValue?: string;
  onEditChange?: (v: string) => void;
  type?: string;
  highlight?: boolean;
  multiline?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: "14px 16px",
        borderRadius: 14,
        border: highlight ? "1px solid #dbeafe" : "1px solid #edf2f7",
        background: highlight ? "#f8fbff" : "#fff",
        minHeight: multiline ? 120 : 78,
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: 10.5,
          fontWeight: 800,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        {label}
      </span>

      {editing && onEditChange !== undefined ? (
        multiline ? (
          <textarea
            value={editValue ?? ""}
            onChange={(e) => onEditChange(e.target.value)}
            style={inputStyle}
          />
        ) : (
          <input
            type={type}
            value={editValue ?? ""}
            onChange={(e) => onEditChange(e.target.value)}
            style={inputStyle}
          />
        )
      ) : (
        <div
          style={{
            fontSize: highlight ? 14.5 : 13.5,
            color: "#0f172a",
            fontWeight: highlight ? 800 : 600,
            lineHeight: 1.35,
            wordBreak: "break-word",
          }}
        >
          {value ?? <span style={{ color: "#cbd5e1" }}>—</span>}
        </div>
      )}
    </div>
  );
}

function DataSelectField({
  label,
  value,
  editing,
  editValue,
  onEditChange,
  options,
  highlight = false,
}: {
  label: string;
  value?: React.ReactNode;
  editing?: boolean;
  editValue?: string;
  onEditChange?: (v: string) => void;
  options: { value: string; label: string }[];
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: "14px 16px",
        borderRadius: 14,
        border: highlight ? "1px solid #dbeafe" : "1px solid #edf2f7",
        background: highlight ? "#f8fbff" : "#fff",
        minHeight: 78,
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: 10.5,
          fontWeight: 800,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        {label}
      </span>

      {editing && onEditChange !== undefined ? (
        <select
          value={editValue ?? ""}
          onChange={(e) => onEditChange(e.target.value)}
          style={{
            ...inputStyle,
            height: 45,
            resize: "none",
          }}
        >
          {options.map((opt) => (
            <option key={`${label}-${opt.value}-${opt.label}`} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <div
          style={{
            fontSize: highlight ? 14.5 : 13.5,
            color: "#0f172a",
            fontWeight: highlight ? 800 : 600,
            lineHeight: 1.35,
            wordBreak: "break-word",
          }}
        >
          {value ?? <span style={{ color: "#cbd5e1" }}>—</span>}
        </div>
      )}
    </div>
  );
}

function SectionBlock({
  title,
  subtitle,
  icon,
  children,
  noBorder = false,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  noBorder?: boolean;
}) {
  return (
    <section
      className="section-user-dados"
      style={{
        margin: "18px 0px",
        padding: 0,
        borderRadius: 24,
        border: "1px solid rgba(226,232,240,.85)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,.96), rgba(248,250,252,.88))",
        boxShadow:
          "0 18px 45px rgba(15,23,42,.06), inset 0 1px 0 rgba(255,255,255,.9)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "20px 22px",
          borderBottom: "1px solid rgba(226,232,240,.75)",
          background:
            "linear-gradient(135deg, rgba(248,250,252,.96), rgba(255,255,255,.94))",
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
        }}
      >
        <span
          style={{
            width: 42,
            height: 42,
            borderRadius: 16,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, rgba(187,159,88,.16), rgba(250,204,21,.08))",
            color: "#8a6a1f",
            border: "1px solid rgba(187,159,88,.28)",
            boxShadow: "0 10px 24px rgba(187,159,88,.12)",
            flexShrink: 0,
          }}
        >
          {icon}
        </span>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 950,
              color: "#0f172a",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            {title}
          </div>

          {subtitle && (
            <div
              style={{
                marginTop: 5,
                fontSize: 12.5,
                color: "#64748b",
                lineHeight: 1.45,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          padding: 20,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 14,
        }}
      >
        {children}
      </div>
    </section>
  );
}



type Props = {
  company: any;
  canEdit: boolean;
  editing: boolean;
  editForm: any;
  setEditing: (v: boolean) => void;
  savingEdit: boolean;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  ef: (field: string) => (v: string) => void;
  fmtDate: (v?: string | null) => string | null;
};

const selectDefault = [{ value: "", label: "Selecione..." }];

const statusOptions = [
  ...selectDefault,
  { value: "ATIVA", label: "Ativa" },
  { value: "SAIDA", label: "Saída" },
  { value: "SUSPENSA", label: "Suspensa" },
  { value: "ENCERRADA", label: "Encerrada" },
  { value: "SEM_MOVIMENTO", label: "Sem Movimento" },
  { value: "EM_SAIDA", label: "Em Saída" },
  { value: "BAIXADA", label: "Baixada" },
  { value: "PENDENTE", label: "Pendente de Documentação" },
];

const matrizFilialOptions = [
  ...selectDefault,
  { value: "Matriz", label: "Matriz" },
  { value: "Filial", label: "Filial" },
  { value: "Matriz-Filial", label: "Matriz-Filial" },
  { value: "Pessoa Física", label: "Pessoa Física" },
];

const tributacaoOptions = [
  ...selectDefault,
  { value: "Simples Nacional", label: "Simples Nacional" },
  { value: "Lucro Presumido", label: "Lucro Presumido" },
  { value: "Lucro Real Trimestral", label: "Lucro Real Trimestral" },
  {
    value: "Lucro Real Anual (Estimativa Mensal)",
    label: "Lucro Real Anual (Estimativa Mensal)",
  },
];

const ramoOptions = [
  ...selectDefault,
  { value: "Serviço", label: "Serviço" },
  { value: "Comércio", label: "Comércio" },
  { value: "Indústria", label: "Indústria" },
  { value: "Serviço + Comércio", label: "Serviço + Comércio" },
  { value: "Serviço + Indústria", label: "Serviço + Indústria" },
  { value: "Comércio + Indústria", label: "Comércio + Indústria" },
  {
    value: "Serviço + Comércio + Indústria",
    label: "Serviço + Comércio + Indústria",
  },
];

const perfilOptions = [
  ...selectDefault,
  { value: "Black", label: "Black" },
  { value: "Blue", label: "Blue" },
  { value: "Light", label: "Light" },
];

const periodicidadeOptions = [
  ...selectDefault,
  { value: "Mensal", label: "Mensal" },
  { value: "Trimestral", label: "Trimestral" },
  { value: "Semestral", label: "Semestral" },
  { value: "Anual", label: "Anual" },
  { value: "Sob demanda", label: "Sob demanda" },
  { value: "Não se aplica", label: "Não se aplica" },
];

const consultoriaOptions = [
  ...selectDefault,
  { value: "24 horas", label: "24 horas" },
  { value: "48 horas", label: "48 horas" },
  { value: "Sob demanda", label: "Sob demanda" },
  { value: "Não se aplica", label: "Não se aplica" },
];

const yesNoOptions = [
  ...selectDefault,
  { value: "Sim", label: "Sim" },
  { value: "Não", label: "Não" },
];

const complexidadeOptions = [
  ...selectDefault,
  { value: "Baixa", label: "Baixa" },
  { value: "Média", label: "Média" },
  { value: "Alta", label: "Alta" },
  { value: "Não se aplica", label: "Não se aplica" },
];

const DEFAULT_VISIBLE_SECTIONS = {
  identificacao: true,
  acompanhamento: false,
  datas: false,
  responsaveis: true,
  financeiro: true,
  marketing: false,
  particularidades: false,
  acessos: true,
};

export function CompanyDataTab({
  company,
  canEdit,
  editing,
  editForm,
  setEditing,
  savingEdit,
  onStartEdit,
  onSaveEdit,
  ef,
  fmtDate,
}: Props) {
  

  return (
    <>
      <div
        className="section-user-dados"
        style={{
          padding: "24px 24px",
          borderBottom: "1px solid #eef2f7",
          background:
            "#fff",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 14,
          flexWrap: "wrap",
          borderRadius: 14,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 900,
              fontSize: 18,
              color: "#0f172a",
              lineHeight: 1.1,
            }}
          >
            Dados da empresa
          </div>

          <div
            style={{
              marginTop: 5,
              fontSize: 13,
              color: "#64748b",
            }}
          >
            Informações cadastrais, acompanhamento, responsáveis, financeiro e
            acessos.
          </div>
        </div>

        <div
          className="actions"
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
           




          {canEdit &&
            (editing ? (
              <>
                <button
                  className="btn"
                  onClick={() => setEditing(false)}
                  style={secondaryBtn}
                >
                  Cancelar
                </button>

                <button
                  className="btn"
                  onClick={onSaveEdit}
                  disabled={savingEdit}
                  style={{
                    ...primaryBtn,
                    opacity: savingEdit ? 0.5 : 1,
                  }}
                >
                  <Save size={13} strokeWidth={2} />
                  {savingEdit ? "Salvando..." : "Salvar"}
                </button>
              </>
            ) : (
              <button className="btn" onClick={onStartEdit} style={secondaryBtn}>
                <Pencil size={12} strokeWidth={2} />
                Editar
              </button>
            ))}
        </div>
      </div>

        <SectionBlock
          title="Identificação da Empresa"
          subtitle="Dados principais de cadastro e enquadramento."
          icon={<Building2 size={13} strokeWidth={2.3} />}
        >
          <DataField label="Código" value={company.cod} editing={editing} editValue={editForm.cod} onEditChange={ef("cod")} highlight />
          <DataField label="Empresa" value={company.razaoSocial} editing={editing} editValue={editForm.razaoSocial} onEditChange={ef("razaoSocial")} highlight />
          <DataField label="CNPJ/CPF" value={<span style={{ fontFamily: "monospace" }}>{company.cnpj}</span>} editing={editing} editValue={editForm.cnpj} onEditChange={ef("cnpj")} />
          <DataField label="IE" value={company.ieAtual} editing={editing} editValue={editForm.ieAtual} onEditChange={ef("ieAtual")} />
          <DataField label="Grupo" value={company.grupo} editing={editing} editValue={editForm.grupo} onEditChange={ef("grupo")} />
          <DataSelectField label="Matriz / Filial" value={company.filial} editing={editing} editValue={editForm.filial} onEditChange={ef("filial")} options={matrizFilialOptions} />
          <DataSelectField label="Tributação" value={company.tributacao} editing={editing} editValue={editForm.tributacao} onEditChange={ef("tributacao")} options={tributacaoOptions} />
          <DataSelectField label="Ramo" value={company.ramo} editing={editing} editValue={editForm.ramo} onEditChange={ef("ramo")} options={ramoOptions} />
        </SectionBlock>

        <SectionBlock
          title="Informações de Acompanhamento"
          subtitle="Status atual da empresa dentro do escritório."
          icon={<BadgeCheck size={13} strokeWidth={2.3} />}
        >
          <DataSelectField
            label="Status"
            value={company.situacao}
            editing={editing}
            editValue={editForm.situacao ?? editForm.status}
            onEditChange={ef("situacao")}
            options={statusOptions}
            highlight
          />
          <div /> 
        </SectionBlock>
      

        <SectionBlock
          title="Datas"
          subtitle="Entradas, saídas e períodos de cobrança por departamento."
          icon={<CalendarDays size={13} strokeWidth={2.3} />}
        >
          <DataField label="Data de entrada Fiscal" value={fmtDate(company.dataEntradaFiscal)} editing={editing} editValue={editForm.dataEntradaFiscal} onEditChange={ef("dataEntradaFiscal")} type="date" />
          <DataField label="Data de saída Fiscal" value={fmtDate(company.dataSaidaFiscal)} editing={editing} editValue={editForm.dataSaidaFiscal} onEditChange={ef("dataSaidaFiscal")} type="date" />
          <DataField label="Data de entrada Contábil" value={fmtDate(company.dataEntradaContabil)} editing={editing} editValue={editForm.dataEntradaContabil} onEditChange={ef("dataEntradaContabil")} type="date" />
          <DataField label="Data de saída Contábil" value={fmtDate(company.dataSaidaContabil)} editing={editing} editValue={editForm.dataSaidaContabil} onEditChange={ef("dataSaidaContabil")} type="date" />
          <DataField label="Data de entrada Folha" value={fmtDate(company.dataEntradaFolha)} editing={editing} editValue={editForm.dataEntradaFolha} onEditChange={ef("dataEntradaFolha")} type="date" />
          <DataField label="Data de saída Folha" value={fmtDate(company.dataSaidaFolha)} editing={editing} editValue={editForm.dataSaidaFolha} onEditChange={ef("dataSaidaFolha")} type="date" />
          <DataField label="Data de entrada Consultoria" value={fmtDate(company.dataEntradaConsultoria)} editing={editing} editValue={editForm.dataEntradaConsultoria} onEditChange={ef("dataEntradaConsultoria")} type="date" />
          <DataField label="Data de saída Consultoria" value={fmtDate(company.dataSaidaConsultoria)} editing={editing} editValue={editForm.dataSaidaConsultoria} onEditChange={ef("dataSaidaConsultoria")} type="date" />
          <DataField label="Início cobrança Fiscal" value={fmtDate(company.dataInicioCobrancaFiscal)} editing={editing} editValue={editForm.dataInicioCobrancaFiscal} onEditChange={ef("dataInicioCobrancaFiscal")} type="date" />
          <DataField label="Fim cobrança Fiscal" value={fmtDate(company.dataFimCobrancaFiscal)} editing={editing} editValue={editForm.dataFimCobrancaFiscal} onEditChange={ef("dataFimCobrancaFiscal")} type="date" />
          <DataField label="Início cobrança Contábil" value={fmtDate(company.dataInicioCobrancaContabil)} editing={editing} editValue={editForm.dataInicioCobrancaContabil} onEditChange={ef("dataInicioCobrancaContabil")} type="date" />
          <DataField label="Fim cobrança Contábil" value={fmtDate(company.dataFimCobrancaContabil)} editing={editing} editValue={editForm.dataFimCobrancaContabil} onEditChange={ef("dataFimCobrancaContabil")} type="date" />
          <DataField label="Início cobrança Folha" value={fmtDate(company.dataInicioCobrancaFolha)} editing={editing} editValue={editForm.dataInicioCobrancaFolha} onEditChange={ef("dataInicioCobrancaFolha")} type="date" />
          <DataField label="Fim cobrança Folha" value={fmtDate(company.dataFimCobrancaFolha)} editing={editing} editValue={editForm.dataFimCobrancaFolha} onEditChange={ef("dataFimCobrancaFolha")} type="date" />
          <DataField label="Início cobrança Consultoria" value={fmtDate(company.dataInicioCobrancaConsultoria)} editing={editing} editValue={editForm.dataInicioCobrancaConsultoria} onEditChange={ef("dataInicioCobrancaConsultoria")} type="date" />
          <DataField label="Fim cobrança Consultoria" value={fmtDate(company.dataFimCobrancaConsultoria)} editing={editing} editValue={editForm.dataFimCobrancaConsultoria} onEditChange={ef("dataFimCobrancaConsultoria")} type="date" />
        </SectionBlock>
      
        <SectionBlock
          title="Responsáveis Técnicos"
          subtitle="Carteira e responsáveis internos por área."
          icon={<Users size={13} strokeWidth={2.3} />}
        >
          <DataField label="Resp. Atendimento" value={company.respAtendimento} editing={editing} editValue={editForm.respAtendimento} onEditChange={ef("respAtendimento")} />
          <DataField label="Analista Líder Fiscal" value={company.analistaLiderFiscal} editing={editing} editValue={editForm.analistaLiderFiscal} onEditChange={ef("analistaLiderFiscal")} />
          <DataField label="Analista Líder Contábil" value={company.analistaLiderContabil} editing={editing} editValue={editForm.analistaLiderContabil} onEditChange={ef("analistaLiderContabil")} />
          <DataField label="Resp. Fec. RH" value={company.respFecRh} editing={editing} editValue={editForm.respFecRh} onEditChange={ef("respFecRh")} />
          <DataField label="Resp. Fec. Fiscal" value={company.respFecFiscal} editing={editing} editValue={editForm.respFecFiscal} onEditChange={ef("respFecFiscal")} />
          <DataField label="Resp. Fec. Contábil" value={company.respFecContabil} editing={editing} editValue={editForm.respFecContabil} onEditChange={ef("respFecContabil")} />
          <DataField label="Resp. Compliance" value={company.respCompliance} editing={editing} editValue={editForm.respCompliance} onEditChange={ef("respCompliance")} />
          <DataField label="Resp. Qualidade" value={company.respQualidade} editing={editing} editValue={editForm.respQualidade} onEditChange={ef("respQualidade")} />
        </SectionBlock>
      

        <SectionBlock
          title="Informações Financeiras"
          subtitle="Perfil comercial, cobranças, complexidade e acompanhamento financeiro."
          icon={<WalletCards size={13} strokeWidth={2.3} />}
        >
          <DataSelectField label="Perfil Comercial" value={company.perfil} editing={editing} editValue={editForm.perfil} onEditChange={ef("perfil")} options={perfilOptions} highlight />
          <DataSelectField label="Reuniões Fechamentos" value={company.reunioesFechamentos} editing={editing} editValue={editForm.reunioesFechamentos} onEditChange={ef("reunioesFechamentos")} options={periodicidadeOptions} />
          <DataSelectField label="Consultoria" value={company.consultoria} editing={editing} editValue={editForm.consultoria} onEditChange={ef("consultoria")} options={consultoriaOptions} />
          <DataField label="Quantidade de Folha" value={company.qtdeFolha} editing={editing} editValue={String(editForm.qtdeFolha ?? "")} onEditChange={ef("qtdeFolha")} type="number" />
          <DataSelectField label="Fechamento Contábil" value={company.fechamentoContabil} editing={editing} editValue={editForm.fechamentoContabil} onEditChange={ef("fechamentoContabil")} options={periodicidadeOptions} />
          <DataSelectField label="Análise Compliance" value={company.analiseCompliance} editing={editing} editValue={editForm.analiseCompliance} onEditChange={ef("analiseCompliance")} options={periodicidadeOptions} />
          <DataSelectField label="Cobrança Serv. Extras" value={company.cobrancaServExtras} editing={editing} editValue={editForm.cobrancaServExtras} onEditChange={ef("cobrancaServExtras")} options={yesNoOptions} />
          <DataSelectField label="Complexidade Fiscal" value={company.complexidadeFiscal} editing={editing} editValue={editForm.complexidadeFiscal} onEditChange={ef("complexidadeFiscal")} options={complexidadeOptions} />
          <DataSelectField label="Complexidade Contábil" value={company.complexidadeContabil} editing={editing} editValue={editForm.complexidadeContabil} onEditChange={ef("complexidadeContabil")} options={complexidadeOptions} />
        </SectionBlock>
      

        <SectionBlock
          title="Informações área de negócios / marketing"
          subtitle="Campos restritos para contexto comercial e relacionamento."
          icon={<ShieldCheck size={13} strokeWidth={2.3} />}
        >
          <DataField label="Motivo da entrada" value={company.motivoEntrada} editing={editing} editValue={editForm.motivoEntrada} onEditChange={ef("motivoEntrada")} multiline />
          <DataField label="Motivo da saída" value={company.motivoSaida} editing={editing} editValue={editForm.motivoSaida} onEditChange={ef("motivoSaida")} multiline />
        </SectionBlock>
      

        <SectionBlock
          title="Particularidades da Empresa"
          subtitle="Observações importantes para operação e atendimento."
          icon={<FileText size={13} strokeWidth={2.3} />}
        >
          <DataField label="Observações" value={company.observacoes} editing={editing} editValue={editForm.observacoes} onEditChange={ef("observacoes")} multiline highlight />
        </SectionBlock>
      

        <SectionBlock
          title="Acessos"
          subtitle="Credenciais e acessos operacionais. Recomenda-se exibir apenas para usuários autorizados."
          icon={<LockKeyhole size={13} strokeWidth={2.3} />}
          noBorder
        >
          <DataField label="Prefeitura" value={company.prefeitura} editing={editing} editValue={editForm.prefeitura} onEditChange={ef("prefeitura")} />
          <DataField label="Login Prefeitura" value={company.prefeituraLogin} editing={editing} editValue={editForm.prefeituraLogin} onEditChange={ef("prefeituraLogin")} />
          <DataField label="Senha Prefeitura" value={company.prefeituraSenha ? "••••••••" : null} editing={editing} editValue={editForm.prefeituraSenha} onEditChange={ef("prefeituraSenha")} type="password" />
          <DataField label="Sefaz" value={company.sefaz} editing={editing} editValue={editForm.sefaz} onEditChange={ef("sefaz")} />
          <DataField label="Login Sefaz" value={company.sefazLogin} editing={editing} editValue={editForm.sefazLogin} onEditChange={ef("sefazLogin")} />
          <DataField label="Senha Sefaz" value={company.sefazSenha ? "••••••••" : null} editing={editing} editValue={editForm.sefazSenha} onEditChange={ef("sefazSenha")} type="password" />
        </SectionBlock>
      
      
    </>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 11px",
  fontSize: 13,
  borderRadius: 10,
  border: "1.5px solid #BB9F58",
  outline: "none",
  fontFamily: "inherit",
  background: "#fff",
  color: "#0f172a",
  width: "100%",
  minHeight: 45,
  resize: "vertical",
  boxSizing: "border-box",
};

const secondaryBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "12px 18px",
  fontSize: 12.5,
  fontWeight: 700,
  borderRadius: 10,
  border: "2px solid #ccc",
  background: "#fff",
  color: "#374151",
  cursor: "pointer",
  fontFamily: "inherit",
};

const primaryBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "12px 18px",
  fontSize: 12.5,
  fontWeight: 700,
  borderRadius: 10,
  border: "none",
  background: "#012942",
  color: "#fff",
  cursor: "pointer",
  fontFamily: "inherit",
};

const panelOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  background: "rgba(15,23,42,.45)",
  backdropFilter: "blur(5px)",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "stretch",
};

const columnsPanelStyle: React.CSSProperties = {
  width: "min(460px, 100%)",
  height: "100vh",
  overflow: "auto",
  background: "#fff",
  borderLeft: "1px solid rgba(226,232,240,.9)",
  boxShadow: "-24px 0 70px rgba(15,23,42,.25)",
  animation: "drawerIn .22s ease-out",
};

const columnsPanelHeaderStyle: React.CSSProperties = {
  padding: "22px 22px 16px",
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  borderBottom: "1px solid #eef2f7",
};

const panelKickerStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 900,
  color: "#BB9F58",
  textTransform: "uppercase",
  letterSpacing: ".12em",
  marginBottom: 6,
};

const panelTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 20,
  lineHeight: 1.1,
  fontWeight: 900,
  color: "#0f172a",
};

const panelSubtitleStyle: React.CSSProperties = {
  margin: "8px 0 0",
  fontSize: 13,
  lineHeight: 1.45,
  color: "#64748b",
};

const clearButtonStyle: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  background: "#fff",
  color: "#64748b",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const columnsPanelActionsStyle: React.CSSProperties = {
  padding: "14px 22px",
  borderBottom: "1px solid #eef2f7",
  display: "flex",
};

const softActionButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 13px",
  borderRadius: 12,
  border: "1px solid rgba(187,159,88,.35)",
  background: "rgba(187,159,88,.10)",
  color: "#7c5f18",
  cursor: "pointer",
  fontSize: 12.5,
  fontWeight: 800,
  fontFamily: "inherit",
};

const columnsListStyle: React.CSSProperties = {
  padding: 16,
  display: "grid",
  gap: 10,
};

const columnRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "13px 14px",
  borderRadius: 16,
  border: "1px solid #e2e8f0",
  cursor: "pointer",
  transition: "all .16s ease",
};

const columnLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 900,
  color: "#0f172a",
  lineHeight: 1.2,
};

const columnKeyStyle: React.CSSProperties = {
  display: "block",
  marginTop: 3,
  fontSize: 11.5,
  color: "#94a3b8",
  fontWeight: 700,
};

const columnTypeBadgeStyle: React.CSSProperties = {
  padding: "4px 8px",
  borderRadius: 999,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#64748b",
  fontSize: 10.5,
  fontWeight: 900,
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};