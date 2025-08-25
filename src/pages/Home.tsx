import { useEffect, useMemo, useState } from 'react'
import { fetchAllQuotes, type Quote } from '../api/dummyjson'

export default function Home() {
  const [quotes, setQuotes] = useState<Quote[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [font, setFont] = useState<number>(() => Number(localStorage.getItem('fontSize') ?? 20))

  const dayIndex = useMemo(() => {
    const today = new Date()
    const start = new Date(today.getFullYear(), 0, 0)
    const diff = +today - +start
    const oneDay = 1000 * 60 * 60 * 24
    return Math.floor(diff / oneDay)
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAllQuotes()
        setQuotes(data.quotes)
        localStorage.setItem('lastQuotes', JSON.stringify(data.quotes))
      } catch {
        const cached = localStorage.getItem('lastQuotes')
        if (cached) setQuotes(JSON.parse(cached))
        else setError('Brak danych offline – uruchom raz z Internetem.')
      }
    })()
  }, [])

  const quote = useMemo(() => {
    if (!quotes || quotes.length === 0) return null
    const idx = (dayIndex - 1) % quotes.length
    return quotes[idx]
  }, [quotes, dayIndex])

  function speak(q: Quote) {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(`${q.quote} — ${q.author}`)
      speechSynthesis.speak(u)
    } else alert('API mowy nie jest wspierane.')
  }

  return (
    <div className="card">
      <h2>Dzisiejszy cytat</h2>
      {error && <p className="small">{error}</p>}
      {quote ? (
        <>
          <p className="quote" style={{ fontSize: font }}>{quote.quote}</p>
          <p className="small">— {quote.author}</p>
          <div className="row">
            <button onClick={() => navigator.clipboard.writeText(`"${quote.quote}" — ${quote.author}`)}>Kopiuj</button>
            <button onClick={() => speak(quote)}>Przeczytaj na głos</button>
            <label className="small">Wielkość czcionki
              <input type="range" min={16} max={32} value={font}
                onChange={(e) => { const v = Number(e.target.value); setFont(v); localStorage.setItem('fontSize', String(v)) }} />
            </label>
          </div>
        </>
      ) : <p>Ładowanie…</p>}
    </div>
  )
}
