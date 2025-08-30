import { NavLink, Route, Routes } from 'react-router-dom'
import { lazy, Suspense, memo } from 'react'
import UpdatePrompt from './pwa/UpdatePrompt'
import OfflineBanner from './components/OfflineBanner'

// Lazy loading komponentów dla lepszego code splitting
const Home = lazy(() => import('./pages/Home'))
const Explore = lazy(() => import('./pages/Explore'))
const Favorites = lazy(() => import('./pages/Favorites'))
const Login = lazy(() => import('./pages/Login'))
const Profile = lazy(() => import('./pages/Profile'))
const Protected = lazy(() => import('./components/Protected'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Spinner component dla loading states
const LoadingSpinner = memo(() => (
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
      <p style={{ marginTop: '16px', color: 'var(--muted)' }}>Ładowanie...</p>
    </div>
  </div>
))
LoadingSpinner.displayName = 'LoadingSpinner'

// Navigation component - memoized dla lepszej wydajności
const Navigation = memo(() => (
  <nav>
    <NavLink to="/" end>Dzisiejszy cytat</NavLink>
    <NavLink to="/explore">Odkrywaj</NavLink>
    <NavLink to="/favorites">Ulubione</NavLink>
    <div style={{ flex: 1 }} />
    <NavLink to="/profile">Profil</NavLink>
  </nav>
))
Navigation.displayName = 'Navigation'

export default function App() {
  return (
    <>
      <Navigation />
      
      <OfflineBanner />

      <div className="container">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route
              path="/favorites"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Protected>
                    <Favorites />
                  </Protected>
                </Suspense>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/profile"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Protected>
                    <Profile />
                  </Protected>
                </Suspense>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>

      <UpdatePrompt />
    </>
  )
}