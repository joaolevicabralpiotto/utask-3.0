import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '../services/api';
import { toast } from 'react-toastify';

export function SortableCard({ card, onDelete, onMove }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text-primary)',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--card-shadow)',
    cursor: 'grab'
  };

  const statusFlow = { todo: 'doing', doing: 'done', done: 'done' };
  const statusBack = { todo: 'todo', doing: 'todo', done: 'doing' };

  async function moveManual(direction: 'next' | 'back') {
    const newStatus = direction === 'next' ? statusFlow[card.status as keyof typeof statusFlow] : statusBack[card.status as keyof typeof statusBack];
    if (newStatus === card.status) return;
    try {
      await api.put(`/cards/${card.id}`, { status: newStatus });
      onMove(); // Recarrega o Kanban
    } catch { toast.error("Erro ao mover card."); }
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <h4 style={{ fontWeight: 600 }}>{card.title}</h4>
      <p style={{ fontWeight: 300, fontSize: '0.9rem' }}>{card.content}</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
        <button onClick={(e) => { e.stopPropagation(); moveManual('back'); }} style={btnStyle}>⬅️</button>
        <button onClick={(e) => { e.stopPropagation(); handleDelete(); }} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Excluir</button>
        <button onClick={(e) => { e.stopPropagation(); moveManual('next'); }} style={btnStyle}>➡️</button>
      </div>
    </div>
  );

  async function handleDelete() {
    if (!window.confirm("Deseja excluir?")) return;
    try {
      await api.delete(`/cards/${card.id}`);
      onDelete();
    } catch { toast.error("Erro ao excluir."); }
  }
}

const btnStyle = { background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '2px 8px' };