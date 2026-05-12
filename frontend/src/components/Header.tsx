import { useTheme } from '../contexts/ThemeContext';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      style={{
        background: 'var(--header-footer-bg)',
        color: '#ffffff',
        padding: '14px 28px',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        fontFamily: 'var(--font-sans)',
        boxShadow: '0 2px 10px rgba(0, 34, 109, 0.2)',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div style={{ justifySelf: 'start', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span aria-hidden style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="22" r="8" stroke="#ffffff" strokeWidth="2.5" fill="none" />
            <path d="M20 6v10M14 8l6-4 6 4" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      <h1
        style={{
          justifySelf: 'center',
          margin: 0,
          fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: '#ffffff'
        }}
      >
        uTask 3.0
      </h1>

      <div style={{ justifySelf: 'end' }}>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
          style={{
            border: 'none',
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '999px',
            background: 'var(--accent-yellow-bright)',
            color: '#141414',
            fontWeight: 700,
            fontSize: '1.1rem',
            lineHeight: 1,
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            fontFamily: 'var(--font-sans)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <span aria-hidden>{theme === 'light' ? '☀' : '☽'}</span>
        </button>
      </div>
    </header>
  );
}
