import { useTheme } from '../contexts/ThemeContext';

export function Footer() {
  const { theme } = useTheme();

  return (
    <footer style={{
      textAlign: 'center',
      padding: '20px',
      marginTop: '50px',
      borderTop: '1px solid #ddd',
      background: theme === 'light' ? '#f9f9f9' : '#222',
      color: theme === 'light' ? '#666' : '#bbb'
    }}>
      <p>© 2026 uTask 3.0 - Organização e Produtividade</p>
    </footer>
  );
}
