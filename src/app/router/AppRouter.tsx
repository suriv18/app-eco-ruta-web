import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/app/router/ProtectedRoute'
import { DashboardLayout } from '@/app/layouts/DashboardLayout'
import { AuthLayout } from '@/app/layouts/AuthLayout'
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { UnauthorizedPage } from '@/modules/auth/pages/UnauthorizedPage'
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage'
import { ROUTES } from '@/app/config/routePaths'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
