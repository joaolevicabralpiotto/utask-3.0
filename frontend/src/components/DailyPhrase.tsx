import { useEffect, useState } from 'react';
import api from '../services/api'; // Você pode usar o Axios para chamadas externas também

export function DailyPhrase() {
  const [phrase, setPhrase] = useState("Carregando frase do dia...");

  useEffect(() => {
    // Exemplo de busca em uma API de frases (podemos usar uma pública)
    fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random'))
      .then(response => response.json())
      .then(data => {
  const contents = JSON.parse(data.contents)[0]; // Adicione esse [0]
  setPhrase(contents.q + " — " + contents.a);
})
      .catch(() => setPhrase("Foque no progresso, não na perfeição."));
  }, []);

  return (
    <div style={{ 
      margin: '20px 0', 
      padding: '15px', 
      borderLeft: '4px solid #007bff', 
      background: '#f8f9fa',
      fontStyle: 'italic'
    }}>
      <p>"{phrase}"</p>
    </div>
  );
}
