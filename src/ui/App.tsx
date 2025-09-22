import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { simularPandemia, MitigacaoConfig } from '../../pandemic_simulator';
import { LinhaChart } from './LinhaChart';
import { ParametrosForm } from './ParametrosForm';
import { PainelResumo } from './PainelResumo';
import { WelcomeScreen } from './WelcomeScreen';
import { ESTRATEGIAS } from './estrategias';

export const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(() => {
    return window.location.hash !== '#sim';
  });
  // Sincronizar com hash para permitir botão voltar do navegador
  useEffect(() => {
    function onHash() {
      setShowWelcome(window.location.hash !== '#sim');
    }
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  function irParaSimulador() {
    if (window.location.hash !== '#sim') {
      window.location.hash = '#sim';
    } else {
      setShowWelcome(false);
    }
  }

  function irParaWelcome() {
    if (window.location.hash !== '#welcome') {
      window.location.hash = '#welcome';
    } else {
      setShowWelcome(true);
    }
  }
  // Defaults solicitados
  const [casosIniciais, setCasosIniciais] = useState(100);
  const [semanasTotais, setSemanasTotais] = useState(20);
  const [taxaInicial, setTaxaInicial] = useState(1.2);
  // objetivo removido – simplificação de escopo

  // Configuração de mitigação múltiplas estratégias
  const [mitigacao, setMitigacao] = useState<MitigacaoConfig>({
    habilitada: true,
    semanaInicio: 12,
    duracaoTransicao: 6,
    estrategiasSelecionadas: ['distanciamento', 'mascaras']
  });

  const resultado = useMemo(() => simularPandemia({
    casosIniciais,
    semanasTotais,
    taxaInicial,
    mitigacao,
    catalogoEstrategias: ESTRATEGIAS
  }), [casosIniciais, semanasTotais, taxaInicial, mitigacao]);

  const onToggleMitigacao = useCallback((v: boolean) => setMitigacao(m => ({ ...m, habilitada: v })), []);
  const updateMitigacao = useCallback((p: Partial<MitigacaoConfig>) => setMitigacao(m => ({ ...m, ...p })), []);

  if (showWelcome) {
    return <WelcomeScreen
      initialEstrategias={mitigacao.estrategiasSelecionadas}
      onIniciar={({ estrategias }) => {
        setMitigacao(m => ({ ...m, estrategiasSelecionadas: estrategias, habilitada: estrategias.length > 0 }));
        irParaSimulador();
      }} />;
  }

  return (
    <div className="layout">
      <div className="sidebar no-scrollbar">
        <ParametrosForm
          valores={{ casosIniciais, semanasTotais, taxaInicial, mitigacao }}
          onChangeCasos={setCasosIniciais}
          onChangeSemanas={setSemanasTotais}
          onChangeTaxa={setTaxaInicial}
          onToggleMitigacao={onToggleMitigacao}
          onChangeMitigacao={updateMitigacao}
          estrategiasCatalogo={ESTRATEGIAS}
        />
  {/* Objetivo removido */}
        <div className="footer-tip">Sugestão: ajuste a taxa inicial para testar cenários agressivos (&gt;1.5) ou controlados (&lt;1.1).</div>
      </div>
      <div className="chart-area">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Curva de Casos</h2>
          <button type="button" onClick={irParaWelcome} style={{ background: '#374151', padding: '6px 10px', borderRadius: 6 }}>Voltar</button>
        </div>
        <div className="resumo" style={{ display: 'flex', gap: '12px' }}>
          <PainelResumo titulo="Com Mitigação" mitigado resultado={resultado} />
          <PainelResumo titulo="Sem Mitigação" mitigado={false} resultado={resultado} />
        </div>
        <div className="chart-wrapper">
          <LinhaChart dadosMitigado={resultado.serieMitigada} dadosSem={resultado.serieSemMitigacao} />
        </div>
      </div>
    </div>
  );
};
