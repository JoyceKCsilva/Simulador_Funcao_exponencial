import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { simularPandemia, MitigacaoConfig } from '../../pandemic_simulator';
import { LinhaChart } from './LinhaChart';
import { ParametrosForm } from './ParametrosForm';
import { PainelResumo } from './PainelResumo';
import { WelcomeScreen } from './WelcomeScreen';
import { SobreNos } from './SobreNos';
import { ThemeToggle } from './ThemeToggle';
import { BackButton } from './BackButton';
import { useTheme, getThemeColors } from './ThemeContext';
import { ESTRATEGIAS } from './estrategias';

export const App: React.FC = () => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  
  const [currentPage, setCurrentPage] = useState<'welcome' | 'sobre' | 'sim'>(() => {
    const hash = window.location.hash;
    if (hash === '#sim') return 'sim';
    if (hash === '#sobre') return 'sobre';
    return 'welcome';
  });
  // Sincronizar com hash para permitir botão voltar do navegador
  useEffect(() => {
    function onHash() {
      const hash = window.location.hash;
      if (hash === '#sim') setCurrentPage('sim');
      else if (hash === '#sobre') setCurrentPage('sobre');
      else setCurrentPage('welcome');
    }
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  function irParaSimulador() {
    window.location.hash = '#sim';
  }

  function irParaWelcome() {
    window.location.hash = '#welcome';
  }

  function irParaSobre() {
    window.location.hash = '#sobre';
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

  if (currentPage === 'welcome') {
    return <WelcomeScreen
      initialEstrategias={mitigacao.estrategiasSelecionadas}
      onIniciar={({ estrategias }) => {
        setMitigacao(m => ({ ...m, estrategiasSelecionadas: estrategias, habilitada: estrategias.length > 0 }));
        irParaSimulador();
      }}
      onSobreNos={irParaSobre}
    />;
  }

  if (currentPage === 'sobre') {
    return <SobreNos onVoltar={irParaWelcome} />;
  }

  return (
    <div style={{ background: colors.background, color: colors.text, minHeight: '100vh' }}>
      <ThemeToggle />
      <BackButton 
        onClick={irParaWelcome} 
        position="fixed" 
        top="20px" 
        right="20px" 
      />
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '320px 1fr', 
        height: '100vh',
        gap: 0 
      }}>
        <div style={{ 
          background: colors.backgroundSecondary,
          borderRight: `1px solid ${colors.border}`,
          padding: '20px',
          overflowY: 'auto',
          maxHeight: '100vh'
        }}>
          <ParametrosForm
            valores={{ casosIniciais, semanasTotais, taxaInicial, mitigacao }}
            onChangeCasos={setCasosIniciais}
            onChangeSemanas={setSemanasTotais}
            onChangeTaxa={setTaxaInicial}
            onToggleMitigacao={onToggleMitigacao}
            onChangeMitigacao={updateMitigacao}
            estrategiasCatalogo={ESTRATEGIAS}
          />
          <div style={{ 
            fontSize: '12px', 
            opacity: 0.7, 
            marginTop: '16px',
            color: colors.textMuted
          }}>
            Sugestão: ajuste a taxa inicial para testar cenários agressivos (&gt;1.5) ou controlados (&lt;1.1).
          </div>
        </div>
        <div style={{ 
          padding: '20px',
          overflowY: 'auto',
          background: colors.background
        }}>
          <div style={{ marginBottom: '20px', paddingTop: '10px' }}>
            <h2 style={{ margin: 0, color: colors.text }}>Curva de Casos</h2>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <PainelResumo titulo="Com Mitigação" mitigado resultado={resultado} />
            <PainelResumo titulo="Sem Mitigação" mitigado={false} resultado={resultado} />
          </div>
          <div style={{ 
            height: '400px', 
            width: '100%',
            background: colors.backgroundCard,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '16px'
          }}>
            <LinhaChart dadosMitigado={resultado.serieMitigada} dadosSem={resultado.serieSemMitigacao} />
          </div>
        </div>
      </div>
    </div>
  );
};
