import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Kanban } from './pages/Kanban'; // 1. Importa a nova página
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Lembre-se de usar o nome correto do CSS aqui

function App() {
  // Pegamos a informação se o usuário está logado
  const { signed } = useContext(AuthContext);

  return (
    <>
      <ToastContainer autoClose={3000} />
      
      {/* Lógica de Decisão: */}
      {signed ? (
        // Se estiver LOGADO, mostra isso:
        <>
          <Header />

          <Kanban /> 
          <Footer />
        </>
      ) : (
        // Se NÃO estiver logado, mostra isso:
        <Login />
      )}
    </>
  );
}

export default App;
