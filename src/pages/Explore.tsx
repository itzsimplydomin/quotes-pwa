// Odkrywaj - przeglądanie, filtrowanie i losowanie cytatów, z ulubionymi na koncie
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchAllQuotes, fetchRandomQuote, type Quote } from '../api/dummyjson'
import { useFavs } from '../store/favs'
import { useAuth } from '../store/auth'

export default function Explore() {
  const [all, setAll] = useState<Quote[]>([])
  const [query, setQuery] = useState('')
  const [current, setCurrent] = useState<Quote | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRandomizing, setIsRandomizing] = useState(false)
  const [sortBy, setSortBy] = useState<'id' | 'author'>('id')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const { toggle, isFav, setUser } = useFavs()
  const { token, user } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()

  // Ustaw użytkownika w store ulubionych przy zmianie użytkownika
  // Przełącz ulubione na zalogowanego użytkownika (per-user cache)
  useEffect(() => {
    setUser(user?.username || null)
  }, [user?.username, setUser])

  useEffect(() => {
    (async () => {
      // Pobierz pełną listę i zapisz w cache na offline
      try {
        setIsLoading(true)
        const res = await fetchAllQuotes()
        setAll(res.quotes)
        localStorage.setItem('lastQuotes', JSON.stringify(res.quotes))
      } catch {
        const cached = localStorage.getItem('lastQuotes')
        if (cached) setAll(JSON.parse(cached))
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  // Losowanie cytatu - preferuj endpoint, fallback do lokalnej listy
  async function randomize() {
    setIsRandomizing(true)
    try {
      setCurrent(await fetchRandomQuote())
    } catch {
      if (all.length) setCurrent(all[Math.floor(Math.random() * all.length)])
    } finally {
      setIsRandomizing(false)
    }
  }

  // Dodaj/usuń z ulubionych - brak sesji przekieruje do logowania
  function onToggle(q: Quote) {
    if (!token || !user) {
      nav('/login', { state: { from: loc } })
      return
    }
    toggle(q, user.username)
  }

  const favLabel = (id: number) =>
    token ? (isFav(id) ? '❤️ Usuń z ulubionych' : '🤍 Dodaj do ulubionych') : '🔐 Zaloguj się'

  // Filtruj i sortuj w pamięci
  const filtered = useMemo(() => {
    let result = all.filter(q =>
      q.quote.toLowerCase().includes(query.toLowerCase()) ||
      q.author.toLowerCase().includes(query.toLowerCase())
    )

    return result.sort((a, b) => {
      if (sortBy === 'author') {
        return a.author.localeCompare(b.author)
      }
      return a.id - b.id
    })
  }, [all, query, sortBy])

  async function share(q: Quote) {
    const text = `"${q.quote}" — ${q.author}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cytat',
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

  if (isLoading) {
    return (
      <div className="card fade-in">
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '3px solid var(--glass-border)',
            borderTop: '3px solid var(--accent)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ marginTop: '16px', color: 'var(--muted)' }}>Ładowanie cytatów...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ margin: 0 }}>🔍 Odkrywaj cytaty</h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            className={viewMode === 'grid' ? '' : 'secondary'}
            onClick={() => setViewMode('grid')}
            style={{ padding: '8px 12px', minWidth: 'auto' }}
          >
            ⊞
          </button>
          <button
            className={viewMode === 'list' ? '' : 'secondary'}
            onClick={() => setViewMode('list')}
            style={{ padding: '8px 12px', minWidth: 'auto' }}
          >
            ☰
          </button>
        </div>
      </div>

      <div className="row form-controls" style={{ marginBottom: '24px' }}>
        <input
          placeholder="🔍 Szukaj po tekście lub autorze..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ flex: 1 }}
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as 'id' | 'author')}
        >
          <option value="id">Sortuj po ID</option>
          <option value="author">Sortuj po autorze</option>
        </select>
        <button
          onClick={randomize}
          disabled={isRandomizing}
          style={{
            background: isRandomizing ? 'var(--muted)' : undefined,
            cursor: isRandomizing ? 'not-allowed' : 'pointer'
          }}
        >
          {isRandomizing ? '🎲 Losuję...' : '🎲 Wylosuj'}
        </button>
      </div>

      {current && (
        <div style={{
          marginBottom: '32px',
          background: 'linear-gradient(135deg, var(--glass), rgba(59, 130, 246, 0.1))',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, var(--accent), var(--accent-hover))'
          }} />

          <div style={{ marginBottom: '8px' }}>
            <span style={{
              background: 'var(--accent)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}>
              Losowy cytat
            </span>
          </div>

          <p className="quote" style={{ margin: '16px 0', textAlign: 'center' }}>
            "{current.quote}"
          </p>
          <p className="small" style={{ textAlign: 'center', marginBottom: '20px', fontWeight: '600' }}>
            — {current.author}
          </p>

          <div className="row" style={{ gap: '12px' }}>
            <button onClick={() => onToggle(current)}>
              {favLabel(current.id)}
            </button>
            <button className="secondary" onClick={() => share(current)}>
              📤 Udostępnij
            </button>
          </div>
        </div>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--glass-border)'
      }}>
        <span className="small">
          {query ? `Znaleziono ${filtered.length} cytatów` : `${all.length} dostępnych cytatów`}
        </span>
        {query && (
          <button
            className="secondary"
            onClick={() => setQuery('')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            ✕ Wyczyść
          </button>
        )}
      </div>

      <div className={viewMode === 'grid' ? 'row' : ''} style={{
        gap: viewMode === 'grid' ? '20px' : '12px',
        display: viewMode === 'list' ? 'flex' : undefined,
        flexDirection: viewMode === 'list' ? 'column' : undefined
      }}>
        {filtered.slice(0, 20).map(q => (
          <div
            key={q.id}
            className="card"
            style={{
              flex: viewMode === 'grid' ? '1 1 300px' : undefined,
              padding: viewMode === 'list' ? '16px 20px' : '20px',
              display: viewMode === 'list' ? 'flex' : 'block',
              alignItems: viewMode === 'list' ? 'center' : undefined,
              gap: viewMode === 'list' ? '16px' : undefined
            }}
          >
            <div style={{ flex: viewMode === 'list' ? 1 : undefined }}>
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
            </div>

            <button
              onClick={() => onToggle(q)}
              style={{
                marginTop: viewMode === 'grid' ? '8px' : '0',
                minWidth: viewMode === 'list' ? '140px' : 'auto',
                fontSize: '13px',
                padding: '8px 12px'
              }}
            >
              {favLabel(q.id)}
            </button>
          </div>
        ))}
      </div>

      {filtered.length > 20 && (
        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          padding: '20px',
          background: 'var(--glass)',
          borderRadius: 'var(--radius-md)'
        }}>
          <p className="small" style={{ margin: 0 }}>
            Pokazano pierwsze 20 z {filtered.length} cytatów. Użyj wyszukiwarki, aby zawęzić wyniki.
          </p>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
