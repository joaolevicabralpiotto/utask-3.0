import { createContext, useState, ReactNode } from 'react';
import api from '../services/api'; // Importando sua config do Axios

// Definição dos dados do usuário
interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  signed: boolean; // Indica se o usuário está logado ou não
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  async function signIn({ email, password }: any) {
    try {
      // 1. Faz a chamada POST para o seu backend (/login)
      const response = await api.post('/login', { email, password });

      // 2. O backend retorna { user, token }
      const { user, token } = response.data;

      // 3. Guarda o usuário no estado do React
      setUser(user);

      // 4. Configura o Axios para enviar o token automaticamente nas próximas chamadas
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      console.log("Login realizado com sucesso!", user);
      
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("E-mail ou senha incorretos!");
    }
  }

  return (
    // signed é true se houver um usuário no estado
    <AuthContext.Provider value={{ user, signed: !!user, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
