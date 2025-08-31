// Główny komponent aplikacji - nawigacja, trasy i fallbacki ładowania
import { NavLink, Route, Routes } from 'react-router-dom'
import { lazy, Suspense, memo } from 'react'
import UpdatePrompt from './pwa/UpdatePrompt'
import OfflineBanner from './components/OfflineBanner'

// Lazy loading komponentów dla lepszego code splitting
// Lazy loading stron - przeglądarka dociąga kod tylko wtedy, gdy jest potrzebny
const Home = lazy(() => import('./pages/Home'))
const Explore = lazy(() => import('./pages/Explore'))
const Favorites = lazy(() => import('./pages/Favorites'))
const Login = lazy(() => import('./pages/Login'))
const Profile = lazy(() => import('./pages/Profile'))
const Protected = lazy(() => import('./components/Protected'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Spinner component dla loading states
// Prosty spinner dla stanów ładowania, memo żeby nie renderować niepotrzebnie
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
// Nawigacja u góry - linki, aktywny stan i prosta responsywność
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
      {/* Pasek nawigacji dostępny na każdej stronie */}
      <Navigation />
      
      {/* Pasek informujący o pracy w trybie offline */}
      <OfflineBanner />

      <div className="container">
        {/* Suspense łapie leniwie ładowane strony i pokazuje spinner */}
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route
              path="/favorites"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  {/* Tę trasę zobaczy tylko zalogowany użytkownik */}
                  {/* Strona profilu jest również za bramką autoryzacyjną */}
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

      {/* Komunikat o dostępnej aktualizacji PWA */}
      <UpdatePrompt />
    </>
  )
}
