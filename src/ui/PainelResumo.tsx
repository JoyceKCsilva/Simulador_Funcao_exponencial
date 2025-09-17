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
          <div className="divider" style={{ margin: '8px 0', borderTop: '1px solid #eee' }}></div>
          <div className="stat melhoria" style={{ color: '#28a745', fontWeight: 'bold' }}>
            Melhoria: {pct.toFixed(1)}% menos casos
          </div>
          <div className="stat">Casos evitados: {Intl.NumberFormat('pt-BR').format(diff)}</div>
        </>
      )}

    </div>
  );
};
