import { httpClient } from '@/shared/api/httpClient'
import type {
  BackendLoginResponse,
  BackendUserResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  User,
} from '@/shared/types/auth'
import type { ApiResponse } from '@/shared/types/common'
import type { Role } from '@/app/config/permissions'

const VALID_ROLES = new Set(['ADMIN', 'SUPERVISOR', 'OPERADOR', 'ANALISTA', 'CIUDADANO'])

function toRoles(roles: string[]): Role[] {
  return roles.filter((role) => VALID_ROLES.has(role)) as Role[]
}

function toUser(data: BackendUserResponse): User {
  const nombresCompletos = `${data.nombres} ${data.apellidos}`.trim()

  return {
    id: data.usuarioId,
    username: data.username,
    nombresCompletos: nombresCompletos || data.username,
    email: data.email,
    roles: toRoles(data.roles),
    tenantId: data.tenantId,
  }
}

function toLoginResponse(data: BackendLoginResponse, tenantId: string): LoginResponse {
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    tokenType: data.tokenType,
    expiresIn: data.expiresIn,
    user: {
      id: data.usuarioId,
      username: data.username,
      nombresCompletos: data.username,
      email: '',
      roles: toRoles(data.roles),
      tenantId,
    },
  }
}

export const authApi = {
  login: (data: LoginRequest) =>
    httpClient
      .post<ApiResponse<BackendLoginResponse>>('/api/v1/auth/login', data)
      .then((r) => ({ ...r.data, data: toLoginResponse(r.data.data, data.tenantId) })),

  logout: (data: LogoutRequest) =>
    httpClient.post<ApiResponse<void>>('/api/v1/auth/logout', data).then((r) => r.data),

  me: () =>
    httpClient
      .get<ApiResponse<BackendUserResponse>>('/api/v1/auth/me')
      .then((r) => ({ ...r.data, data: toUser(r.data.data) })),
}
