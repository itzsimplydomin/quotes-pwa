import { useEffect, useMemo, useState } from 'react'
import { fetchAllQuotes, type Quote } from '../api/dummyjson'

export default function Home() {
  const [quotes, setQuotes] = useState<Quote[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [font, setFont] = useState<number>(() => Number(localStorage.getItem('fontSize') ?? 20))
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

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
        setIsLoading(true)
        const data = await fetchAllQuotes()
        setQuotes(data.quotes)
        localStorage.setItem('lastQuotes', JSON.stringify(data.quotes))
      } catch {
        const cached = localStorage.getItem('lastQuotes')
        if (cached) setQuotes(JSON.parse(cached))
        else setError('Brak danych offline – uruchom raz z Internetem.')
      } finally {
        setIsLoading(false)
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
      u.lang = 'pl-PL'
      speechSynthesis.speak(u)
    } else {
      alert('API mowy nie jest wspierane w tej przeglądarce.')
    }
  }

  async function copyToClipboard(q: Quote) {
    const text = `"${q.quote}" — ${q.author}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  async function share(q: Quote) {
    const text = `"${q.quote}" — ${q.author}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cytat dnia',
          text,
          url: window.location.href
        })
      } catch (err) {
        // Użytkownik anulował lub błąd
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Share failed:', err)
          await copyToClipboard(q)
        }
      }
    } else {
      await copyToClipboard(q)
    }
  }

  const handleFontChange = (value: number) => {
    setFont(value)
    localStorage.setItem('fontSize', String(value))
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
          <p style={{ marginTop: '16px', color: 'var(--muted)' }}>Ładowanie dzisiejszego cytatu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card fade-in">
      <h2>Dzisiejszy cytat</h2>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          marginBottom: '24px',
          color: 'var(--danger)'
        }}>
          <p className="small" style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      {quote ? (
        <div style={{ animation: 'fadeIn 0.8s ease-out' }}>
          <div style={{
            background: 'var(--glass)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px 24px',
            margin: '24px 0',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, var(--accent), var(--accent-hover))',
              opacity: 0.6
            }} />

            <p
              className="quote"
              style={{
                fontSize: font,
                textAlign: 'center',
                margin: '0 0 16px 0',
                fontStyle: 'italic'
              }}
            >
              {quote.quote}
            </p>

            <p
              className="small"
              style={{
                textAlign: 'center',
                margin: 0,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              — {quote.author}
            </p>
          </div>

          <div className="row form-controls" style={{ marginBottom: '24px' }}>
            <label className="inline small">
              <span>Wielkość czcionki:</span>
              <input
                type="range"
                min={16}
                max={32}
                value={font}
                onChange={(e) => handleFontChange(Number(e.target.value))}
                style={{ width: '120px' }}
              />
              <span>{font}px</span>
            </label>
          </div>

          <div className="row" style={{ gap: '12px' }}>
            <button
              onClick={() => copyToClipboard(quote)}
              style={{
                background: copied ? 'linear-gradient(135deg, var(--success), #059669)' : undefined
              }}
            >
              {copied ? '✓ Skopiowano!' : '📋 Kopiuj'}
            </button>

            <button
              className="secondary"
              onClick={() => speak(quote)}
            >
              🔊 Przeczytaj
            </button>

            <button
              className="secondary"
              onClick={() => share(quote)}
            >
              📤 Udostępnij
            </button>
          </div>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'var(--glass)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center'
          }}>
            <p className="small" style={{ margin: 0, opacity: 0.7 }}>
              💡 Ten cytat zmienia się codziennie o północy
            </p>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p className="small">Brak dostępnych cytatów</p>
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