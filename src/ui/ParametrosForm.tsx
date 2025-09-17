import React, { ChangeEvent, useState, useEffect } from 'react';
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
  
  // Estratégias de mitigação com valores baseados em estudos reais
  const estrategiasMitigacao = [
    { valor: 0.6, label: 'Lockdown Rigoroso (R ≈ 0.6)' },
    { valor: 0.75, label: 'Vacinação em Massa (R ≈ 0.75)' },
    { valor: 0.4, label: 'Lockdown + Vacinação (R ≈ 0.4)' },
    { valor: 0.9, label: 'Distanciamento Social (R ≈ 0.9)' },
    { valor: 0.98, label: 'Uso de Máscaras (R ≈ 0.98)' },
    { valor: 0.8, label: 'Testagem em Massa (R ≈ 0.8)' },
  ];
  
  const [modoPersonalizado, setModoPersonalizado] = useState(false);
  
  // Verifica se o valor atual corresponde a alguma estratégia predefinida
  useEffect(() => {
    const estrategiaCorrespondente = estrategiasMitigacao.find(e => Math.abs(e.valor - lockdown.taxaFinal) < 0.01);
    setModoPersonalizado(!estrategiaCorrespondente);
  }, [lockdown.taxaFinal]);

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

          <label>Estratégia de Mitigação</label>
          <select 
            value={modoPersonalizado ? 'personalizado' : lockdown.taxaFinal.toString()}
            onChange={e => {
              const valor = e.target.value;
              if (valor === 'personalizado') {
                setModoPersonalizado(true);
                // Mantém o valor atual ou define um padrão
                if (lockdown.taxaFinal < 0.1 || lockdown.taxaFinal > taxaInicial) {
                  onChangeLockdown({ taxaFinal: 0.9 });
                }
              } else {
                setModoPersonalizado(false);
                onChangeLockdown({ taxaFinal: parseFloat(valor) });
              }
            }}
          >
            {estrategiasMitigacao.map(estrategia => (
              <option key={estrategia.valor} value={estrategia.valor}>
                {estrategia.label}
              </option>
            ))}
            <option value="personalizado">Personalizado</option>
          </select>

          {modoPersonalizado && (
            <>
              <label>Taxa Final Personalizada (R após)</label>
              <input 
                step="0.01" 
                type="number" 
                value={lockdown.taxaFinal} 
                min={0.1} 
                max={taxaInicial} 
                onChange={e => onChangeLockdown({ taxaFinal: Math.min(e.target.valueAsNumber, taxaInicial) })} 
              />
            </>
          )}

          <label>Duração Transição (semanas)</label>
          <input type="number" value={lockdown.duracaoTransicao} min={0} max={semanasTotais} onChange={e => onChangeLockdown({ duracaoTransicao: Math.min(e.target.valueAsNumber, semanasTotais) })} />
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
