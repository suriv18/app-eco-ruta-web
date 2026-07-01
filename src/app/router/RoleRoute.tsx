import { Navigate, Outlet } from 'react-router-dom'
import { usePermissions } from '@/shared/hooks/usePermissions'
import { ROUTES } from '@/app/config/routePaths'
import type { Role } from '@/app/config/permissions'

interface Props {
  roles: Role[]
}

export function RoleRoute({ roles }: Props) {
  const { hasAnyRole } = usePermissions()
  if (!hasAnyRole(roles)) return <Navigate to={ROUTES.UNAUTHORIZED} replace />
  return <Outlet />
}
