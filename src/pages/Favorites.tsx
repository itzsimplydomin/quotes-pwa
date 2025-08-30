import { useMemo, useState } from 'react'
import { useFavs } from '../store/favs'
import { useAuth } from '../store/auth'

export default function Favorites() {
  const { favs, toggle } = useFavs()
  const user = useAuth(s => s.user)
  const [sortBy, setSortBy] = useState<'added' | 'author' | 'length'>('added')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const items = useMemo(() => {
    let result = Object.values(favs)

    // Filter by search query
    if (searchQuery) {
      result = result.filter(q =>
        q.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    return result.sort((a, b) => {
      switch (sortBy) {
        case 'author':
          return a.author.localeCompare(b.author)
        case 'length':
          return a.quote.length - b.quote.length
        case 'added':
        default:
          return b.id - a.id // Newer first
      }
    })
  }, [favs, sortBy, searchQuery])

  async function shareQuote(q: any) {
    const text = `"${q.quote}" — ${q.author}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ulubiony cytat',
          text,
          url: window.location.href
        })
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          await navigator.clipboard.writeText(text)
          alert('Skopiowano cytat do schowka ✅')
        }
      }
    } else {
      await navigator.clipboard.writeText(text)
      alert('Skopiowano cytat do schowka ✅')
    }
  }

  async function exportFavorites() {
    const data = {
      user: user?.username || 'anonymous',
      exportDate: new Date().toISOString(),
      favorites: items
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ulubione-cytaty-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (items.length === 0 && !searchQuery) {
    return (
      <div className="card fade-in">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '20px',
            opacity: 0.3
          }}>
            💭
          </div>
          <h2 style={{ marginBottom: '12px' }}>Brak ulubionych cytatów</h2>
          <p className="small" style={{ marginBottom: '24px', opacity: 0.7, maxWidth: '400px', margin: '0 auto 24px' }}>
            Dodaj swoje ulubione cytaty w zakładce „Odkrywaj", aby móc do nich szybko wracać
          </p>
          <a
            href="/explore"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
              color: 'white',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            🔍 Odkrywaj cytaty
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="card fade-in">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0' }}>❤️ Ulubione cytaty</h2>
          <p className="small" style={{ margin: 0, opacity: 0.7 }}>
            {user?.firstName ? `${user.firstName}, ` : ''}masz {items.length} {items.length === 1 ? 'ulubiony cytat' : 'ulubionych cytatów'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            className={viewMode === 'grid' ? '' : 'secondary'}
            onClick={() => setViewMode('grid')}
            style={{ padding: '8px 12px', minWidth: 'auto' }}
            title="Widok siatki"
          >
            ⊞
          </button>
          <button
            className={viewMode === 'list' ? '' : 'secondary'}
            onClick={() => setViewMode('list')}
            style={{ padding: '8px 12px', minWidth: 'auto' }}
            title="Widok listy"
          >
            ☰
          </button>
        </div>
      </div>

      {items.length > 0 && (
        <>
          <div className="row form-controls" style={{ marginBottom: '24px' }}>
            <input
              placeholder="🔍 Szukaj w ulubionych..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ flex: 1 }}
            />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'added' | 'author' | 'length')}
            >
              <option value="added">Ostatnio dodane</option>
              <option value="author">Sortuj po autorze</option>
              <option value="length">Sortuj po długości</option>
            </select>
            <button
              className="secondary"
              onClick={exportFavorites}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              💾 Eksportuj
            </button>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--glass-border)'
          }}>
            <span className="small">
              {searchQuery ? `Znaleziono ${items.length} cytatów` : `${items.length} ulubionych cytatów`}
            </span>
            {searchQuery && (
              <button
                className="secondary"
                onClick={() => setSearchQuery('')}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                ✕ Wyczyść
              </button>
            )}
          </div>
        </>
      )}

      {items.length === 0 && searchQuery ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>🔍</div>
          <h3 style={{ marginBottom: '8px' }}>Brak wyników</h3>
          <p className="small" style={{ opacity: 0.7 }}>
            Nie znaleziono cytatów pasujących do "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'row' : ''} style={{
          gap: viewMode === 'grid' ? '20px' : '12px',
          display: viewMode === 'list' ? 'flex' : undefined,
          flexDirection: viewMode === 'list' ? 'column' : undefined
        }}>
          {items.map(q => (
            <div
              key={q.id}
              className="card"
              style={{
                flex: viewMode === 'grid' ? '1 1 320px' : undefined,
                padding: '20px',
                position: 'relative',
                display: viewMode === 'list' ? 'flex' : 'block',
                alignItems: viewMode === 'list' ? 'flex-start' : undefined,
                gap: viewMode === 'list' ? '16px' : undefined
              }}
            >
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '14px'
              }}
                onClick={() => toggle(q)}
                title="Usuń z ulubionych"
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
                  e.currentTarget.style.transform = 'scale(1.1)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                ❤️
              </div>

              <div style={{ flex: viewMode === 'list' ? 1 : undefined, paddingRight: '40px' }}>
                <div className="small" style={{
                  marginBottom: '8px',
                  color: 'var(--accent)',
                  fontWeight: '600'
                }}>
                  #{q.id}
                </div>

                <div
                  style={{
                    minHeight: viewMode === 'grid' ? 80 : 'auto',
                    marginBottom: '12px',
                    fontSize: viewMode === 'list' ? '16px' : '18px',
                    lineHeight: 1.5
                  }}
                  className="quote"
                >
                  "{q.quote}"
                </div>

                <div className="small" style={{
                  marginBottom: '16px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  — {q.author}
                </div>

                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  marginTop: 'auto'
                }}>
                  <button
                    className="secondary"
                    onClick={() => shareQuote(q)}
                    style={{
                      fontSize: '12px',
                      padding: '6px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    📤 Udostępnij
                  </button>

                  <button
                    className="secondary"
                    onClick={() => navigator.clipboard.writeText(`"${q.quote}" — ${q.author}`)}
                    style={{
                      fontSize: '12px',
                      padding: '6px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    📋 Kopiuj
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div style={{
          marginTop: '32px',
          padding: '20px',
          background: 'var(--glass)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center'
        }}>
          <p className="small" style={{ margin: 0, opacity: 0.7 }}>
            💡 Twoje ulubione cytaty są synchronizowane i dostępne offline
          </p>
        </div>
      )}
    </div>
  )
}