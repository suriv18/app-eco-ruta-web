import type { ReactNode } from 'react'
import { useHasRole } from '@/modules/auth/hooks/useHasRole'
import type { Role } from '@/app/config/permissions'

interface Props {
  roles: Role[]
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGuard({ roles, children, fallback = null }: Props) {
  const allowed = useHasRole(...roles)
  return allowed ? <>{children}</> : <>{fallback}</>
}
