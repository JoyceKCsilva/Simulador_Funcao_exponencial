import React, { ChangeEvent } from 'react';
import { LockdownConfig } from '../../pandemic_simulator';

interface Props {
  valores: {
    casosIniciais: number;
    semanasTotais: number;
    taxaInicial: number;
    lockdown: LockdownConfig;
  };
  onChangeCasos: (v: number) => void;
  onChangeSemanas: (v: number) => void;
  onChangeTaxa: (v: number) => void;
  onToggleLockdown: (v: boolean) => void;
  onChangeLockdown: (p: Partial<LockdownConfig>) => void;
}

export const ParametrosForm: React.FC<Props> = ({ valores, onChangeCasos, onChangeSemanas, onChangeTaxa, onToggleLockdown, onChangeLockdown }) => {
  const { casosIniciais, semanasTotais, taxaInicial, lockdown } = valores;

  function num(e: ChangeEvent<HTMLInputElement>, cb: (v: number) => void, min?: number, max?: number) {
    let v = e.target.valueAsNumber;
    if (!isFinite(v)) v = 0;
    if (min !== undefined && v < min) v = min;
    if (max !== undefined && v > max) v = max;
    cb(v);
  }

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
        <input type="checkbox" checked={lockdown.habilitado} onChange={e => onToggleLockdown(e.target.checked)} id="ck-lock" />
        <label htmlFor="ck-lock">Ativar Mitigação</label>
      </div>

      {lockdown.habilitado && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>Semana Início</label>
          <input type="number" value={lockdown.semanaInicio} min={1} max={semanasTotais} onChange={e => onChangeLockdown({ semanaInicio: Math.min(e.target.valueAsNumber, semanasTotais) })} />

          <label>Taxa Final (R após)</label>
            <input step="0.01" type="number" value={lockdown.taxaFinal} min={0.1} max={taxaInicial} onChange={e => onChangeLockdown({ taxaFinal: Math.min(e.target.valueAsNumber, taxaInicial) })} />

          <label>Duração Transição (semanas)</label>
          <input type="number" value={lockdown.duracaoTransicao} min={0} max={semanasTotais} onChange={e => onChangeLockdown({ duracaoTransicao: Math.min(e.target.valueAsNumber, semanasTotais) })} />
        </div>
      )}

      <div className="divider" />
      <details>
        <summary>Filtros sugeridos / opções avançadas</summary>
        <ul style={{ fontSize: 12, paddingLeft: 16, lineHeight: 1.4 }}>
          <li>Limitar taxa inicial a um intervalo plausível (ex: 0.5 - 3.5)</li>
            <li>Adicionar ruído estocástico (variação aleatória semanal)</li>
            <li>Capacidade hospitalar e corte de taxa quando acima</li>
            <li>Vacinação progressiva reduzindo taxa em % / semana</li>
            <li>Reaplicação de lockdown se taxa voltar a subir</li>
        </ul>
      </details>
    </form>
  );
};
