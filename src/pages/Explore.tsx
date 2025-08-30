import { useEffect, useMemo, useState } from 'react'
import { fetchAllQuotes, fetchRandomQuote, type Quote } from '../api/dummyjson'
import { useFavs } from '../store/favs'

export default function Explore() {
  const [all, setAll] = useState<Quote[]>([])
  const [query, setQuery] = useState('')
  const [current, setCurrent] = useState<Quote | null>(null)
  const { toggle, isFav } = useFavs()

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchAllQuotes()
        setAll(res.quotes)
      } catch {
        const cached = localStorage.getItem('lastQuotes')
        if (cached) setAll(JSON.parse(cached))
      }
    })()
  }, [])

  async function randomize() {
    try { setCurrent(await fetchRandomQuote()) }
    catch { if (all.length) setCurrent(all[Math.floor(Math.random() * all.length)]) }
  }

  const filtered = useMemo(() =>
    all.filter(q => q.quote.toLowerCase().includes(query.toLowerCase()) || q.author.toLowerCase().includes(query.toLowerCase())), [all, query])

  return (
    <div className="card">
      <h2>Odkrywaj</h2>
      <div className="row">
        <input placeholder="Szukaj po tekście lub autorze…" value={query} onChange={e => setQuery(e.target.value)} />
        <button onClick={randomize}>Wylosuj cytat</button>
      </div>
      {current && (
        <div style={{ marginTop: 12 }}>
          <p className="quote">“{current.quote}”</p>
          <p className="small">— {current.author}</p>
          <button onClick={() => toggle(current)}>{isFav(current.id) ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}</button>
        </div>
      )}
      <hr style={{ borderColor: '#1b2240', margin: '16px 0' }} />
      <div className="row">
        {filtered.slice(0, 12).map(q => (
          <div key={q.id} className="card" style={{ flex: '1 1 260px' }}>
            <div className="small">#{q.id}</div>
            <div style={{ minHeight: 90 }} className="quote">“{q.quote}”</div>
            <div className="small">— {q.author}</div>
            <button onClick={() => toggle(q)} style={{ marginTop: 8 }}>
              {isFav(q.id) ? 'Usuń z ulubionych' : 'Ulubione +'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
