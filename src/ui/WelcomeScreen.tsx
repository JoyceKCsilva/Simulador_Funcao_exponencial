import React, { useState } from 'react';
import { ESTRATEGIAS } from './estrategias';
import { useTheme, getThemeColors } from './ThemeContext';
import { ThemeToggle } from './ThemeToggle';

interface Props {
  onIniciar: (dados: { estrategias: string[] }) => void;
  onSobreNos?: () => void;
  initialEstrategias?: string[];
}

const PRESETS: { id: string; nome: string; estrategias: string[]; desc: string }[] = [
  { id: 'sem', nome: 'Sem Mitigação', estrategias: [], desc: 'Crescimento exponencial puro para referência.' },
  { id: 'leve', nome: 'Mitigação Leve', estrategias: ['distanciamento','mascaras'], desc: 'Medidas comportamentais básicas.' },
  { id: 'forte', nome: 'Mitigação Forte', estrategias: ['distanciamento','mascaras','testagem','vacinas'], desc: 'Combinação robusta visando reduzir R < 1.' },
];

export const WelcomeScreen: React.FC<Props> = ({ onIniciar, onSobreNos, initialEstrategias }) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [selecionadas, setSelecionadas] = useState<string[]>(initialEstrategias && initialEstrategias.length ? initialEstrategias : ['distanciamento','mascaras']);
  const [presetAtivo, setPresetAtivo] = useState<string>('');

  function toggle(id: string) {
    setSelecionadas(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'stretch', 
      padding: 0, 
      overflow: 'hidden',
      background: colors.background,
      color: colors.text
    }}>
      <ThemeToggle />
      <div className="no-scrollbar" style={{ 
        flex: '0 1 960px', 
        maxWidth: 960, 
        margin: '0 auto', 
        padding: '32px 28px 40px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 28, 
        overflowY: 'auto' 
      }}>
      <header>
        <h1 style={{ margin: 0, fontSize: 34, color: colors.text }}>Simulador de Mitigação Pandêmica</h1>
        <p style={{ opacity: .8, lineHeight: 1.5, color: colors.textSecondary }}>Selecione um preset rápido ou escolha manualmente as estratégias abaixo. Você poderá mudar tudo depois na tela de simulação.</p>
      </header>

      <section>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: colors.text }}>Presets Rápidos</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {PRESETS.map(p => {
            const ativo = presetAtivo === p.id;
            return (
              <button key={p.id} type="button" onClick={() => {
                setPresetAtivo(p.id);
                setSelecionadas(p.estrategias);
              }} style={{
                background: ativo ? colors.primary : colors.backgroundCard,
                border: `1px solid ${colors.border}`,
                padding: '10px 14px',
                borderRadius: 8,
                cursor: 'pointer',
                minWidth: 160,
                textAlign: 'left',
                color: ativo ? '#ffffff' : colors.text
              }}>
                <strong>{p.nome}</strong><br />
                <span style={{ fontSize: 11, opacity: .7 }}>{p.desc}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: 20, marginBottom: 12, color: colors.text }}>Estratégias Manuais</h2>
        <p style={{ fontSize: 13, opacity: .8, marginTop: 0, color: colors.textSecondary }}>Marque ou desmarque livremente. Se você selecionar um preset e depois alterar algo, ele deixa de estar estritamente ativo.</p>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
          {ESTRATEGIAS.map(e => {
            const checked = selecionadas.includes(e.id);
            return (
              <label key={e.id} style={{
                border: `1px solid ${colors.border}`,
                padding: '10px 12px',
                borderRadius: 8,
                background: checked ? colors.backgroundSecondary : colors.backgroundCard,
                display: 'flex',
                gap: 10,
                cursor: 'pointer',
                alignItems: 'flex-start'
              }}>
                <input type="checkbox" checked={checked} onChange={() => toggle(e.id)} style={{ marginTop: 4 }} />
                <span style={{ fontSize: 13, color: colors.text }}>
                  <strong>{e.nome}</strong><br />
                  <span style={{ opacity: .75, color: colors.textSecondary }}>{e.descricao}</span><br />
                  <span style={{ fontSize: 11, opacity: .6, color: colors.textMuted }}>Multiplicador: {e.multiplicador}</span>
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <aside style={{ 
        background: colors.backgroundSecondary, 
        padding: 16, 
        borderRadius: 8, 
        fontSize: 13, 
        lineHeight: 1.5,
        color: colors.textSecondary,
        border: `1px solid ${colors.border}`
      }}>
        Mitigação em camadas: se a taxa inicial é R0 e você aplica estratégias com multiplicadores m1, m2, m3, a taxa efetiva tende a R0 * m1 * m2 * m3 após a fase de transição. Pequenas reduções acumuladas podem gerar quedas substanciais no longo prazo.
      </aside>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 'auto' }}>
        <div>
          {onSobreNos && (
            <button 
              type="button" 
              style={{ 
                background: colors.buttonSecondary, 
                color: colors.text,
                border: `1px solid ${colors.border}`,
                padding: '10px 16px',
                borderRadius: 6,
                fontSize: 14,
                cursor: 'pointer'
              }} 
              onClick={onSobreNos}
            >
              Sobre Nós
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            type="button" 
            style={{ 
              background: colors.buttonSecondary,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              padding: '10px 16px',
              borderRadius: 6,
              fontSize: 14,
              cursor: 'pointer'
            }} 
            onClick={() => { setSelecionadas([]); setPresetAtivo(''); }}
          >
            Limpar
          </button>
          <button 
            type="button" 
            onClick={() => onIniciar({ estrategias: selecionadas })} 
            style={{ 
              background: colors.primary,
              color: '#ffffff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: 6,
              fontSize: 14,
              cursor: 'pointer'
            }}
          >
            Iniciar Simulação
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};
