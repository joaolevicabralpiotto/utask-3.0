import { useContext, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export function Login({ onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useContext(AuthContext);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); 
    setLoading(true);

    if (email === '' || password === '') {
      toast.warn("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      await signIn({ email, password });
      toast.success("Bem-vindo ao uTask 3.0!");
    } catch {
      toast.error("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={containerStyle}>
      <div style={loginBoxStyle}>
        <h1 style={titleStyle}>uTask 3.0</h1>
        <p style={subtitleStyle}>Gerencie suas tarefas com eficiência.</p>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>E-mail</label>
            <input 
              type="email" 
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Senha</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={footerTextStyle}>
          Não tem uma conta?{' '}
          <span onClick={onSwitchToRegister} style={linkStyle}>
            Cadastre-se agora
          </span>
        </p>
      </div>
    </div>
  );
}

// Estilos conforme a Documentação Técnica (uTask 3.0) [3, 4]
const containerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: 'var(--bg-primary)',
  transition: 'background-color 0.3s'
};

const loginBoxStyle: CSSProperties = {
  width: '100%',
  maxWidth: '400px',
  padding: '40px',
  textAlign: 'center'
};

const titleStyle: CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 700,
  color: 'var(--accent-color)', // #4890F5 [4, 5]
  marginBottom: '8px',
  fontFamily: 'Poppins, sans-serif'
};

const subtitleStyle: CSSProperties = {
  fontSize: '1rem',
  color: 'var(--text-primary)',
  opacity: 0.7,
  marginBottom: '32px',
  fontWeight: 300
};

const formStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const inputGroupStyle: CSSProperties = {
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const labelStyle: CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: 600,
  color: 'var(--text-primary)'
};

const inputStyle: CSSProperties = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)', 
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  fontSize: '1rem',
  outline: 'none'
};

const buttonStyle: CSSProperties = {
  padding: '14px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: 'var(--accent-color)',
  color: '#FFFFFF',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: '10px'
};

const footerTextStyle: CSSProperties = {
  marginTop: '24px',
  fontSize: '0.9rem',
  color: 'var(--text-primary)'
};

const linkStyle: CSSProperties = {
  color: 'var(--accent-color)',
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'underline'
};
