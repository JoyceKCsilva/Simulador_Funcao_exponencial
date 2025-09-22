import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PontoSemana } from '../../pandemic_simulator';

interface Props {
  dadosMitigado: PontoSemana[];
  dadosSem: PontoSemana[];
}

export const LinhaChart: React.FC<Props> = ({ dadosMitigado, dadosSem }) => {
  const data = dadosMitigado.map((p, idx) => ({
    semana: p.semana,
    mitigado: p.casos,
    sem: dadosSem[idx]?.casos ?? null,
  }));
  return (
  <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
        <CartesianGrid stroke="#222" strokeDasharray="3 3" />
        <XAxis dataKey="semana" stroke="#ccc" />
        <YAxis stroke="#ccc" tickFormatter={(v) => Intl.NumberFormat('pt-BR',{notation:'compact'}).format(v)} />
        <Tooltip formatter={(v: any) => Intl.NumberFormat('pt-BR').format(v as number)} />
        <Legend />
        <Line type="monotone" dataKey="sem" stroke="#ef4444" dot={false} strokeWidth={2} name="Sem Mitigação" />
        <Line type="monotone" dataKey="mitigado" stroke="#3b82f6" dot={false} strokeWidth={2} name="Com Mitigação" />
      </LineChart>
    </ResponsiveContainer>
  );
};
