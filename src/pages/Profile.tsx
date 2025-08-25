import { useAuth } from '../store/auth'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  if (!user) return null
  return (
    <div className="card">
      <h2>Profil</h2>
      <div className="row">
        {user.image && <img src={user.image} alt="" width={64} height={64} style={{ borderRadius: 12 }} />}
        <div>
          <div>{user.firstName} {user.lastName}</div>
          <div className="small">{user.email}</div>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => { logout(); nav('/'); }}>Wyloguj</button>
      </div>
    </div>
  )
}

