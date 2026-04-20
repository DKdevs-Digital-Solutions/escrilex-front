import React from "react";
import { Card, IconBtn } from "../ui";
import { UserPlus, Users, Pencil, Trash2 } from "lucide-react";

type Props = {
  socios: any[];
  onAdd: () => void;
  onEdit: (socio: any) => void;
  onDelete: (id: string) => void;
};

export function CompanyPartnersTab({
  socios,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
          gap: 12,
          flexWrap: "wrap",
          padding: "18px 10px",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Sócios / Responsáveis legais
          </h3>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 12.5,
              color: "#94a3b8",
            }}
          >
            {socios.length} sócio{socios.length !== 1 ? "s" : ""} cadastrado{socios.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          onClick={onAdd}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "15px 20px",
            fontSize: 13,
            fontWeight: 700,
            borderRadius: 12,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 8px 18px rgba(37,99,235,0.20)",
            bottom:10,
            position: "relative",
          }}
        >
          <UserPlus size={14} strokeWidth={2.5} />
          Adicionar sócio
        </button>
      </div>

      {socios.length === 0 ? (
        <Card>
          <div style={{ padding: "48px 24px", textAlign: "center" }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 16,
                background: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
              }}
            >
              <Users size={24} color="#94a3b8" strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#475569", marginBottom: 6 }}>
              Nenhum sócio cadastrado
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8" }}>
              Adicione os sócios e responsáveis legais desta empresa.
            </div>
          </div>
        </Card>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 16,
          }}
        >
          {socios.map((s) => (
            <Card key={s.id}>
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: "#dbeafe",
                    border: "1px solid #bfdbfe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "#1d4ed8",
                    fontWeight: 800,
                    fontSize: 16,
                  }}
                >
                  {(s.nomeCompleto || "?").charAt(0).toUpperCase()}
                </div>

                <div
                  style={{
                    flex: 1,
                    fontWeight: 800,
                    fontSize: 14.5,
                    color: "#0f172a",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.nomeCompleto}
                </div>

                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <IconBtn
                    icon={<Pencil size={13} strokeWidth={2} />}
                    title="Editar sócio"
                    onClick={() => onEdit(s)}
                  />
                  <IconBtn
                    icon={<Trash2 size={13} strokeWidth={2} />}
                    title="Remover sócio"
                    onClick={() => onDelete(s.id)}
                    variant="danger"
                  />
                </div>
              </div>

              <div
                style={{
                  padding: "14px 20px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px 20px",
                }}
              >
                {[
                  { label: "WhatsApp", value: s.whatsapp },
                  { label: "E-mail", value: s.email },
                  { label: "Telefone empresa", value: s.telefoneEmpresa },
                  {
                    label: "Nascimento",
                    value: s.dataNascimento
                      ? new Date(s.dataNascimento).toLocaleDateString("pt-BR")
                      : null,
                  },
                  { label: "Outros", value: s.outros },
                ]
                  .filter((f) => f.value)
                  .map((f, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#94a3b8",
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                        }}
                      >
                        {f.label}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          color: "#334155",
                          fontWeight: 500,
                        }}
                      >
                        {f.value}
                      </span>
                    </div>
                  ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}