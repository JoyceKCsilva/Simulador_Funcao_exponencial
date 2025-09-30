import React from 'react';
import { useTheme, getThemeColors } from './ThemeContext';
import { BackButton } from './BackButton';
import { ThemeToggle } from './ThemeToggle';

interface Props {
  onVoltar: () => void;
}

export const SobreNos: React.FC<Props> = ({ onVoltar }) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  // Função para escolher logo baseado no tema
  const getLogo = (lightLogo: string, darkLogo: string) => {
    return theme === 'light' ? lightLogo : darkLogo;
  };

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
      <BackButton 
        onClick={onVoltar} 
        position="fixed" 
        top="20px" 
        right="20px" 
      />
      <div className="no-scrollbar" style={{ 
        flex: '0 1 960px', 
        maxWidth: 960, 
        margin: '0 auto', 
        padding: '32px 28px 40px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 28, 
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        
        <header>
          <h1 style={{ margin: 0, fontSize: 34, color: colors.text }}>Sobre Nós</h1>
          <p style={{ opacity: .8, lineHeight: 1.5, color: colors.textSecondary }}>
            Conheça a equipe e as instituições por trás do Simulador de Mitigação Pandêmica
          </p>
        </header>

        {/* Layout em duas colunas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
          
          {/* Coluna Esquerda - Desenvolvedores e Instituição */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Card PET */}
            <div style={{ 
              background: colors.backgroundCard, 
              padding: 24, 
              borderRadius: 12, 
              border: `1px solid ${colors.border}`,
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              gap: 16
            }}>
              <img 
                src={getLogo('/logoPETMC.png', '/logoPETMono.png')}
                alt="Logo PET" 
                style={{ width: 80, height: 80, objectFit: 'contain', flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 18, margin: 0, marginBottom: 4, color: colors.text }}>PET Conexão Periferia</h3>
                <p style={{ margin: 0, fontSize: 12, color: colors.textSecondary, opacity: 0.8 }}>
                  Programa de Educação Tutorial Conexão Periferia
                </p>
              </div>
            </div>

            {/* Card IFPE */}
            <div style={{ 
              background: colors.backgroundCard, 
              padding: 24, 
              borderRadius: 12, 
              border: `1px solid ${colors.border}`,
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              gap: 16
            }}>
              <img 
                src={getLogo('/logoIFPEMC.png', '/logoIFPE.png')}
                alt="Logo IFPE" 
                style={{ width: 80, height: 80, objectFit: 'contain', flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 18, margin: 0, marginBottom: 4, color: colors.text }}>IFPE</h3>
                <p style={{ margin: 0, fontSize: 12, color: colors.textSecondary, opacity: 0.8 }}>
                  Instituto Federal de Pernambuco Campus Igarassu
                </p>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Apoiadores e Tecnologias */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Card Apoiadores e Tecnologias */}
            <div style={{ 
              background: colors.backgroundCard, 
              padding: 24, 
              borderRadius: 12, 
              border: `1px solid ${colors.border}`,
              height: '264px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Seção Apoiadores */}
              <div style={{ marginBottom: 14 }}>
                <h3 style={{ fontSize: 18, margin: 0, marginBottom: 8, color: colors.text }}>Apoiadores</h3>
                
                {/* FACEPE */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                  <img 
                    src={getLogo('/logoFACEPEMC.png', '/logoFacepe.png')}
                    alt="Logo FACEPE" 
                    style={{ width: 50, height: 50, objectFit: 'contain', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 13, margin: 0, marginBottom: 1, color: colors.text }}>FACEPE</h4>
                    <p style={{ fontSize: 10, opacity: .7, margin: 0, lineHeight: 1.2, color: colors.textSecondary }}>
                      Fundação de Amparo à Ciência e Tecnologia de PE
                    </p>
                  </div>
                </div>

                {/* FNDE */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <img 
                    src="/logoFNDE.png"
                    alt="Logo FNDE" 
                    style={{ width: 50, height: 50, objectFit: 'contain', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 13, margin: 0, marginBottom: 1, color: colors.text }}>FNDE</h4>
                    <p style={{ fontSize: 10, opacity: .7, margin: 0, lineHeight: 1.2, color: colors.textSecondary }}>
                      Fundo Nacional de Desenvolvimento da Educação
                    </p>
                  </div>
                </div>
              </div>

              {/* Seção Tecnologias */}
              <div style={{ marginTop: 'auto' }}>
                <h3 style={{ fontSize: 16, margin: 0, marginBottom: 12, color: colors.text }}>Tecnologias</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ 
                    background: '#3730a3', 
                    color: '#e0e7ff', 
                    padding: '6px 10px', 
                    borderRadius: 4, 
                    fontSize: 11,
                    fontWeight: '600'
                  }}>React</span>
                  <span style={{ 
                    background: '#1e40af', 
                    color: '#dbeafe', 
                    padding: '6px 10px', 
                    borderRadius: 4, 
                    fontSize: 11,
                    fontWeight: '600'
                  }}>TypeScript</span>
                  <span style={{ 
                    background: '#059669', 
                    color: '#d1fae5', 
                    padding: '6px 10px', 
                    borderRadius: 4, 
                    fontSize: 11,
                    fontWeight: '600'
                  }}>Vite</span>
                  <span style={{ 
                    background: '#dc2626', 
                    color: '#fed7d7', 
                    padding: '6px 10px', 
                    borderRadius: 4, 
                    fontSize: 11,
                    fontWeight: '600'
                  }}>Recharts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Missão do Projeto */}
        <div style={{ 
          background: colors.backgroundCard, 
          padding: 24, 
          borderRadius: 8, 
          border: `1px solid ${colors.border}`,
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: 18, margin: 0, marginBottom: 12, color: colors.text }}>Missão do Projeto</h3>
          <p style={{ margin: 0, fontSize: 14, color: colors.textSecondary, opacity: 0.8, lineHeight: 1.5 }}>
            Democratizar o conhecimento sobre epidemiologia através de simulações interativas, 
            permitindo que estudantes, professores e gestores públicos compreendam melhor 
            os impactos das diferentes estratégias de mitigação durante emergências sanitárias.
          </p>
        </div>

      </div>
    </div>
  );
};