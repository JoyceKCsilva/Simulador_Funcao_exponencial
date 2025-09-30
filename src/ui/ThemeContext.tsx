import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Verifica a preferência salva no localStorage
    const savedTheme = localStorage.getItem('app-theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    // Fallback para preferência do sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    // Salva a preferência no localStorage
    localStorage.setItem('app-theme', theme);
    
    // Aplica a classe CSS no body
    document.body.className = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Função helper para obter cores baseadas no tema
export const getThemeColors = (theme: Theme) => {
  if (theme === 'light') {
    return {
      background: '#ffffff',
      backgroundSecondary: '#f8fafc',
      backgroundCard: '#ffffff',
      border: '#e2e8f0',
      text: '#1e293b',
      textSecondary: '#64748b',
      textMuted: '#94a3b8',
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      success: '#059669',
      warning: '#d97706',
      danger: '#dc2626',
      buttonSecondary: '#f1f5f9',
      buttonSecondaryHover: '#e2e8f0',
    };
  } else {
    return {
      background: '#0f172a',
      backgroundSecondary: '#1e293b',
      backgroundCard: '#1f2937',
      border: '#374151',
      text: '#f1f5f9',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      buttonSecondary: '#374151',
      buttonSecondaryHover: '#4b5563',
    };
  }
};