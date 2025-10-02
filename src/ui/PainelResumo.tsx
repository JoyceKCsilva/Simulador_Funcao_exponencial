import React from 'react';
import { ResultadoSimulacao } from '../../pandemic_simulator';
import { useTheme, getThemeColors } from './ThemeContext';

interface Props {
  titulo: string;
  mitigado: boolean;
  resultado: ResultadoSimulacao;
}

export const PainelResumo: React.FC<Props> = ({ titulo, mitigado, resultado }) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  
  const total = mitigado ? resultado.totalCasosMitigado : resultado.totalCasosSemMitigacao;
  const taxaFinal = resultado.taxaEquivalenteFinal;

  return (
    <div style={{
      background: colors.backgroundCard,
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px'
    }}>
      <h3 style={{ margin: 0, color: colors.text }}>{titulo}</h3>
      <div style={{ 
        margin: '8px 0 12px 0', 
        borderTop: `1px solid ${colors.border}`,
        height: '1px'
      }}></div>

      <div style={{ margin: '8px 0', color: colors.text }}>
        Total casos: <strong>{Intl.NumberFormat('pt-BR').format(total)}</strong>
      </div>

      {mitigado && (
        <>
          <div style={{ 
            margin: '8px 0',
            color: colors.success
          }}>
            Cenário base com intervenções
          </div>
          {taxaFinal && (
            <div style={{ 
              fontSize: '12px', 
              opacity: 0.75,
              color: colors.textMuted,
              margin: '8px 0'
            }}>
              Taxa efetiva alvo ≈ {taxaFinal.toFixed(2)}
            </div>
          )}
        </>
      )}

      {!mitigado && (
        <div style={{ 
          margin: '8px 0',
          color: colors.danger
        }}>
          Cenário base sem intervenções
        </div>
      )}
    </div>
  );
};

export const CardCasosEvitados: React.FC<{ resultado: ResultadoSimulacao }> = ({ resultado }) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  const diff = Math.max(0, resultado.totalCasosSemMitigacao - resultado.totalCasosMitigado);
  const pct = resultado.reducaoPercentual ?? 0;

  return (
    <div style={{
      background: colors.backgroundCard,
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px'
    }}>
      <h3 style={{ margin: 0, color: colors.text }}>Casos Evitados</h3>
      <div style={{ 
        margin: '8px 0 12px 0', 
        borderTop: `1px solid ${colors.border}`,
        height: '1px'
      }}></div>

      <div style={{ margin: '8px 0', color: colors.text }}>
        Total: <strong>{Intl.NumberFormat('pt-BR').format(diff)}</strong>
      </div>

      <div style={{ 
        color: colors.success, 
        fontWeight: 'bold',
        margin: '8px 0'
      }}>
        {pct.toFixed(1)}% menos casos
      </div>

      <div style={{ 
        fontSize: '12px',
        opacity: 0.75,
        color: colors.textMuted,
        margin: '8px 0'
      }}>
        Em relação ao cenário sem mitigação
      </div>
    </div>
  );
};