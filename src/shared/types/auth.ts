import type { Role } from '@/app/config/permissions'

export interface User {
  id: string
  username: string
  nombresCompletos: string
  email: string
  roles: Role[]
  tenantId: string
}

export interface LoginRequest {
  username: string
  password: string
  tenantId: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}
