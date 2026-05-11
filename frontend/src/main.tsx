import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx' // Importe o novo Provider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider> {/* O ThemeProvider envolve o App */}
        <App />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
)
