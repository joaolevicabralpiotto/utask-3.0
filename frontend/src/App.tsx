import { useContext, useState } from 'react';
import { AuthContext } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Kanban } from './pages/Kanban';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastContainer } from 'react-toastify';
// IMPORT CORRIGIDO ABAIXO:
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
  const { signed } = useContext(AuthContext);
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <>
      {/* O ToastContainer deve ser configurado aqui */}
      <ToastContainer autoClose={3000} theme="colored" />
      
      {signed ? (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Kanban />
          </main>
          <Footer />
        </div>
      ) : (
        isLoginView ? (
          <Login onSwitchToRegister={() => setIsLoginView(false)} />
        ) : (
          <Register onSwitchToLogin={() => setIsLoginView(true)} />
        )
      )}
    </>
  );
}

export default App;