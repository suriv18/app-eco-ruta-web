import { useAuthStore } from '@/modules/auth/store/authStore'
import type { Role } from '@/app/config/permissions'

const NO_ROLES: Role[] = []

export function useHasRole(...roles: Role[]): boolean {
  const userRoles = useAuthStore((s) => s.user?.roles) ?? NO_ROLES
  return roles.some((r) => userRoles.includes(r))
}
