import { useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify'; // Usando Toast conforme sugerido [2]

interface NewCardFormProps {
  onCardCreated: () => void; // Função para avisar o Kanban que um novo card foi criado
}

export function NewCardForm({ onCardCreated }: NewCardFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreateCard(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      // Enviando o POST para a rota que criamos no backend
      await api.post('/cards', { title, content });
      
      toast.success("Card criado com sucesso!"); // [3]
      setTitle('');
      setContent('');
      
      // Avisa o componente pai (Kanban) para recarregar a lista
      onCardCreated();
    } catch (error) {
      toast.error("Erro ao criar o card.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleCreateCard} style={formStyle}>
      <input type="text" placeholder="Título da tarefa" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
      <textarea placeholder="Descrição (opcional)" value={content} onChange={(e) => setContent(e.target.value)} style={textareaStyle} rows={3} />
      <button type="submit" disabled={loading} style={submitBtnStyle}>
        {loading ? 'Criando...' : 'Adicionar Card'}
      </button>
    </form>
  );
}

const formStyle: CSSProperties = {
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

const inputStyle: CSSProperties = {
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid var(--border-color)',
  background: 'var(--input-bg)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-sans)',
  fontSize: '1rem'
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: '88px'
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
  boxShadow: '0 2px 10px rgba(72, 144, 245, 0.35)'
};
