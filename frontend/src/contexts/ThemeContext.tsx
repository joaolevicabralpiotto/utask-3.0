import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Definimos os tipos do nosso tema [5]
interface ThemeContextData {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // O estado inicial será 'light' [6]
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}> {/* Esta div aplicará a classe CSS globalmente */}
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// Hook personalizado para facilitar o uso [7]
export const useTheme = () => useContext(ThemeContext);
