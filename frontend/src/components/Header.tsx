import { useTheme } from '../contexts/ThemeContext';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useContext(AuthContext); // Pegamos o usuário logado do contexto [10, 11]

  return (
    <header style={{ 
      padding: '1rem', 
      display: 'flex', 
      justifyContent: 'space-between',
      background: theme === 'light' ? '#eee' : '#333', // Estilização básica baseada no tema [3]
      color: theme === 'light' ? '#000' : '#fff'
    }}>
      <h1>uTask 3.0</h1>
      
      <div>
        <span>Bem-vindo, {user?.name}! </span>
        <button onClick={toggleTheme}>
          Alternar para modo {theme === 'light' ? 'Escuro' : 'Claro'}
        </button>
      </div>
    </header>
  );
}

