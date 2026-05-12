import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '../services/api';
import { toast } from 'react-toastify';

type Card = {
  id: number;
  title: string;
  content: string;
  status: 'todo' | 'doing' | 'done';
};

type SortableCardProps = {
  card: Card;
  onDelete: () => void;
  onMove: () => void;
};

const statusFlow = { todo: 'doing' as const, doing: 'done' as const, done: 'done' as const };
const statusBack = { todo: 'todo' as const, doing: 'todo' as const, done: 'doing' as const };

function statusAccentBorder(status: Card['status']): string {
  if (status === 'todo') return '3px solid var(--color-primary)';
  if (status === 'doing') return '3px solid var(--accent-yellow-deep)';
  return '3px solid var(--border-strong)';
}

export function SortableCard({ card, onDelete, onMove }: SortableCardProps) {
  const [descOpen, setDescOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });

  const isDone = card.status === 'done';
  const hasContent = Boolean(card.content?.trim());

  const shellStyle: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text-primary)',
    padding: '16px',
    marginBottom: '12px',
    borderRadius: '14px',
    border: '1px solid var(--border-color)',
    borderLeft: statusAccentBorder(card.status),
    boxShadow: 'var(--card-shadow)',
    cursor: 'grab',
    touchAction: 'none'
  };

  async function moveManual(direction: 'next' | 'back') {
    const newStatus =
      direction === 'next'
        ? statusFlow[card.status]
        : statusBack[card.status];
    if (newStatus === card.status) return;
    try {
      await api.put(`/cards/${card.id}`, { status: newStatus });
      onMove();
    } catch {
      toast.error('Erro ao mover card.');
    }
  }

  async function handleDelete() {
    if (!window.confirm('Deseja excluir?')) return;
    try {
      await api.delete(`/cards/${card.id}`);
      onDelete();
    } catch {
      toast.error('Erro ao excluir.');
    }
  }

  return (
    <div ref={setNodeRef} style={shellStyle} {...attributes} {...listeners}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
        <h4
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: '1rem',
            lineHeight: 1.3,
            flex: 1,
            textDecoration: isDone ? 'line-through' : 'none',
            color: isDone ? 'var(--text-muted)' : 'var(--text-primary)'
          }}
        >
          {card.title}
        </h4>
        <button
          type="button"
          aria-label="Menu do card"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={menuBtnStyle}
        >
          ⋮
        </button>
      </div>

      {hasContent && (
        <div style={{ marginBottom: 10 }}>
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setDescOpen((v) => !v);
            }}
            style={toggleDescStyle}
          >
            {descOpen ? 'Esconder descrição' : 'Ler descrição'}{' '}
            <span style={{ fontSize: '0.75rem' }}>{descOpen ? '▴' : '▾'}</span>
          </button>
          {descOpen ? (
            <p style={descTextStyle}>{card.content}</p>
          ) : null}
        </div>
      )}

      <div style={actionsRowStyle}>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            moveManual('back');
          }}
          style={circleNavBtnStyle}
          aria-label="Mover para coluna anterior"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M15 6l-6 6 6 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          style={deleteBtnStyle}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }} aria-hidden>
            <path
              d="M5 7h14M10 7V5h4v2M8 7v12h8V7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Excluir
        </button>

        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            moveManual('next');
          }}
          style={circleNavBtnStyle}
          aria-label="Mover para próxima coluna"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M9 6l6 6-6 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const menuBtnStyle: CSSProperties = {
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: '1.25rem',
  lineHeight: 1,
  padding: '4px 8px',
  color: 'var(--text-muted)',
  borderRadius: '8px'
};

const toggleDescStyle: CSSProperties = {
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  padding: 0,
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--color-link)',
  fontFamily: 'var(--font-sans)'
};

const descTextStyle: CSSProperties = {
  margin: '8px 0 0',
  fontWeight: 400,
  fontSize: '0.875rem',
  lineHeight: 1.45,
  color: 'var(--text-primary)'
};

const actionsRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  marginTop: 12,
  paddingTop: 12,
  borderTop: '1px solid var(--border-color)'
};

const circleNavBtnStyle: CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  border: 'none',
  background: 'var(--color-primary)',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 6px rgba(72, 144, 245, 0.45)',
  flexShrink: 0
};

const deleteBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 14px',
  borderRadius: '10px',
  border: 'none',
  background: 'var(--color-error)',
  color: '#fff',
  fontWeight: 600,
  fontSize: '0.8125rem',
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
  boxShadow: '0 2px 4px rgba(223, 0, 0, 0.25)'
};
