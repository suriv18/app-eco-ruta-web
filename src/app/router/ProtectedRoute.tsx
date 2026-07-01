import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/modules/auth/store/authStore'
import { ROUTES } from '@/app/config/routePaths'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />
  return <Outlet />
}
