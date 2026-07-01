import { useAuthStore } from '@/modules/auth/store/authStore'
import { useLogout } from '@/modules/auth/hooks/useLogout'

export function Topbar() {
  const user = useAuthStore((s) => s.user)
  const { mutate: logout } = useLogout()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.nombresCompletos}</span>
        <button
          onClick={() => logout()}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
