import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

export function DailyPhrase() {
  const [phrase, setPhrase] = useState('Carregando frase do dia...');

  useEffect(() => {
    fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random'))
      .then((response) => response.json())
      .then((data) => {
        const contents = JSON.parse(data.contents)[0];
        setPhrase(contents.q + ' — ' + contents.a);
      })
      .catch(() => setPhrase('Foque no progresso, não na perfeição.'));
  }, []);

  return (
    <section style={wrapStyle}>
      <div style={iconBubbleStyle} aria-hidden>
        <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>💡</span>
      </div>
      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
        <h2 style={titleStyle}>Frase do dia</h2>
        <p style={quoteStyle}>&ldquo;{phrase}&rdquo;</p>
      </div>
    </section>
  );
}

const wrapStyle: CSSProperties = {
  display: 'flex',
  gap: '18px',
  alignItems: 'flex-start',
  backgroundColor: 'var(--bg-card)',
  padding: '22px 26px',
  borderRadius: '16px',
  boxShadow: 'var(--card-shadow)',
  border: '1px solid var(--border-color)',
  marginBottom: '28px',
  fontFamily: 'var(--font-sans)'
};

const iconBubbleStyle: CSSProperties = {
  flexShrink: 0,
  width: 52,
  height: 52,
  borderRadius: '50%',
  background: 'var(--accent-yellow-bright)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(251, 185, 16, 0.35)'
};

const titleStyle: CSSProperties = {
  margin: '0 0 10px',
  fontSize: '1.0625rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  letterSpacing: '-0.02em'
};

const quoteStyle: CSSProperties = {
  margin: 0,
  fontWeight: 400,
  fontSize: '0.9375rem',
  lineHeight: 1.55,
  color: 'var(--text-primary)'
};
