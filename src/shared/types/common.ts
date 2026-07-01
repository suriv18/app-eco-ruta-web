export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string | null
  error: ApiErrorPayload | null
}

export interface PageResult<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export interface ApiErrorPayload {
  code: string
  message: string
  errors: FieldError[]
}

export interface FieldError {
  field: string
  message: string
}
