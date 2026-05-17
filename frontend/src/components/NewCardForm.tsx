import { useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

interface NewCardFormProps {
  onCardCreated: () => void;
  /** Quando usado dentro do modal do Kanban, sem borda/sombra duplicada */
  variant?: 'default' | 'modal';
}

export function NewCardForm({ onCardCreated, variant = 'default' }: NewCardFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreateCard(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post('/cards', { title, content });

      toast.success('Card criado com sucesso!');
      setTitle('');
      setContent('');

      onCardCreated();
    } catch {
      toast.error('Erro ao criar o card.');
    } finally {
      setLoading(false);
    }
  }

  const isModal = variant === 'modal';

  return (
    <form onSubmit={handleCreateCard} style={isModal ? formModalStyle : formDefaultStyle}>
      <label style={labelStyle}>
        Título *
        <input
          type="text"
          className="kanban-field-input"
          placeholder="Título da tarefa"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={inputStyle}
        />
      </label>
      <label style={labelStyle}>
        Descrição
        <textarea
          className="kanban-field-input"
          placeholder="Descrição (opcional)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={textareaStyle}
          rows={4}
        />
      </label>
      <button type="submit" disabled={loading} style={submitBtnStyle}>
        {loading ? 'Criando...' : 'Criar task'}
      </button>
    </form>
  );
}

const formDefaultStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '28px',
  padding: '22px',
  background: 'var(--bg-card)',
  borderRadius: '14px',
  border: '1px solid var(--border-color)',
  boxShadow: 'var(--card-shadow)',
  fontFamily: 'var(--font-sans)'
};

const formModalStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  margin: 0,
  padding: 0,
  background: 'transparent',
  border: 'none',
  boxShadow: 'none',
  fontFamily: 'var(--font-sans)'
};

const labelStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--text-primary)',
  textAlign: 'left'
};

const inputStyle: CSSProperties = {
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--input-bg)',
  color: 'var(--text-primary)',
  caretColor: 'var(--text-primary)',
  fontFamily: 'var(--font-sans)',
  fontSize: '1rem',
  width: '100%',
  boxSizing: 'border-box'
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: '100px'
};

const submitBtnStyle: CSSProperties = {
  padding: '14px 20px',
  borderRadius: '999px',
  border: 'none',
  background: 'var(--color-primary)',
  color: '#fff',
  fontWeight: 700,
  fontFamily: 'var(--font-sans)',
  cursor: 'pointer',
  fontSize: '1rem',
  boxShadow: '0 2px 10px rgba(72, 144, 245, 0.35)',
  marginTop: '4px'
};
