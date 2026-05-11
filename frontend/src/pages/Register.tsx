import { useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export function Register({ onSwitchToLogin }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    try {
      // Chamada para a rota de cadastro do backend
      await api.post('/usuarios', { name, email, password });
      
      toast.success("Cadastro realizado com sucesso! Faça seu login.");
      onSwitchToLogin(); // Redireciona para o login após o sucesso
    } catch (error: any) {
      const message = error.response?.data?.message || "Erro ao cadastrar usuário.";
      toast.error(message);
    }
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '20px', fontWeight: 700 }}>Criar Conta</h1>
      <form onSubmit={handleRegister} style={formStyle}>
        <input 
          type="text" 
          placeholder="Nome completo" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          required
        />
        <input 
          type="email" 
          placeholder="Seu e-mail" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />
        <input 
          type="password" 
          placeholder="Sua senha" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />
        <button type="submit" style={buttonStyle}>Cadastrar</button>
      </form>
      <p style={{ marginTop: '15px' }}>
        Já tem uma conta?{' '}
        <span onClick={onSwitchToLogin} style={linkStyle}>Entrar</span>
      </p>
    </div>
  );
}

// Estilos baseados no Guia de Estilo (Documentação Técnica)
const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '80vh',
  color: 'var(--text-primary)'
};

const formStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  width: '100%',
  maxWidth: '350px'
};

const inputStyle: CSSProperties = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-primary)'
};

const buttonStyle: CSSProperties = {
  padding: '12px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: 'var(--accent-color)',
  color: '#FFF',
  fontWeight: 600,
  cursor: 'pointer'
};

const linkStyle: CSSProperties = {
  color: 'var(--accent-color)',
  cursor: 'pointer',
  fontWeight: 600
};
