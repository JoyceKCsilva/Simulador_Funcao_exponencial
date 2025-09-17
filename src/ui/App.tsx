import React, { useCallback, useMemo, useState } from 'react';
import { LockdownConfig, simularPandemia } from '../../pandemic_simulator';
import { LinhaChart } from './LinhaChart';
import { ParametrosForm } from './ParametrosForm';
import { PainelResumo } from './PainelResumo';

export const App: React.FC = () => {
  const [casosIniciais, setCasosIniciais] = useState(1000);
  const [semanasTotais, setSemanasTotais] = useState(52);
  const [taxaInicial, setTaxaInicial] = useState(1.2);
  const [lockdown, setLockdown] = useState<LockdownConfig>({
    habilitado: true,
    semanaInicio: 12,
    taxaFinal: 0.8, // Testagem em Massa - corresponde a uma das opções predefinidas
    duracaoTransicao: 6,
  });

  const resultado = useMemo(() => simularPandemia({ casosIniciais, semanasTotais, taxaInicial, lockdown }), [casosIniciais, semanasTotais, taxaInicial, lockdown]);

  const onToggleLockdown = useCallback((v: boolean) => setLockdown(l => ({ ...l, habilitado: v })), []);
  const updateLock = useCallback((p: Partial<LockdownConfig>) => setLockdown(l => ({ ...l, ...p })), []);

  return (
    <div className="layout">
      <div className="sidebar">
        <ParametrosForm
          valores={{ casosIniciais, semanasTotais, taxaInicial, lockdown }}
          onChangeCasos={setCasosIniciais}
          onChangeSemanas={setSemanasTotais}
          onChangeTaxa={setTaxaInicial}
          onToggleLockdown={onToggleLockdown}
          onChangeLockdown={updateLock}
        />
        <div className="footer-tip">Sugestão: ajuste a taxa inicial para testar cenários agressivos (&gt;1.5) ou controlados (&lt;1.1).</div>
      </div>
      <div className="chart-area">
        <div className="resumo" style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <PainelResumo titulo="Com Mitigação" mitigado resultado={resultado} />
          <PainelResumo titulo="Sem Mitigação" mitigado={false} resultado={resultado} />
        </div>
        <h2>Curva de Casos</h2>
        <LinhaChart dadosMitigado={resultado.serieMitigada} dadosSem={resultado.serieSemMitigacao} />
      </div>
    </div>
  );
};
