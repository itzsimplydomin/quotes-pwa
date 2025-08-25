import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './App.css'

// rejestracja SW (auto przez vite-plugin-pwa)
if ('serviceWorker' in navigator) {
  // Vite PWA sam doda /sw.js w produkcji
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)