import { useOnline } from '../hooks/useOnline'
import { useState, useEffect } from 'react'

export default function OfflineBanner() {
  const online = useOnline()
  const [show, setShow] = useState(false)
  const [justWentOffline, setJustWentOffline] = useState(false)

  useEffect(() => {
    if (!online) {
      setShow(true)
      setJustWentOffline(true)
      setTimeout(() => setJustWentOffline(false), 3000)
    } else {
      // Delay hiding when going online to show "back online" message
      if (show) {
        setTimeout(() => setShow(false), 2000)
      }
    }
  }, [online, show])

  if (!show) return null

  return (
    <div style={{
      position: 'fixed',
      left: '16px',
      right: '16px',
      top: '16px',
      zIndex: 9999,
      background: online ? 'linear-gradient(135deg, var(--success), #059669)' : 'linear-gradient(135deg, var(--warning), #d97706)',
      color: 'white',
      padding: '12px 16px',
      borderRadius: 'var(--radius-lg)',
      textAlign: 'center',
      boxShadow: 'var(--shadow-xl)',
      backdropFilter: 'var(--blur)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      animation: justWentOffline ? 'slideDown 0.3s ease-out' : 'fadeIn 0.3s ease-out',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontWeight: '600',
      fontSize: '14px'
    }}>
      <span style={{ fontSize: '16px' }}>
        {online ? '✅' : '📵'}
      </span>
      <span>
        {online
          ? 'Połączenie przywrócone – dane są synchronizowane'
          : 'Jesteś offline – wyświetlamy dane z pamięci'
        }
      </span>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}