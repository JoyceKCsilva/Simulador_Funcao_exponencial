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
  const taxaFinal = resultado.taxaEquivalenteFinal;

  return (
    <div className="painel">
      <h3>{titulo}</h3>
      <div className="stat">Total casos: <strong>{Intl.NumberFormat('pt-BR').format(total)}</strong></div>
      {mitigado && (
        <>
          <div className="divider" style={{ margin: '8px 0', borderTop: '1px solid #2d3748' }}></div>
          <div className="stat melhoria" style={{ color: '#22c55e', fontWeight: 'bold' }}>
            {pct.toFixed(1)}% menos casos
          </div>
          <div className="stat">Casos evitados: {Intl.NumberFormat('pt-BR').format(diff)}</div>
          {taxaFinal && <div className="stat" style={{ fontSize: 12, opacity: .75 }}>Taxa efetiva alvo ≈ {taxaFinal.toFixed(2)}</div>}
        </>
      )}

    </div>
  );
};
