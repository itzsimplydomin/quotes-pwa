// Strona profilu - informacje o użytkowniku, statystyki i eksport danych
import { useAuth } from '../store/auth'
import { useFavs } from '../store/favs'
import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'

export default function Profile() {
  const { user, logout } = useAuth()
  const favs = useFavs(s => s.favs)
  const nav = useNavigate()

  // Zliczamy kilka prostych statystyk na podstawie ulubionych cytatów
  const stats = useMemo(() => {
    const favorites = Object.values(favs)
    const authors = new Set(favorites.map(q => q.author))
    const totalWords = favorites.reduce((acc, q) => acc + q.quote.split(' ').length, 0)

    return {
      totalFavorites: favorites.length,
      uniqueAuthors: authors.size,
      totalWords,
      averageLength: favorites.length ? Math.round(totalWords / favorites.length) : 0
    }
  }, [favs])

  if (!user) return null

  // Wylogowanie i przekierowanie na stronę główną
  const handleLogout = () => {
    logout()
    nav('/')
  }

  // Eksport danych użytkownika i ulubionych do pliku JSON (lokalnie)
  const handleExportData = () => {
    const data = {
      user,
      favorites: Object.values(favs),
      exportDate: new Date().toISOString(),
      stats
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `moje-dane-cytaty-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Nagłówek profilu - avatar i podstawowe dane */}
      <div className="card">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          <div style={{ position: 'relative' }}>
            {user.image ? (
              <img
                src={user.image}
                alt={`${user.firstName} ${user.lastName}`}
                width={80}
                height={80}
                style={{
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--accent)'
                }}
              />
            ) : (
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {user.firstName?.charAt(0) || user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: '20px',
              height: '20px',
              background: 'var(--success)',
              borderRadius: '50%',
              border: '2px solid var(--bg-solid)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px'
            }}>
              ✓
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 4px 0' }}>
              {user.firstName} {user.lastName}
            </h2>
            <p className="small" style={{ margin: '0 0 8px 0', opacity: 0.8 }}>
              @{user.username}
            </p>
            <p className="small" style={{ margin: 0, opacity: 0.6 }}>
              📧 {user.email}
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: 'var(--glass)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--glass-border)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent)' }}>
              {stats.totalFavorites}
            </div>
            <div className="small">Ulubione</div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: 'var(--glass)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--glass-border)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--success)' }}>
              {stats.uniqueAuthors}
            </div>
            <div className="small">Autorzy</div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: 'var(--glass)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--glass-border)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--warning)' }}>
              {stats.averageLength}
            </div>
            <div className="small">Śr. słów</div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '16px',
            background: 'var(--glass)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--glass-border)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--muted)' }}>
              {stats.totalWords}
            </div>
            <div className="small">Wszystkich słów</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => nav('/favorites')}
            className="secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flex: '1',
              minWidth: '140px',
              justifyContent: 'center'
            }}
          >
            ❤️ Moje ulubione
          </button>

          <button
            onClick={handleExportData}
            className="secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flex: '1',
              minWidth: '140px',
              justifyContent: 'center'
            }}
          >
            💾 Eksportuj dane
          </button>
        </div>
      </div>

      {/* Szybkie akcje - skróty do najważniejszych widoków */}
      <div className="card">
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>🚀 Szybkie akcje</h3>

        <div style={{ display: 'grid', gap: '12px' }}>
          <button
            onClick={() => nav('/explore')}
            className="secondary"
            style={{
              padding: '16px',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--glass)'
            }}
          >
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                🔍 Odkrywaj nowe cytaty
              </div>
              <div className="small" style={{ opacity: 0.7 }}>
                Znajdź inspirujące słowa od różnych autorów
              </div>
            </div>
            <span style={{ fontSize: '20px' }}>→</span>
          </button>

          <button
            onClick={() => nav('/')}
            className="secondary"
            style={{
              padding: '16px',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--glass)'
            }}
          >
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                📅 Dzisiejszy cytat
              </div>
              <div className="small" style={{ opacity: 0.7 }}>
                Zobacz inspirację na dziś
              </div>
            </div>
            <span style={{ fontSize: '20px' }}>→</span>
          </button>
        </div>
      </div>

      {/* Ustawienia konta - informacje i wylogowanie */}
      <div className="card">
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>⚙️ Ustawienia konta</h3>

        <div style={{
          padding: '16px',
          background: 'var(--glass)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--glass-border)',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px' }}>ℹ️</span>
            <span style={{ fontWeight: '600' }}>Informacje o koncie</span>
          </div>
          <p className="small" style={{ margin: 0, opacity: 0.7 }}>
            To jest konto demonstracyjne używające DummyJSON API.
            Twoje ulubione cytaty są przechowywane lokalnie w przeglądarce.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="danger"
          style={{
            width: '100%',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          🚪 Wyloguj się
        </button>
      </div>
    </div>
  )
}
