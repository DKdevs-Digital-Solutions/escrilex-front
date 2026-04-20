import React from "react";
import { Card } from "../ui";
import { Pencil, Save, Building2, BadgeCheck, Briefcase, CalendarDays } from "lucide-react";

function DataField({
  label,
  value,
  editing,
  editValue,
  onEditChange,
  type = "text",
  highlight = false,
}: {
  label: string;
  value?: React.ReactNode;
  editing?: boolean;
  editValue?: string;
  onEditChange?: (v: string) => void;
  type?: string;
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
        transition: "all 0.15s ease",
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
        <input
          type={type}
          value={editValue ?? ""}
          onChange={(e) => onEditChange(e.target.value)}
          style={{
            padding: "10px 11px",
            fontSize: 13,
            borderRadius: 10,
            border: "1.5px solid #2563eb",
            outline: "none",
            fontFamily: "inherit",
            background: "#fff",
            color: "#0f172a",
            boxShadow: "0 0 0 3px rgba(37,99,235,0.10)",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
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
    <div
      style={{
        padding: "22px 24px",
        borderBottom: noBorder ? "none" : "1px solid #f1f5f9",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              fontWeight: 800,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 6,
            }}
          >
            {icon && (
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 8,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#eff6ff",
                  color: "#2563eb",
                  border: "1px solid #dbeafe",
                  flexShrink: 0,
                }}
              >
                {icon}
              </span>
            )}
            {title}
          </div>

          {subtitle && (
            <div
              style={{
                fontSize: 13,
                color: "#64748b",
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        {children}
      </div>
    </div>
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
    <Card
      style={{
        borderRadius: 18,
        border: "1px solid #e5e7eb",
        background: "linear-gradient(180deg, #ffffff 0%, #fcfdff 100%)",
        boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
        overflow: "hidden",
        padding: 0,
      }}
    >
      <div
        style={{
          padding: "24px 24px",
          borderBottom: "1px solid #eef2f7",
          background:
            "linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(255,255,255,1) 100%)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              borderRadius: 999,
              background: "#eff6ff",
              color: "#1d4ed8",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              border: "1px solid #bfdbfe",
              marginBottom: 10,
            }}
          >
            <Building2 size={14} strokeWidth={2.3} />
            Dados da empresa
          </div>

          <div
            style={{
              fontWeight: 900,
              fontSize: 18,
              color: "#0f172a",
              lineHeight: 1.1,
            }}
          >
            Informações cadastrais
          </div>

          <div
            style={{
              marginTop: 5,
              fontSize: 13,
              color: "#64748b",
            }}
          >
            Dados principais, fiscais, comerciais e datas relevantes da empresa.
          </div>
        </div>

        {canEdit &&
          (editing ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => setEditing(false)} style={secondaryBtn}>
                Cancelar
              </button>
              <button
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
            </div>
          ) : (
            <button onClick={onStartEdit} style={secondaryBtn}>
              <Pencil size={12} strokeWidth={2} />
              Editar
            </button>
          ))}
      </div>

      <SectionBlock
        title="Identificação"
        subtitle="Informações principais de cadastro e estrutura da empresa."
        icon={<Building2 size={13} strokeWidth={2.3} />}
      >
        <DataField
          label="Razão social"
          value={company.razaoSocial}
          editing={editing}
          editValue={editForm.razaoSocial}
          onEditChange={ef("razaoSocial")}
          highlight
        />
        <DataField
          label="Nome fantasia"
          value={company.nomeFantasia}
          editing={editing}
          editValue={editForm.nomeFantasia}
          onEditChange={ef("nomeFantasia")}
          highlight
        />
        <DataField
          label="CNPJ"
          value={<span style={{ fontFamily: "monospace" }}>{company.cnpj}</span>}
          highlight
        />
        <DataField
          label="Código"
          value={company.cod}
          editing={editing}
          editValue={editForm.cod}
          onEditChange={ef("cod")}
        />
        <DataField
          label="Filial"
          value={company.filial}
          editing={editing}
          editValue={editForm.filial}
          onEditChange={ef("filial")}
        />
        <DataField
          label="Grupo"
          value={company.grupo}
          editing={editing}
          editValue={editForm.grupo}
          onEditChange={ef("grupo")}
        />
      </SectionBlock>

      <SectionBlock
        title="Fiscal e tributação"
        subtitle="Dados fiscais utilizados no enquadramento e controle tributário."
        icon={<BadgeCheck size={13} strokeWidth={2.3} />}
      >
        <DataField
          label="Tributação"
          value={company.tributacao}
          editing={editing}
          editValue={editForm.tributacao}
          onEditChange={ef("tributacao")}
          highlight
        />
        <DataField
          label="IE Atual"
          value={company.ieAtual}
          editing={editing}
          editValue={editForm.ieAtual}
          onEditChange={ef("ieAtual")}
        />
        <DataField
          label="Data Tributação"
          value={fmtDate(company.dataTributacao)}
          editing={editing}
          editValue={editForm.dataTributacao}
          onEditChange={ef("dataTributacao")}
          type="date"
        />
      </SectionBlock>

      <SectionBlock
        title="Situação no escritório"
        subtitle="Contexto atual da empresa dentro do fluxo interno do escritório."
        icon={<BadgeCheck size={13} strokeWidth={2.3} />}
      >
        <DataField
          label="Motivo de Entrada"
          value={company.motivoEntrada}
          editing={editing}
          editValue={editForm.motivoEntrada}
          onEditChange={ef("motivoEntrada")}
        />
        <DataField
          label="Situação"
          value={company.situacao}
          editing={editing}
          editValue={editForm.situacao}
          onEditChange={ef("situacao")}
          highlight
        />
        <DataField
          label="Data da Situação"
          value={fmtDate(company.dataSituacao)}
          editing={editing}
          editValue={editForm.dataSituacao}
          onEditChange={ef("dataSituacao")}
          type="date"
        />
      </SectionBlock>

      <SectionBlock
        title="Operacional e comercial"
        subtitle="Informações de operação, perfil e relacionamento comercial."
        icon={<Briefcase size={13} strokeWidth={2.3} />}
      >
        <DataField
          label="Ramo"
          value={company.ramo}
          editing={editing}
          editValue={editForm.ramo}
          onEditChange={ef("ramo")}
        />
        <DataField
          label="Consultoria"
          value={company.consultoria}
          editing={editing}
          editValue={editForm.consultoria}
          onEditChange={ef("consultoria")}
        />
        <DataField
          label="Banco"
          value={company.banco}
          editing={editing}
          editValue={editForm.banco}
          onEditChange={ef("banco")}
        />
        <DataField
          label="Licitação"
          value={company.licitacao}
          editing={editing}
          editValue={editForm.licitacao}
          onEditChange={ef("licitacao")}
        />
        <DataField
          label="Perfil"
          value={company.perfil}
          editing={editing}
          editValue={editForm.perfil}
          onEditChange={ef("perfil")}
          highlight
        />
        <DataField
          label="Qtde Folha"
          value={company.qtdeFolha}
          editing={editing}
          editValue={String(editForm.qtdeFolha ?? "")}
          onEditChange={ef("qtdeFolha")}
          type="number"
        />
        <DataField
          label="Resp. Comercial"
          value={company.responsavelComercial}
          editing={editing}
          editValue={editForm.responsavelComercial}
          onEditChange={ef("responsavelComercial")}
        />
      </SectionBlock>

      <SectionBlock
        title="Datas"
        subtitle="Principais marcos de entrada e cobrança."
        icon={<CalendarDays size={13} strokeWidth={2.3} />}
        noBorder
      >
        <DataField
          label="Data de Entrada"
          value={fmtDate(company.dataEntrada)}
          editing={editing}
          editValue={editForm.dataEntrada}
          onEditChange={ef("dataEntrada")}
          type="date"
          highlight
        />
        <DataField
          label="Início Cobrança"
          value={fmtDate(company.dataInicioCobranca)}
          editing={editing}
          editValue={editForm.dataInicioCobranca}
          onEditChange={ef("dataInicioCobranca")}
          type="date"
        />
        <DataField
          label="Fim Cobrança"
          value={fmtDate(company.dataFimCobranca)}
          editing={editing}
          editValue={editForm.dataFimCobranca}
          onEditChange={ef("dataFimCobranca")}
          type="date"
        />
      </SectionBlock>
    </Card>
  );
}

const secondaryBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "12px 18px",
  fontSize: 12.5,
  fontWeight: 700,
  borderRadius: 10,
  border: "1px solid #e2e8f0",
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
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
  fontFamily: "inherit",
  boxShadow: "0 10px 24px rgba(37,99,235,0.18)",
};