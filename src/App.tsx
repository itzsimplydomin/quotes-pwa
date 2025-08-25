import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Favorites from './pages/Favorites'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Protected from './components/Protected'
import UpdatePrompt from './pwa/UpdatePrompt'

export default function App() {
  return (
    <>
      <nav>
        <NavLink to="/" end>Dzisiejszy cytat</NavLink>
        <NavLink to="/explore">Odkrywaj</NavLink>
        <NavLink to="/favorites">Ulubione</NavLink>
        <div style={{ flex: 1 }} />
        <NavLink to="/profile">Profil</NavLink>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route
            path="/favorites"
            element={
              <Protected>
                <Favorites />
              </Protected>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={
              <Protected>
                <Profile />
              </Protected>
            }
          />
        </Routes>
      </div>

      {/* Baner aktualizacji PWA */}
      <UpdatePrompt />
    </>
  )
}
