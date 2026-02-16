import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fffdf7',
            color: '#1f2937',
            border: '2px solid #d4af37',
            borderRadius: '0.75rem',
            padding: '16px',
            boxShadow: '0 10px 40px 0 rgba(212, 175, 55, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#138808',
              secondary: '#fffdf7',
            },
          },
          error: {
            iconTheme: {
              primary: '#dc2626',
              secondary: '#fffdf7',
            },
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>,
)
