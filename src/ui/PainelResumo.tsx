import React from 'react';
import { ResultadoSimulacao } from '../../pandemic_simulator';

interface Props {
  titulo: string;
  mitigado: boolean;
  resultado: ResultadoSimulacao;
}

export const PainelResumo: React.FC<Props> = ({ titulo, mitigado, resultado }) => {
  const total = mitigado ? resultado.totalCasosMitigado : resultado.totalCasosSemMitigacao;
  const diff = resultado.totalCasosSemMitigacao - resultado.totalCasosMitigado;
  const pct = resultado.reducaoPercentual;

  return (
    <div className="painel">
      <h3>{titulo}</h3>
      <div className="stat">Total casos: <strong>{Intl.NumberFormat('pt-BR').format(total)}</strong></div>
      {mitigado && (
        <>
          <div className="stat">Redução absoluta: {Intl.NumberFormat('pt-BR').format(diff)}</div>
          <div className="stat">Redução %: {pct.toFixed(2)}%</div>
        </>
      )}
      {!mitigado && (
        <div className="stat">Cenário base sem intervenções.</div>
      )}
    </div>
  );
};
