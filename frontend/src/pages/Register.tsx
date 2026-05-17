import { useState } from 'react';
import type { FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import registerImg from '../assets/Ilustração do cadastro.png';

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

  return (
    <div className="auth-page">
      <header className="auth-top-bar" aria-hidden />

      <div className="auth-split-layout login-split-layout">
        <section className="auth-form-col auth-form-col--register">
          <div className="auth-form-inner">
            <h1 className="auth-brand-title">uTask 3.0</h1>

            <h2 className="auth-section-heading">Crie uma conta</h2>

            <form onSubmit={handleRegister} className="auth-form">
              <label className="auth-label">
                Nome
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Seu nome de usuário"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </label>

              <label className="auth-label">
                E-mail
                <input
                  type="email"
                  className="auth-input"
                  placeholder="Endereço de e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </label>

              <label className="auth-label">
                Senha
                <div className="auth-input-shell">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`auth-input${pwdMismatch ? ' auth-input--error' : ''}`}
                    placeholder="Senha secreta"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPwdMismatch(false);
                    }}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff size={15} strokeWidth={1.75} /> : <Eye size={15} strokeWidth={1.75} />}
                  </button>
                </div>
              </label>

              <label className="auth-label">
                Confirmar senha
                <div className="auth-input-shell">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`auth-input${pwdMismatch ? ' auth-input--error' : ''}`}
                    placeholder="Senha secreta"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPwdMismatch(false);
                    }}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                  >
                    {showConfirmPassword ? <EyeOff size={15} strokeWidth={1.75} /> : <Eye size={15} strokeWidth={1.75} />}
                  </button>
                </div>
              </label>

              {pwdMismatch ? (
                <p className="auth-inline-error" role="alert">
                  Senhas não combinam, tente novamente.
                </p>
              ) : null}

              <button type="submit" className="auth-submit-btn">
                Criar Cadastro
              </button>
            </form>

            <div className="auth-btn-rule" aria-hidden />

            <p className="auth-footer-text">
              Já tem uma conta?{' '}
              <button type="button" onClick={onSwitchToLogin} className="auth-footer-link">
                Entrar
              </button>
            </p>
          </div>
        </section>

        <div className="auth-divider login-split-divider" aria-hidden />

        <aside className="auth-illustration-col auth-illustration-col--register" aria-hidden>
          <img src={registerImg} alt="" />
        </aside>
      </div>
    </div>
  );
}
