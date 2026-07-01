import { useAuthStore } from '@/modules/auth/store/authStore'
import type { Role } from '@/app/config/permissions'

export function usePermissions() {
  const roles = useAuthStore((s) => s.user?.roles ?? [])
  return {
    hasRole: (role: Role) => roles.includes(role),
    hasAnyRole: (required: Role[]) => required.some((r) => roles.includes(r)),
  }
}
