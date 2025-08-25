import { useState } from 'react'
import { login } from '../api/dummyjson'
import { useAuth } from '../store/auth'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('emilys')
  const [password, setPassword] = useState('emilyspass')
  const [error, setError] = useState<string | null>(null)
  const setAuth = useAuth(s => s.setAuth)
  const nav = useNavigate()
  const loc = useLocation() as any

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const res = await login(username, password)
      setAuth(res.accessToken, { username: res.username, firstName: res.firstName, lastName: res.lastName, email: res.email, image: res.image })
      nav(loc.state?.from?.pathname ?? '/profile', { replace: true })
    } catch {
      setError('Niepoprawne dane logowania')
    }
  }

  return (
    <div className="card">
      <h2>Logowanie</h2>
      <form onSubmit={onSubmit} className="row">
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Nazwa użytkownika" required />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Hasło" type="password" required />
        <button type="submit">Zaloguj</button>
      </form>
      {error && <p className="small">{error}</p>}
      <p className="small" style={{ marginTop: 8 }}>Tip: demo <code>emilys</code>/<code>emilyspass</code>.</p>
    </div>
  )
}
