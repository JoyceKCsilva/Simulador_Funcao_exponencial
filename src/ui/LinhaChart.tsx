import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PontoSemana } from '../../pandemic_simulator';
import { useTheme, getThemeColors } from './ThemeContext';

interface Props {
  dadosMitigado: PontoSemana[];
  dadosSem: PontoSemana[];
}

export const LinhaChart: React.FC<Props> = ({ dadosMitigado, dadosSem }) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  
  const data = dadosMitigado.map((p, idx) => ({
    semana: p.semana,
    mitigado: p.casos,
    sem: dadosSem[idx]?.casos ?? null,
  }));
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
        <CartesianGrid stroke={colors.border} strokeDasharray="3 3" />
        <XAxis dataKey="semana" stroke={colors.textSecondary} />
        <YAxis 
          stroke={colors.textSecondary} 
          tickFormatter={(v) => Intl.NumberFormat('pt-BR',{notation:'compact'}).format(v)} 
        />
        <Tooltip 
          formatter={(v: any) => Intl.NumberFormat('pt-BR').format(v as number)}
          contentStyle={{
            background: colors.backgroundCard,
            border: `1px solid ${colors.border}`,
            borderRadius: '4px',
            color: colors.text
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="sem" 
          stroke={colors.danger} 
          dot={false} 
          strokeWidth={4} 
          name="Sem Mitigação" 
        />
        <Line 
          type="monotone" 
          dataKey="mitigado" 
          stroke={colors.primary} 
          dot={false} 
          strokeWidth={4} 
          name="Com Mitigação" 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
