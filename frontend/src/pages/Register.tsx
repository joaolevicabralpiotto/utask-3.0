import { useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export function Register({ onSwitchToLogin }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pwdMismatch, setPwdMismatch] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setPwdMismatch(true);
      toast.error('Senhas não combinam, tente novamente.');
      return;
    }
    setPwdMismatch(false);

    try {
      await api.post('/usuarios', { name, email, password });

      toast.success('Cadastro realizado com sucesso! Faça seu login.');
      onSwitchToLogin();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || 'Erro ao cadastrar usuário.';
      toast.error(message);
    }
  }

  const inputShellStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  };

  const fieldBaseStyle = (hasError: boolean): CSSProperties => ({
    width: '100%',
    padding: '12px 44px 12px 14px',
    borderRadius: '10px',
    border: `1px solid ${hasError ? 'var(--color-error)' : 'var(--color-link)'}`,
    backgroundColor: hasError ? 'var(--color-error-soft)' : 'var(--input-bg)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: '1rem',
    fontWeight: 400,
    outline: 'none',
    boxSizing: 'border-box'
  });

  const eyeBtnStyle: CSSProperties = {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    padding: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-link)'
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={brandTitleStyle}>uTask 3.0</h1>
        <div style={brandUnderlineStyle} aria-hidden />

        <h2 style={sectionTitleStyle}>Crie uma conta</h2>

        <form onSubmit={handleRegister} style={formStyle}>
          <label style={labelStyle}>
            Nome
            <input
              type="text"
              placeholder="Seu nome de usuário"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={textInputStyle}
              required
              autoComplete="name"
            />
          </label>

          <label style={labelStyle}>
            E-mail
            <input
              type="email"
              placeholder="Endereço de e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={textInputStyle}
              required
              autoComplete="email"
            />
          </label>

          <label style={labelStyle}>
            Senha
            <div style={inputShellStyle}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha secreta"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPwdMismatch(false);
                }}
                style={fieldBaseStyle(pwdMismatch)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                onClick={() => setShowPassword((v) => !v)}
                style={eyeBtnStyle}
              >
                {showPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
              </button>
            </div>
          </label>

          <label style={labelStyle}>
            Confirmar senha
            <div style={inputShellStyle}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Senha secreta"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPwdMismatch(false);
                }}
                style={fieldBaseStyle(pwdMismatch)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'}
                onClick={() => setShowConfirmPassword((v) => !v)}
                style={eyeBtnStyle}
              >
                {showConfirmPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
              </button>
            </div>
          </label>

          {pwdMismatch ? (
            <p style={inlineErrorStyle} role="alert">
              Senhas não combinam, tente novamente.
            </p>
          ) : null}

          <button type="submit" style={submitBtnStyle}>
            Criar Cadastro
          </button>
        </form>

        <p style={footerTextStyle}>
          Já tem uma conta?{' '}
          <button type="button" onClick={onSwitchToLogin} style={linkButtonStyle}>
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
}

const pageStyle: CSSProperties = {
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px 20px',
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-sans)',
  boxSizing: 'border-box'
};

const cardStyle: CSSProperties = {
  width: '100%',
  maxWidth: '420px',
  textAlign: 'center'
};

const brandTitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-sans)',
  fontWeight: 700,
  fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
  color: 'var(--color-primary)',
  letterSpacing: '-0.02em'
};

const brandUnderlineStyle: CSSProperties = {
  height: 2,
  width: '100%',
  maxWidth: 200,
  margin: '12px auto 28px',
  background: 'var(--border-strong)',
  borderRadius: 1
};

const sectionTitleStyle: CSSProperties = {
  margin: '0 0 24px',
  textAlign: 'left',
  fontFamily: 'var(--font-sans)',
  fontWeight: 700,
  fontSize: '1.125rem',
  color: 'var(--text-primary)'
};

const formStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
  width: '100%',
  textAlign: 'left'
};

const labelStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  fontSize: '0.875rem',
  color: 'var(--text-primary)'
};

const textInputStyle: CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid var(--color-link)',
  backgroundColor: 'var(--input-bg)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-sans)',
  fontSize: '1rem',
  fontWeight: 400,
  outline: 'none',
  boxSizing: 'border-box'
};

const inlineErrorStyle: CSSProperties = {
  margin: '-4px 0 0',
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: 'var(--color-error)'
};

const submitBtnStyle: CSSProperties = {
  marginTop: '8px',
  width: '100%',
  padding: '14px 20px',
  borderRadius: '999px',
  border: 'none',
  backgroundColor: 'var(--primary-blue)',
  color: '#ffffff',
  fontFamily: 'var(--font-sans)',
  fontWeight: 700,
  fontSize: '1rem',
  cursor: 'pointer',
  boxShadow: '0 2px 10px rgba(72, 144, 245, 0.35)'
};

const footerTextStyle: CSSProperties = {
  marginTop: '28px',
  fontSize: '0.875rem',
  color: 'var(--text-primary)',
  fontWeight: 400
};

const linkButtonStyle: CSSProperties = {
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  fontSize: 'inherit',
  color: 'var(--color-link)',
  textDecoration: 'underline'
};
