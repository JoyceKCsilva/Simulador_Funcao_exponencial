import React from 'react';
import { useTheme, getThemeColors } from './ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const colors = getThemeColors(theme);

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: '20px',
        right: '80px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: `2px solid ${colors.border}`,
        background: colors.backgroundCard,
        color: colors.text,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        transition: 'all 0.2s ease',
        zIndex: 1000,
        boxShadow: theme === 'light' 
          ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
          : '0 2px 8px rgba(0, 0, 0, 0.3)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.background = colors.backgroundSecondary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.background = colors.backgroundCard;
      }}
      title={theme === 'light' ? 'Mudar para modo escuro' : 'Mudar para modo claro'}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};