import React, { useState } from 'react';
import { ESTRATEGIAS } from './estrategias';
import { useTheme, getThemeColors } from './ThemeContext';
import { ThemeToggle } from './ThemeToggle';

interface Props {
  onIniciar: (dados: { estrategias: string[] }) => void;
  onSobreNos?: () => void;
  initialEstrategias?: string[];
}

const PRESETS: { id: string; nome: string; estrategias: string[]; desc: string; emoji: string }[] = [
  { id: 'sem',   nome: 'Sem Medidas',       estrategias: [],                                         desc: 'Veja o que aconteceria sem nenhuma ação.',              emoji: '🚫' },
  { id: 'leve',  nome: 'Cuidados Básicos',  estrategias: ['distanciamento','mascaras'],               desc: 'Medidas do dia a dia para reduzir o contágio.',        emoji: '🙂' },
  { id: 'forte', nome: 'Pacote Completo',   estrategias: ['distanciamento','mascaras','testagem','vacinas'], desc: 'Combinação forte para derrubar os casos.', emoji: '🛡️' },
];

function iconByEstrategia(id: string): string {
  switch (id) {
    case 'distanciamento': return '↔️';
    case 'mascaras': return '😷';
    case 'testagem': return '🧪';
    case 'vacinas': return '💉';
    case 'higiene': return '🧼';
    default: return '🛠️';
  }
}

export const WelcomeScreen: React.FC<Props> = ({ onIniciar, onSobreNos, initialEstrategias }) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [selecionadas, setSelecionadas] = useState<string[]>(
    initialEstrategias && initialEstrategias.length ? initialEstrategias : ['distanciamento','mascaras']
  );
  const [presetAtivo, setPresetAtivo] = useState<string>('');

  function toggle(id: string) {
    setSelecionadas(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setPresetAtivo(''); // saiu do preset estrito
  }

  const chipsInfo = selecionadas.length
    ? `${selecionadas.length} medida${selecionadas.length > 1 ? 's' : ''} selecionada${selecionadas.length > 1 ? 's' : ''}`
    : 'Nenhuma medida selecionada';

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
        padding: '28px 24px 36px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 20, 
        overflowY: 'auto' 
      }}>
        {/* Hero amigável */}
        <header style={{
          background: `linear-gradient(135deg, ${colors.backgroundSecondary} 0%, ${colors.backgroundCard} 100%)`,
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
          padding: '20px 18px'
        }}>
          <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.2, color: colors.text }}>
            Simulador de Mitigação Pandêmica
          </h1>
          <p style={{ margin: '8px 0 0 0', opacity: .85, lineHeight: 1.5, color: colors.textSecondary }}>
            Descubra de forma simples como medidas do dia a dia podem reduzir o número de casos em uma pandemia e salvar vidas.
          </p>
          <div style={{ marginTop: 10, display: 'inline-flex', gap: 8, alignItems: 'center' }}>
            <span style={{ 
              fontSize: 12, 
              padding: '6px 10px',
              background: colors.backgroundCard,
              border: `1px solid ${colors.border}`,
              borderRadius: 999,
              color: colors.textSecondary
            }}>
              {chipsInfo}
            </span>
            {presetAtivo && (
              <span style={{ 
                fontSize: 12, 
                padding: '6px 10px',
                background: colors.backgroundCard,
                border: `1px solid ${colors.border}`,
                borderRadius: 999,
                color: colors.textSecondary
              }}>
                Preset: {PRESETS.find(p => p.id === presetAtivo)?.nome}
              </span>
            )}
          </div>
        </header>

        {/* Presets simplificados */}
        <section>
          <h2 style={{ fontSize: 18, margin: '6px 0 10px', color: colors.text }}>Escolha um caminho rápido</h2>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
            {PRESETS.map(p => {
              const ativo = presetAtivo === p.id;
              return (
                <button key={p.id} type="button" onClick={() => {
                  setPresetAtivo(p.id);
                  setSelecionadas(p.estrategias);
                }} style={{
                  background: ativo ? colors.primary : colors.backgroundCard,
                  border: `1px solid ${colors.border}`,
                  padding: '14px 14px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: ativo ? '#ffffff' : colors.text,
                  transition: 'transform .08s ease, box-shadow .12s ease',
                  boxShadow: ativo ? '0 6px 18px rgba(0,0,0,.15)' : '0 2px 8px rgba(0,0,0,.06)'
                }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{p.emoji}</div>
                  <strong style={{ fontSize: 15 }}>{p.nome}</strong><br />
                  <span style={{ fontSize: 12, opacity: .8 }}>{p.desc}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Estratégias em linguagem simples */}
        <section>
          <h2 style={{ fontSize: 18, margin: '6px 0 10px', color: colors.text }}>Monte seu próprio combo</h2>
          <p style={{ fontSize: 13, opacity: .85, marginTop: 0, color: colors.textSecondary }}>
            Marque as opções que fazem sentido no seu cenário. Você pode alterar tudo depois.
          </p>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
            {ESTRATEGIAS.map(e => {
              const checked = selecionadas.includes(e.id);
              return (
                <label key={e.id} style={{
                  border: `1px solid ${colors.border}`,
                  padding: '12px 12px',
                  borderRadius: 12,
                  background: checked ? colors.backgroundSecondary : colors.backgroundCard,
                  display: 'flex',
                  gap: 10,
                  cursor: 'pointer',
                  alignItems: 'flex-start',
                  transition: 'transform .08s ease, box-shadow .12s ease',
                  boxShadow: checked ? '0 4px 14px rgba(0,0,0,.10)' : '0 2px 8px rgba(0,0,0,.05)'
                }}>
                  <input type="checkbox" checked={checked} onChange={() => toggle(e.id)} style={{ marginTop: 4 }} />
                  <span style={{ fontSize: 13, color: colors.text }}>
                    <strong style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span>{iconByEstrategia(e.id)}</span>
                      {e.nome}
                    </strong><br />
                    <span style={{ opacity: .8, color: colors.textSecondary }}>{e.descricao}</span><br />
                    <span style={{ fontSize: 11, opacity: .7, color: colors.textMuted }}>Impacto estimado: 📉 {e.multiplicador}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        {/* Dica amigável */}
        <aside style={{ 
          background: colors.backgroundSecondary, 
          padding: 14, 
          borderRadius: 12, 
          fontSize: 13, 
          lineHeight: 1.5,
          color: colors.textSecondary,
          border: `1px solid ${colors.border}`
        }}>
          💡 Dica: combinar medidas costuma trazer melhores resultados do que usar apenas uma.
        </aside>

        {/* Ações */}
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
                  borderRadius: 10,
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
                borderRadius: 10,
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
                padding: '12px 18px',
                borderRadius: 10,
                fontSize: 15,
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(0,0,0,.15)'
              }}
            >
              Começar agora 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};