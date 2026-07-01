import { useAuthStore } from '@/modules/auth/store/authStore'
import { useLogout } from '@/modules/auth/hooks/useLogout'

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  SUPERVISOR: 'Supervisor',
  OPERADOR: 'Operador',
  ANALISTA: 'Analista',
  CIUDADANO: 'Ciudadano',
}

export function Topbar() {
  const user = useAuthStore((s) => s.user)
  const { mutate: logout, isPending } = useLogout()

  const primaryRole = user?.roles?.[0]
  const roleLabel = primaryRole ? (ROLE_LABELS[primaryRole] ?? primaryRole) : ''

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div />
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800 leading-none">{user?.nombresCompletos}</p>
          {roleLabel && (
            <p className="text-xs text-gray-400 mt-0.5">{roleLabel}</p>
          )}
        </div>
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold select-none">
          {user?.nombresCompletos?.charAt(0).toUpperCase() ?? '?'}
        </div>
        <button
          onClick={() => logout()}
          disabled={isPending}
          className="text-xs text-gray-400 hover:text-red-600 disabled:opacity-50 transition-colors"
          aria-label="Cerrar sesión"
        >
          Salir
        </button>
      </div>
    </header>
  )
}
