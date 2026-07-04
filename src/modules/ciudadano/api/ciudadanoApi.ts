import axios from 'axios'
import { env } from '@/app/config/env'
import type { ApiResponse } from '@/shared/types/common'
import type { AlertaCiudadanaResponseDto, RegistrarAlertaRequest } from '@/modules/ciudadano/types/ciudadanoTypes'

// Cliente sin autenticación para el endpoint público
const publicClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

export const ciudadanoApi = {
  registrarAlerta: (tenantId: string, data: RegistrarAlertaRequest) =>
    publicClient
      .post<ApiResponse<AlertaCiudadanaResponseDto>>('/api/v1/ciudadanos/alertas', data, {
        headers: { 'X-Tenant-Id': tenantId },
      })
      .then((r) => r.data),
}
