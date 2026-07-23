import { SlidersHorizontal, X } from "lucide-react";
import {
  filterModalOverlayStyle,
  filterModalStyle,
  filterModalHeaderStyle,
  filterModalKickerStyle,
  filterModalTitleStyle,
  filterModalSubtitleStyle,
  filterModalGridStyle,
  filterModalFooterStyle,
  filterGhostButtonStyle,
  filterApplyButtonStyle,
  clearButtonStyle,
  fieldStyle,
  fieldLabelStyle,
  inputStyle,
} from "../../styles/ExpectationMatrix.styled";

type Props = {
  status: string;
  setStatus: (value: string) => void;

  grupo: string;
  setGrupo: (value: string) => void;

  tributacao: string;
  setTributacao: (value: string) => void;

  ramo: string;
  setRamo: (value: string) => void;

  perfil: string;
  setPerfil: (value: string) => void;

  options: any;

  clearFilters: () => void;
  loadMatrix: (params?: any) => void;

  onClose: () => void;
};

export function AdvancedFiltersModal({
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
  options,
  clearFilters,
  loadMatrix,
  onClose,
}: Props) {


function formatStatusLabel(value: string) {
  const key = String(value || "")
    .trim()
    .toUpperCase();

  const labels: Record<string, string> = {
    ATIVA: "Ativa",
    SAIDA: "Saída",
    EM_SAIDA: "Em Saída",
    SUSPENSA: "Suspensa",
    SEM_MOVIMENTO: "Sem Movimento",
    PENDENTE: "Pendente de Documentação",
    BAIXADA: "Baixada",
    ENCERRADA: "Encerrada",
  };

  return labels[key] ?? value;
}



  return (
    <div style={filterModalOverlayStyle} onClick={onClose}>
      <div style={filterModalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={filterModalHeaderStyle}>
          <div>
            <div style={filterModalKickerStyle}>Filtros avançados</div>

            <h2 style={filterModalTitleStyle}>Refinar Matriz</h2>

            <p style={filterModalSubtitleStyle}>
              Selecione os critérios para encontrar empresas específicas na base.
            </p>
          </div>

          <button onClick={onClose} style={clearButtonStyle}>
            <X size={16} />
          </button>
        </div>

        <div style={filterModalGridStyle}>
          <label style={fieldStyle}>
          <span style={fieldLabelStyle}>Situação</span>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={inputStyle}
          >
            <option value="">Todas situações</option>

            <option value="ATIVA">Ativa</option>

            <option value="SUSPENSA">Suspensa</option>

            <option value="ENCERRADA">Encerrada</option>

            <option value="SEM_MOVIMENTO">
              Sem Movimento
            </option>

            <option value="EM_SAIDA">
              Em Saída
            </option>

            <option value="BAIXADA">
              Baixada
            </option>

            <option value="PENDENTE">
              Pendente de Documentação
            </option>
          </select>
        </label>

          <label style={fieldStyle}>
            <span style={fieldLabelStyle}>Grupo</span>

            <input
              placeholder="Grupo"
              value={grupo}
              onChange={(e) => setGrupo(e.target.value)}
              style={inputStyle}
            />
          </label>

          <label style={fieldStyle}>
            <span style={fieldLabelStyle}>Tributação</span>

            <select
              value={tributacao}
              onChange={(e) => setTributacao(e.target.value)}
              style={inputStyle}
            >
              <option value="">Todas</option>

              {(options?.tributacao ?? []).map((item: string) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          {/* <label style={fieldStyle}>
            <span style={fieldLabelStyle}>Ramo</span>

            <select
              value={ramo}
              onChange={(e) => setRamo(e.target.value)}
              style={inputStyle}
            >
              <option value="">Todos</option>

              {(options?.ramo ?? []).map((item: string) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label> */}

          <label style={fieldStyle}>
            <span style={fieldLabelStyle}>Perfil comercial</span>

            <select
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              style={inputStyle}
            >
              <option value="">Todos</option>

              {(options?.perfilComercial ?? []).map((item: string) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={filterModalFooterStyle}>
          <button onClick={clearFilters} style={filterGhostButtonStyle}>
            <X size={15} />
            Limpar filtros
          </button>

          <button
            onClick={() => {
              loadMatrix({ offset: 0 });
              onClose();
            }}
            style={filterApplyButtonStyle}
          >
            <SlidersHorizontal size={15} />
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  );
}