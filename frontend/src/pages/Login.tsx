import { useState, useContext, FormEvent } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify'; // Importamos o Toast conforme as regras [4]

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. Acessamos a função signIn de dentro do nosso Contexto [2]
  const { signIn } = useContext(AuthContext);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault(); // Impede que a página recarregue ao enviar o formulário

    if (email === '' || password === '') {
      toast.warn("Preencha todos os campos!");
      return;
    }

    // 2. Chamamos a função de login enviando os dados
    await signIn({ email, password });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>uTask 3.0 - Login</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <input 
          type="email" 
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Atualiza o estado ao digitar
          required
        />
        <input 
          type="password" 
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
