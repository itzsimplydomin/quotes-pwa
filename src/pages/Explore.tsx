import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchAllQuotes, fetchRandomQuote, type Quote } from '../api/dummyjson'
import { useFavs } from '../store/favs'
import { useAuth } from '../store/auth'

export default function Explore() {
  const [all, setAll] = useState<Quote[]>([])
  const [query, setQuery] = useState('')
  const [current, setCurrent] = useState<Quote | null>(null)

  const { toggle, isFav } = useFavs()
  const token = useAuth(s => s.token)
  const nav = useNavigate()
  const loc = useLocation()

  useEffect(() => { (async () => {
    try {
      const res = await fetchAllQuotes()
      setAll(res.quotes)
    } catch {
      const cached = localStorage.getItem('lastQuotes')
      if (cached) setAll(JSON.parse(cached))
    }
  })() }, [])

  async function randomize() {
    try { setCurrent(await fetchRandomQuote()) }
    catch {
      if (all.length) setCurrent(all[Math.floor(Math.random() * all.length)])
    }
  }

  // >>> WAŻNE: strażnik autoryzacji dla dodawania/odejmowania z ulubionych
  function onToggle(q: Quote) {
    if (!token) {
      // opcjonalnie: alert('Zaloguj się, aby dodawać do ulubionych')
      nav('/login', { state: { from: loc } }) // po logowaniu wrócisz tu
      return
    }
    toggle(q)
  }

  const favLabel = (id: number) =>
    token ? (isFav(id) ? 'Usuń z ulubionych' : 'Dodaj do ulubionych') : 'Zaloguj, aby dodać'

  const filtered = useMemo(() =>
    all.filter(q =>
      q.quote.toLowerCase().includes(query.toLowerCase()) ||
      q.author.toLowerCase().includes(query.toLowerCase())
    ), [all, query])

  async function share(q: Quote) {
    const text = `"${q.quote}" — ${q.author}`
    if (navigator.share) {
      try { await navigator.share({ title: 'Cytat', text }) } catch {}
    } else {
      await navigator.clipboard.writeText(text)
      alert('Skopiowano cytat do schowka ✅')
    }
  }

  return (
    <div className="card">
      <h2>Odkrywaj</h2>
      <div className="row">
        <input
          placeholder="Szukaj po tekście lub autorze…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button onClick={randomize}>Wylosuj cytat</button>
      </div>

      {current && (
        <div style={{ marginTop: 12 }}>
          <p className="quote">“{current.quote}”</p>
          <p className="small">— {current.author}</p>
          <div className="row">
            <button onClick={() => onToggle(current)}>{favLabel(current.id)}</button>
            <button onClick={() => share(current)}>Udostępnij</button>
          </div>
        </div>
      )}

      <hr style={{ borderColor: '#1b2240', margin: '16px 0' }} />

      <div className="row">
        {filtered.slice(0, 12).map(q => (
          <div key={q.id} className="card" style={{ flex: '1 1 260px' }}>
            <div className="small">#{q.id}</div>
            <div style={{ minHeight: 90 }} className="quote">“{q.quote}”</div>
            <div className="small">— {q.author}</div>
            <button onClick={() => onToggle(q)} style={{ marginTop: 8 }}>
              {favLabel(q.id)}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
