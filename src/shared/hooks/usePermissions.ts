import { useAuthStore } from '@/modules/auth/store/authStore'
import type { Role } from '@/app/config/permissions'

// Fallback estable: un `?? []` dentro del selector crea un array nuevo en
// cada getSnapshot y provoca un loop infinito de re-renders
const NO_ROLES: Role[] = []

export function usePermissions() {
  const roles = useAuthStore((s) => s.user?.roles) ?? NO_ROLES
  return {
    hasRole: (role: Role) => roles.includes(role),
    hasAnyRole: (required: Role[]) => required.some((r) => roles.includes(r)),
  }
}
