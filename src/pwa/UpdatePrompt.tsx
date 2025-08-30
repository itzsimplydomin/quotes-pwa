import { useRegisterSW } from 'virtual:pwa-register/react'
import { useState } from 'react'

export default function UpdatePrompt() {
  const { needRefresh, updateServiceWorker, offlineReady } = useRegisterSW()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      await updateServiceWorker(true)
    } catch (error) {
      console.error('Update failed:', error)
      setIsUpdating(false)
    }
  }

  if (offlineReady?.[0]) {
    // Optionally show a brief "ready for offline use" message
  }

  if (!needRefresh?.[0]) return null

  return (
    <div style={{
      position: 'fixed',
      left: '16px',
      bottom: '16px',
      right: '16px',
      zIndex: 9999,
      background: 'var(--surface)',
      backdropFilter: 'var(--blur)',
      border: '1px solid var(--glass-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px 20px',
      boxShadow: 'var(--shadow-xl)',
      animation: 'slideUp 0.3s ease-out',
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          flexShrink: 0
        }}>
          🔄
        </div>

        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
            Dostępna aktualizacja
          </h4>
          <p className="small" style={{ margin: '0 0 16px 0', opacity: 0.8, lineHeight: 1.4 }}>
            Nowa wersja aplikacji jest gotowa. Zaktualizuj, aby uzyskać najnowsze funkcje i poprawki.
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              style={{
                background: isUpdating
                  ? 'var(--muted)'
                  : 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
                cursor: isUpdating ? 'not-allowed' : 'pointer',
                padding: '10px 16px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flex: 1
              }}
            >
              {isUpdating ? (
                <>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    border: '2px solid transparent',
                    borderTop: '2px solid currentColor',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Aktualizuję...
                </>
              ) : (
                <>
                  ✨ Zaktualizuj teraz
                </>
              )}
            </button>

            <button
              onClick={() => {
                // Hide the prompt temporarily (it will show again on next visit)
                const event = new CustomEvent('sw-update-dismissed')
                window.dispatchEvent(event)
              }}
              className="secondary"
              style={{
                padding: '10px 12px',
                fontSize: '14px',
                minWidth: 'auto'
              }}
              title="Zamknij"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}