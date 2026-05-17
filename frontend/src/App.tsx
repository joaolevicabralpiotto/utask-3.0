import { useContext, useState } from 'react';
import { AuthContext } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Kanban } from './pages/Kanban';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { signed } = useContext(AuthContext);
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <>
      <ToastContainer autoClose={3000} theme="colored" />

      {signed ? (
        <div
          style={{
            height: '100vh',
            maxHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-primary)'
          }}
        >
          <Header />
          <main
            style={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <Kanban />
          </main>
          <Footer />
        </div>
      ) : isLoginView ? (
        <Login onSwitchToRegister={() => setIsLoginView(false)} />
      ) : (
        <Register onSwitchToLogin={() => setIsLoginView(true)} />
      )}
    </>
  );
}

export default App;
