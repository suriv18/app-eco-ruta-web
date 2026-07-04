import { publicClient } from '@/shared/api/publicClient'
import type { ApiResponse } from '@/shared/types/common'
import type { AlertaCiudadanaResponseDto, RegistrarAlertaRequest } from '@/modules/ciudadano/types/ciudadanoTypes'

export const ciudadanoApi = {
  registrarAlerta: (tenantId: string, data: RegistrarAlertaRequest) =>
    publicClient
      .post<ApiResponse<AlertaCiudadanaResponseDto>>('/api/v1/ciudadanos/alertas', data, {
        headers: { 'X-Tenant-Id': tenantId },
      })
      .then((r) => r.data),
}
