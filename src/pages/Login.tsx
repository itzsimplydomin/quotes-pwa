// Logowanie - prosty formularz z kontami demo i przekierowaniem po sukcesie
import { useState } from 'react'
import { login } from '../api/dummyjson'
import { useAuth } from '../store/auth'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('emilys')
  const [password, setPassword] = useState('emilyspass')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const setAuth = useAuth(s => s.setAuth)
  const nav = useNavigate()
  const loc = useLocation() as any

  // Obsługa logowania: wywołaj API, zapisz stan w store i wróć na poprzednią stronę
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const res = await login(username, password)
      setAuth(res.accessToken, {
        username: res.username,
        firstName: res.firstName,
        lastName: res.lastName,
        email: res.email,
        image: res.image
      })
      nav(loc.state?.from?.pathname ?? '/profile', { replace: true })
    } catch {
      setError('Niepoprawne dane logowania. Sprawdź nazwę użytkownika i hasło.')
    } finally {
      setIsLoading(false)
    }
  }

  // Wygodne „konta demo” do testów bez przepisywania danych
  const demoUsers = [
    { username: 'emilys', password: 'emilyspass', name: 'Emily Johnson' },
    { username: 'michaelw', password: 'michaelwpass', name: 'Michael Williams' },
    { username: 'sophiab', password: 'sophiabpass', name: 'Sophia Brown' }
  ]

  return (
    <div className="card fade-in" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: '32px'
        }}>
          🔐
        </div>
        <h2 style={{ margin: '0 0 8px 0' }}>Zaloguj się</h2>
        <p className="small" style={{ margin: 0, opacity: 0.8 }}>
          Dostęp do ulubionych cytatów i personalizacji
        </p>
      </div>

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ marginBottom: '8px', display: 'block', fontWeight: '600' }}>
            Nazwa użytkownika
          </label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Wprowadź nazwę użytkownika"
            required
            autoComplete="username"
            style={{
              background: 'var(--glass)',
              border: '2px solid var(--glass-border)',
              transition: 'all 0.3s ease'
            }}
          />
        </div>

        <div>
          <label style={{ marginBottom: '8px', display: 'block', fontWeight: '600' }}>
            Hasło
          </label>
          <div style={{ position: 'relative' }}>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Wprowadź hasło"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              style={{
                background: 'var(--glass)',
                border: '2px solid var(--glass-border)',
                paddingRight: '50px',
                transition: 'all 0.3s ease'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                padding: '4px',
                fontSize: '16px'
              }}
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚠️</span>
            <span className="small">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            background: isLoading ? 'var(--muted)' : 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            padding: '14px 20px',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {isLoading ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid currentColor',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Logowanie...
            </>
          ) : (
            <>
              🚀 Zaloguj się
            </>
          )}
        </button>
      </form>

      <div style={{
        marginTop: '32px',
        padding: '20px',
        background: 'var(--glass)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--glass-border)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
          🧪 Konta demo
        </h3>
        <p className="small" style={{ marginBottom: '16px', opacity: 0.8 }}>
          Kliknij, aby szybko zalogować się na konto testowe:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {demoUsers.map((user, index) => (
            <button
              key={index}
              type="button"
              className="secondary"
              onClick={() => {
                setUsername(user.username)
                setPassword(user.password)
              }}
              style={{
                textAlign: 'left',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>{user.name}</div>
                <div className="small" style={{ opacity: 0.7 }}>
                  {user.username}
                </div>
              </div>
              <span style={{ fontSize: '12px', opacity: 0.5 }}>👤</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: '24px',
        padding: '16px',
        borderTop: '1px solid var(--glass-border)'
      }}>
        <p className="small" style={{ margin: 0, opacity: 0.6 }}>
          💡 To jest aplikacja demonstracyjna używająca DummyJSON API
        </p>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
