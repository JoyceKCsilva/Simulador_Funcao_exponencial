import React from 'react';
import { useTheme, getThemeColors } from './ThemeContext';

interface Props {
  onClick: () => void;
  position?: 'fixed' | 'relative';
  top?: string;
  right?: string;
  left?: string;
  text?: string;
}

export const BackButton: React.FC<Props> = ({ 
  onClick, 
  position = 'relative',
  top = '20px',
  right,
  left,
  text = '🏠'
}) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  const positionStyles = position === 'fixed' ? {
    position: 'fixed' as const,
    top,
    ...(right ? { right } : {}),
    ...(left ? { left } : {}),
    zIndex: 999
  } : {};

  return (
    <button
      onClick={onClick}
      style={{
        ...positionStyles,
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
      title="Voltar"
    >
      {text}
    </button>
  );
};