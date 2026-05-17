import { useContext, useState } from 'react';
import type { FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import loginImg from '../assets/Ilustração do login.png';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export function Login({ onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const { signIn } = useContext(AuthContext);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError(false);

    if (email === '' || password === '') {
      toast.warn('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      await signIn({ email, password });
      toast.success('Bem-vindo ao uTask 3.0!');
    } catch {
      setLoginError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <header className="auth-top-bar" aria-hidden />

      <div className="auth-split-layout login-split-layout">
        <aside className="auth-illustration-col" aria-hidden>
          <img src={loginImg} alt="" />
        </aside>

        <div className="auth-divider login-split-divider" aria-hidden />

        <section className="auth-form-col auth-form-col--login">
          <div className="auth-form-inner">
            <h1 className="auth-brand-title auth-brand-title--login">uTask 3.0</h1>

            <form onSubmit={handleSubmit} className="auth-form">
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
                    className={`auth-input${loginError ? ' auth-input--error' : ''}`}
                    placeholder="Senha secreta"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLoginError(false);
                    }}
                    required
                    autoComplete="current-password"
                    aria-invalid={loginError}
                    aria-describedby={loginError ? 'login-password-error' : undefined}
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

              <button type="button" className="auth-forgot-link">
                Esqueceu a senha?
              </button>

              {loginError ? (
                <p id="login-password-error" className="auth-inline-error" role="alert">
                  Senha incorreta, tente novamente.
                </p>
              ) : null}

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <div className="auth-btn-rule" aria-hidden />

            <p className="auth-footer-text">
              Não tem cadastro?{' '}
              <button type="button" onClick={onSwitchToRegister} className="auth-footer-link">
                Crie uma conta
              </button>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
