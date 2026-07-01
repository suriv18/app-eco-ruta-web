import { httpClient } from '@/shared/api/httpClient'
import type { LoginRequest, LoginResponse, User } from '@/shared/types/auth'
import type { ApiResponse } from '@/shared/types/common'

export const authApi = {
  login: (data: LoginRequest) =>
    httpClient.post<ApiResponse<LoginResponse>>('/api/v1/auth/login', data).then((r) => r.data),

  logout: () =>
    httpClient.post<ApiResponse<void>>('/api/v1/auth/logout').then((r) => r.data),

  me: () =>
    httpClient.get<ApiResponse<User>>('/api/v1/auth/me').then((r) => r.data),
}
