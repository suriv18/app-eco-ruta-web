import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/modules/auth/api/authApi'
import { useAuthStore } from '@/modules/auth/store/authStore'
import { ROUTES } from '@/app/config/routePaths'

export function useLogout() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      logout()
      navigate(ROUTES.LOGIN)
    },
  })
}
