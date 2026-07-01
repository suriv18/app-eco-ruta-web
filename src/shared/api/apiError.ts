import type { FieldError } from '@/shared/types/common'
import type { AxiosError } from 'axios'

export class ApiError extends Error {
  code: string
  errors: FieldError[]

  constructor(code: string, message: string, errors: FieldError[] = []) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.errors = errors
  }
}

export function extractApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  const axiosError = error as AxiosError<{ error: { code: string; message: string; errors?: FieldError[] } }>
  if (axiosError.isAxiosError) {
    const data = axiosError.response?.data
    if (data?.error) {
      return new ApiError(data.error.code, data.error.message, data.error.errors ?? [])
    }
    if (axiosError.code === 'ECONNABORTED') return new ApiError('TIMEOUT', 'Tiempo de espera agotado')
  }
  return new ApiError('ERROR_DESCONOCIDO', 'Ocurrió un error inesperado')
}
