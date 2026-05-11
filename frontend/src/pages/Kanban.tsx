import { useEffect, useState } from 'react';
import api from '../services/api';
import { DailyPhrase } from '../components/DailyPhrase';
import { NewCardForm } from '../components/NewCardForm';
import { toast } from 'react-toastify';

interface Card {
  id: number;
  title: string;
  content: string;
  status: 'todo' | 'doing' | 'done';
}

export function Kanban() {
  const [cards, setCards] = useState<Card[]>([]);

  async function loadCards() {
    try {
      const response = await api.get('/cards');
      setCards(response.data);
    } catch (error) {
      toast.error("Erro ao carregar seus cards.");
    }
  }

  useEffect(() => {
    loadCards();
  }, []);

  // --- FUNÇÃO: Atualizar Status (Mover Card) ---
  async function handleUpdateStatus(id: number, newStatus: string) {
    try {
      // Faz o PUT para alterar apenas o status
      await api.put(`/cards/${id}`, { status: newStatus });
      
      toast.info(`Card movido para ${newStatus}!`);
      loadCards(); // Recarrega a tela com o card na coluna nova
    } catch (error) {
      toast.error("Erro ao mover o card.");
    }
  }

  async function handleDeleteCard(id: number) {
    if (!window.confirm("Tem certeza que deseja excluir este card?")) {
      return;
    }
    try {
      await api.delete(`/cards/${id}`);
      toast.success("Card removido!");
      loadCards();
    } catch (error) {
      toast.error("Erro ao excluir o card.");
    }
  }

  const todoCards = cards.filter(card => card.status === 'todo');
  const doingCards = cards.filter(card => card.status === 'doing');
  const doneCards = cards.filter(card => card.status === 'done');

  return (
    <div style={{ padding: '20px' }}>
      <DailyPhrase />
      
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <NewCardForm onCardCreated={loadCards} />
      </div>

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        
        {/* Coluna: A Fazer */}
        <div className="kanban-column" style={columnStyle}>
          <h3>A Fazer 📌</h3>
          {todoCards.map(card => (
            <div key={card.id} style={cardStyle}>
              <h4>{card.title}</h4>
              <p>{card.content}</p>
              <div style={actionsContainerStyle}>
                <button 
                  onClick={() => handleUpdateStatus(card.id, 'doing')}
                  style={moveButtonStyle}
                >
                  ▶ Fazendo
                </button>
                <button onClick={() => handleDeleteCard(card.id)} style={deleteButtonStyle}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coluna: Fazendo */}
        <div className="kanban-column" style={columnStyle}>
          <h3>Fazendo 🔨</h3>
          {doingCards.map(card => (
            <div key={card.id} style={cardStyle}>
              <h4>{card.title}</h4>
              <p>{card.content}</p>
              <div style={actionsContainerStyle}>
                <button onClick={() => handleUpdateStatus(card.id, 'todo')} style={moveButtonStyle}>
                  ◀ Voltar
                </button>
                <button onClick={() => handleUpdateStatus(card.id, 'done')} style={moveButtonStyle}>
                  ✔ Finalizar
                </button>
                <button onClick={() => handleDeleteCard(card.id)} style={deleteButtonStyle}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coluna: Feito */}
        <div className="kanban-column" style={columnStyle}>
          <h3>Feito ✅</h3>
          {doneCards.map(card => (
            <div key={card.id} style={cardStyle}>
              <h4>{card.title}</h4>
              <p>{card.content}</p>
              <div style={actionsContainerStyle}>
                <button onClick={() => handleUpdateStatus(card.id, 'doing')} style={moveButtonStyle}>
                  ↺ Reabrir
                </button>
                <button onClick={() => handleDeleteCard(card.id)} style={deleteButtonStyle}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// --- ESTILOS ---

const columnStyle: React.CSSProperties = {
  background: '#f4f4f4',
  borderRadius: '8px',
  width: '300px',
  minHeight: '400px',
  padding: '10px'
};

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '4px',
  padding: '10px',
  marginBottom: '10px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const actionsContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  marginTop: '10px',
  flexWrap: 'wrap'
};

const moveButtonStyle: React.CSSProperties = {
  fontSize: '11px',
  cursor: 'pointer',
  padding: '4px 8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  background: '#f9f9f9'
};

const deleteButtonStyle: React.CSSProperties = {
  color: '#d93025',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontSize: '11px',
  fontWeight: 'bold',
  marginLeft: 'auto'
};