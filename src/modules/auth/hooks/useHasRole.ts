import { useAuthStore } from '@/modules/auth/store/authStore'
import type { Role } from '@/app/config/permissions'

export function useHasRole(...roles: Role[]): boolean {
  const userRoles = useAuthStore((s) => s.user?.roles ?? [])
  return roles.some((r) => userRoles.includes(r))
}
