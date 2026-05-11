import { useState } from 'react';
import type { FormEvent } from 'react';
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
      <input 
        type="text" 
        placeholder="Título da tarefa" 
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea 
        placeholder="Descrição (opcional)" 
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Criando...' : 'Adicionar Card'}
      </button>
    </form>
  );
}

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginBottom: '30px',
  padding: '20px',
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
};
