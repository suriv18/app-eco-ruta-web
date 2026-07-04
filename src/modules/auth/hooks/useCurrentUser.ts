import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/modules/auth/api/authApi'
import { useAuthStore } from '@/modules/auth/store/authStore'
import { queryKeys } from '@/shared/api/queryKeys'

export function useCurrentUser() {
  const { isAuthenticated, user, setAuth, accessToken, refreshToken, logout } = useAuthStore()

  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const response = await authApi.me()
      // Sync updated user data into store (roles can change server-side)
      if (accessToken && refreshToken) {
        const roles = response.data.roles.length > 0 ? response.data.roles : (user?.roles ?? [])
        setAuth({ ...response.data, roles }, accessToken, refreshToken)
      }
      return response.data
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
    initialData: user ?? undefined,
    initialDataUpdatedAt: 0,
    throwOnError: false,
    // If the server says the session is invalid, log out silently
    meta: { onError: () => logout() },
  })
}
