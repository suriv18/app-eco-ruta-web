import axios from 'axios'
import { env } from '@/app/config/env'

// Token getter functions injected at startup to avoid circular dependency
// between httpClient and authStore
let getAccessToken: () => string | null = () => null
let getRefreshToken: () => string | null = () => null
let setTokens: (access: string, refresh: string) => void = () => undefined
let onLogout: () => void = () => undefined

export function configureHttpClient(options: {
  getAccessToken: () => string | null
  getRefreshToken: () => string | null
  setTokens: (access: string, refresh: string) => void
  onLogout: () => void
}) {
  getAccessToken = options.getAccessToken
  getRefreshToken = options.getRefreshToken
  setTokens = options.setTokens
  onLogout = options.onLogout
}

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

httpClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = getRefreshToken()
        const { data } = await axios.post(`${env.apiBaseUrl}/api/v1/auth/refresh`, { refreshToken })
        setTokens(data.data.accessToken, data.data.refreshToken)
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`
        return httpClient(originalRequest)
      } catch {
        onLogout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
