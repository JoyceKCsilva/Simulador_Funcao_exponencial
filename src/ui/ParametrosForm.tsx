import React, { ChangeEvent } from 'react';
import { MitigacaoConfig, EstrategiaMitigacao, calcularMultiplicadorEstrategias } from '../../pandemic_simulator';

interface Props {
  valores: {
    casosIniciais: number;
    semanasTotais: number;
    taxaInicial: number;
    mitigacao: MitigacaoConfig;
  };
  estrategiasCatalogo: EstrategiaMitigacao[];
  onChangeCasos: (v: number) => void;
  onChangeSemanas: (v: number) => void;
  onChangeTaxa: (v: number) => void;
  onToggleMitigacao: (v: boolean) => void;
  onChangeMitigacao: (p: Partial<MitigacaoConfig>) => void;
}

export const ParametrosForm: React.FC<Props> = ({ valores, estrategiasCatalogo, onChangeCasos, onChangeSemanas, onChangeTaxa, onToggleMitigacao, onChangeMitigacao }) => {
  const { casosIniciais, semanasTotais, taxaInicial, mitigacao } = valores;

  function num(e: ChangeEvent<HTMLInputElement>, cb: (v: number) => void, min?: number, max?: number) {
    let v = e.target.valueAsNumber;
    if (!isFinite(v)) v = 0;
    if (min !== undefined && v < min) v = min;
    if (max !== undefined && v > max) v = max;
    cb(v);
  }

  function toggleEstrategia(id: string) {
    if (!mitigacao.habilitada) return;
    const atual = new Set(mitigacao.estrategiasSelecionadas);
    if (atual.has(id)) {
      atual.delete(id);
    } else {
      atual.add(id);
    }
    onChangeMitigacao({ estrategiasSelecionadas: Array.from(atual) });
  }

  const multiplicadorPleno = calcularMultiplicadorEstrategias(mitigacao.estrategiasSelecionadas, estrategiasCatalogo);
  const taxaFinalEstimada = (taxaInicial * multiplicadorPleno).toFixed(2);

  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }} onSubmit={e => e.preventDefault()}>
      <h3>Parâmetros</h3>
      <label>Casos Iniciais</label>
      <input type="number" value={casosIniciais} min={1} onChange={e => num(e, onChangeCasos, 1)} />

      <label>Semanas Totais</label>
      <input type="number" value={semanasTotais} min={1} max={260} onChange={e => num(e, onChangeSemanas, 1, 260)} />

      <label>Taxa Inicial (R)</label>
      <input step="0.01" type="number" value={taxaInicial} min={0.1} max={5} onChange={e => num(e, onChangeTaxa, 0.1, 5)} />

      <div className="divider" />
      <div className="toggle-line">
        <input type="checkbox" checked={mitigacao.habilitada} onChange={e => onToggleMitigacao(e.target.checked)} id="ck-mit" />
        <label htmlFor="ck-mit">Ativar Mitigação</label>
      </div>

      {mitigacao.habilitada && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>Semana Início</label>
          <input type="number" value={mitigacao.semanaInicio} min={1} max={semanasTotais} onChange={e => onChangeMitigacao({ semanaInicio: Math.min(e.target.valueAsNumber, semanasTotais) })} />

          <label>Estratégias (checkbox – efeito cumulativo)</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {estrategiasCatalogo.map(est => {
              const active = mitigacao.estrategiasSelecionadas.includes(est.id);
              return (
                <label key={est.id} style={{ fontSize: 12, display: 'flex', gap: 6, alignItems: 'flex-start', cursor: 'pointer' }}>
                  <input type="checkbox" checked={active} onChange={() => toggleEstrategia(est.id)} />
                  <span style={{ lineHeight: 1.2 }}>
                    <strong>{est.nome}</strong> <span style={{ opacity: .7 }}>×{est.multiplicador}</span><br />
                    <span style={{ opacity: .65 }}>{est.descricao}</span>
                  </span>
                </label>
              );
            })}
          </div>

          <label>Duração Transição (semanas)</label>
          <input type="number" value={mitigacao.duracaoTransicao} min={0} max={semanasTotais} onChange={e => onChangeMitigacao({ duracaoTransicao: Math.min(e.target.valueAsNumber, semanasTotais) })} />

          <div style={{ fontSize: 12, background: '#111b27', padding: 8, borderRadius: 4, border: '1px solid #1e2a36' }}>
            Taxa estimada após transição completa: <strong>R ≈ {taxaFinalEstimada}</strong>
          </div>
        </div>
      )}

      <div className="divider" />
      <details>
        <summary>Filtros sugeridos / opções avançadas</summary>
        <ul style={{ fontSize: 12, paddingLeft: 16, lineHeight: 1.4 }}>
          <li>Limitar taxa inicial a um intervalo plausível (ex: 0.5 - 2.0)</li>
            <li>Adicionar ruído estocástico (variação aleatória semanal)</li>
            <li>Vacinação progressiva reduzindo taxa em % / semana</li>
        </ul>
      </details>
    </form>
  );
};
