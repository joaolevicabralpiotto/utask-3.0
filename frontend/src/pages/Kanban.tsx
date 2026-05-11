import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { 
  DndContext, 
  closestCorners, 
  PointerSensor, 
  useSensor, 
  useSensors,
  useDroppable,
  DragOverlay, // Adicionado para suavidade total
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'; 
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import api from '../services/api';
import { DailyPhrase } from '../components/DailyPhrase';
import { NewCardForm } from '../components/NewCardForm';
import { SortableCard } from '../components/SortableCard';
import { toast } from 'react-toastify';

function DroppableColumn({ status, children }: { status: string; children: ReactNode }) {
  const { setNodeRef } = useDroppable({ id: status });
  return <div ref={setNodeRef} style={{ minHeight: '500px', width: '100%' }}>{children}</div>;
}

export function Kanban() {
  const [cards, setCards] = useState<any[]>([]);
  const [activeCard, setActiveCard] = useState<any>(null); // Estado para o card sendo arrastado

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }) // Distância curta para resposta imediata
  );

  const loadCards = async () => {
    try {
      const res = await api.get('/cards');
      setCards(res.data);
    } catch { toast.error("Erro ao carregar cards."); }
  };

  useEffect(() => { loadCards(); }, []);

  // Quando o arrasto começa
  function handleDragStart(event: DragStartEvent) {
    const card = cards.find(c => c.id === event.active.id);
    setActiveCard(card);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCard(null); // Limpa o card ativo

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    const draggedCard = cards.find(c => c.id === activeId);

    let newStatus = overId as string;
    const targetCard = cards.find(c => c.id === overId);
    if (targetCard) newStatus = targetCard.status;

    if (draggedCard && ['todo', 'doing', 'done'].includes(newStatus) && newStatus !== draggedCard.status) {
      try {
        setCards(prev => prev.map(c => c.id === activeId ? { ...c, status: newStatus as any } : c));
        await api.put(`/cards/${activeId}`, { status: newStatus });
        toast.success("Movido!");
      } catch {
        toast.error("Erro ao salvar.");
        loadCards();
      }
    }
  }

  const renderColumn = (title: string, status: 'todo' | 'doing' | 'done', emoji: string) => (
    <div style={columnStyle}>
      <h3 style={columnTitleStyle}>{title} {emoji}</h3>
      <SortableContext id={status} items={cards.filter(c => c.status === status).map(c => c.id)} strategy={verticalListSortingStrategy}>
        <DroppableColumn status={status}>
          {cards.filter(c => c.status === status).map(card => (
            <SortableCard key={card.id} card={card} onDelete={loadCards} onMove={loadCards} />
          ))}
        </DroppableColumn>
      </SortableContext>
    </div>
  );

  return (
    <div style={containerStyle}>
      <DailyPhrase />
      <NewCardForm onCardCreated={loadCards} />
      
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div style={boardStyle}>
          {renderColumn('A Fazer', 'todo', '📌')}
          {renderColumn('Fazendo', 'doing', '🔨')}
          {renderColumn('Feito', 'done', '✅')}
        </div>

        {/* O DragOverlay é o que faz o card "grudar" no mouse sem tremer */}
        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
        }}>
          {activeCard ? (
            <div style={overlayCardStyle}>
              <h4>{activeCard.title}</h4>
              <p>{activeCard.content}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

// Estilos extras para o "fantasma" do card
const overlayCardStyle: CSSProperties = {
  backgroundColor: 'var(--bg-primary)',
  padding: '15px',
  borderRadius: '8px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
  border: '2px solid var(--accent-color)',
  cursor: 'grabbing',
  width: '310px', // Um pouco menor que a coluna
  opacity: 0.9
};

const containerStyle: CSSProperties = { padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' };
const boardStyle: CSSProperties = { display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' };
const columnStyle: CSSProperties = { background: 'var(--bg-secondary)', borderRadius: '12px', width: '350px', minHeight: '600px', padding: '20px', border: '1px solid var(--border-color)' };
const columnTitleStyle: CSSProperties = { textAlign: 'center', color: 'var(--text-primary)', marginBottom: '15px' };