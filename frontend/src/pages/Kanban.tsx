import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import api from '../services/api';
import { DailyPhrase } from '../components/DailyPhrase';
import { NewCardForm } from '../components/NewCardForm';
import { SortableCard } from '../components/SortableCard';
import { toast } from 'react-toastify';

function DroppableColumn({ status, children }: { status: string; children: ReactNode }) {
  const { setNodeRef } = useDroppable({ id: status });
  return (
    <div ref={setNodeRef} style={columnBodyStyle}>
      {children}
    </div>
  );
}

export function Kanban() {
  const [cards, setCards] = useState<any[]>([]);
  const [activeCard, setActiveCard] = useState<any>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 3 } }));

  const loadCards = async () => {
    try {
      const res = await api.get('/cards');
      setCards(res.data);
    } catch {
      toast.error('Erro ao carregar cards.');
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  useEffect(() => {
    if (!createModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCreateModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [createModalOpen]);

  function handleDragStart(event: DragStartEvent) {
    const card = cards.find((c) => c.id === event.active.id);
    setActiveCard(card);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    const draggedCard = cards.find((c) => c.id === activeId);

    let newStatus = overId as string;
    const targetCard = cards.find((c) => c.id === overId);
    if (targetCard) newStatus = targetCard.status;

    if (draggedCard && ['todo', 'doing', 'done'].includes(newStatus) && newStatus !== draggedCard.status) {
      try {
        setCards((prev) =>
          prev.map((c) => (c.id === activeId ? { ...c, status: newStatus as any } : c))
        );
        await api.put(`/cards/${activeId}`, { status: newStatus });
        toast.success('Movido!');
      } catch {
        toast.error('Erro ao salvar.');
        loadCards();
      }
    }
  }

  const renderColumn = (title: string, status: 'todo' | 'doing' | 'done', showAdd: boolean) => (
    <div style={columnShellStyle}>
      <div style={columnHeaderRowStyle}>
        <h3 style={columnHeadingStyle}>{title}</h3>
        {showAdd ? (
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            style={columnAddBtnStyle}
            aria-label="Nova task"
          >
            +
          </button>
        ) : (
          <span style={{ width: 40 }} aria-hidden />
        )}
      </div>
      <SortableContext
        id={status}
        items={cards.filter((c) => c.status === status).map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div style={columnListWrapStyle}>
          <DroppableColumn status={status}>
            {cards
              .filter((c) => c.status === status)
              .map((card) => (
                <SortableCard key={card.id} card={card} onDelete={loadCards} onMove={loadCards} />
              ))}
          </DroppableColumn>
        </div>
      </SortableContext>
    </div>
  );

  return (
    <div style={pageStyle}>
      <div style={innerMaxStyle}>
        <DailyPhrase />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div style={boardAreaStyle}>
            <div style={boardWrapStyle}>
              <div style={boardStyle}>
                {renderColumn('A fazer', 'todo', true)}
                {renderColumn('Em andamento', 'doing', false)}
                {renderColumn('Feito', 'done', false)}
              </div>
            </div>

            <DragOverlay
            dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: { active: { opacity: '0.55' } }
              })
            }}
          >
            {activeCard ? (
              <div style={overlayStyle(activeCard.status)}>
                <strong style={{ display: 'block', marginBottom: 8, fontSize: '1rem' }}>{activeCard.title}</strong>
                {activeCard.content ? (
                  <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 400, opacity: 0.9 }}>{activeCard.content}</p>
                ) : null}
              </div>
            ) : null}
            </DragOverlay>
          </div>
        </DndContext>

        {createModalOpen ? (
          <div
            role="presentation"
            style={modalBackdropStyle}
            onClick={() => setCreateModalOpen(false)}
            aria-hidden={!createModalOpen}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="kanban-new-task-title"
              style={modalPanelStyle}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setCreateModalOpen(false)}
                style={modalCloseStyle}
              >
                ×
              </button>
              <h2 id="kanban-new-task-title" style={modalTitleStyle}>
                Nova Task
              </h2>
              <div style={modalTitleUnderline} />
              <NewCardForm
                variant="modal"
                onCardCreated={() => {
                  loadCards();
                  setCreateModalOpen(false);
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function overlayBorderLeft(status: string): string {
  if (status === 'todo') return '4px solid var(--color-primary)';
  if (status === 'doing') return '4px solid var(--accent-yellow-deep)';
  return '4px solid var(--border-strong)';
}

function overlayStyle(status: string): CSSProperties {
  return {
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text-primary)',
    padding: '16px',
    borderRadius: '14px',
    border: '1px solid var(--border-color)',
    borderLeft: overlayBorderLeft(status),
    boxShadow: 'var(--shadow-md)',
    cursor: 'grabbing',
    width: 300,
    maxWidth: '85vw',
    textAlign: 'left'
  };
}

const pageStyle: CSSProperties = {
  flex: 1,
  width: '100%',
  height: '100%',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: 'var(--bg-primary)',
  padding: '16px 20px 12px',
  boxSizing: 'border-box'
};

const innerMaxStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  maxWidth: '1180px',
  margin: '0 auto',
  width: '100%',
  position: 'relative'
};

const boardAreaStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
};

const boardWrapStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  marginTop: '16px'
};

const boardStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  gap: '20px',
  justifyContent: 'center',
  alignItems: 'stretch',
  overflow: 'hidden',
  width: '100%'
};

const columnShellStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  height: '100%',
  backgroundColor: 'var(--palette-neutral-border)',
  borderRadius: '16px',
  border: '1px solid var(--border-color)',
  width: 'min(100%, 340px)',
  flex: '1 1 0',
  maxWidth: '360px',
  padding: '16px 14px 18px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
};

const columnListWrapStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column'
};

const columnHeaderRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '14px',
  paddingBottom: '10px',
  borderBottom: '1px solid var(--border-color)'
};

const columnHeadingStyle: CSSProperties = {
  margin: 0,
  fontSize: '1.0625rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-sans)',
  letterSpacing: '-0.02em'
};

const columnAddBtnStyle: CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  border: 'none',
  background: 'var(--color-primary)',
  color: '#fff',
  fontSize: '1.5rem',
  lineHeight: 1,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 600,
  boxShadow: '0 2px 8px rgba(72, 144, 245, 0.35)'
};

const columnBodyStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
  width: '100%',
  paddingRight: '4px'
};

const modalBackdropStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  background: 'rgba(20, 20, 20, 0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  fontFamily: 'var(--font-sans)'
};

const modalPanelStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  maxWidth: '440px',
  background: 'var(--bg-card)',
  borderRadius: '20px',
  boxShadow: 'var(--shadow-md)',
  border: '1px solid var(--border-color)',
  padding: '28px 28px 24px',
  textAlign: 'center'
};

const modalCloseStyle: CSSProperties = {
  position: 'absolute',
  top: '16px',
  right: '16px',
  width: 40,
  height: 40,
  borderRadius: '50%',
  border: '2px solid var(--color-primary)',
  background: 'transparent',
  color: 'var(--color-primary)',
  fontSize: '1.5rem',
  lineHeight: 1,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0
};

const modalTitleStyle: CSSProperties = {
  margin: '0 48px 8px 0',
  fontSize: '1.25rem',
  fontWeight: 700,
  color: 'var(--color-primary)',
  fontFamily: 'var(--font-sans)'
};

const modalTitleUnderline: CSSProperties = {
  height: 2,
  background: 'var(--color-primary)',
  borderRadius: 1,
  margin: '0 auto 24px',
  maxWidth: '120px'
};
