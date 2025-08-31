// Ochrona tras - jeśli brak tokena, przekieruj na /login z pamięcią trasy powrotu
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function Protected({ children }: { children: ReactNode }) {
  const token = useAuth(s => s.token)
  const loc = useLocation()
  // Brak autoryzacji 
  if (!token) return <Navigate to="/login" replace state={{ from: loc }} />
  return <>{children}</>
}
