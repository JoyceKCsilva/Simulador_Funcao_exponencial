import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './ui/App';
import { ThemeProvider } from './ui/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
