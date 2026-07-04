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

// Forma cruda que devuelve el backend en /auth/login
export interface BackendLoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  usuarioId: string
  username: string
  roles: string[]
}

// Forma cruda que devuelve el backend en /auth/me
export interface BackendUserResponse {
  usuarioId: string
  tenantId: string
  nombres: string
  apellidos: string
  email: string
  username: string
  telefono: string | null
  estado: string
  roles: string[]
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: User
}

export interface LogoutRequest {
  refreshToken: string
}
