import { httpClient } from '@/shared/api/httpClient'
import type { ApiResponse, PageResult } from '@/shared/types/common'
import type {
  AlertaResponseDto,
  RegistrarAlertaRequest,
  CambiarEstadoAlertaRequest,
  AgregarFotoAlertaRequest,
  ValidarAlertaRequest,
  EstadoAlerta,
} from '@/modules/alertas/types/alertasTypes'

const BASE = '/api/v1/ciudadanos/alertas'

export const alertasApi = {
  listar: (params?: { estado?: EstadoAlerta; page?: number; size?: number }) =>
    httpClient
      .get<ApiResponse<PageResult<AlertaResponseDto>>>(BASE, { params })
      .then((r) => r.data),

  listarCriticas: (params?: { page?: number; size?: number }) =>
    httpClient
      .get<ApiResponse<PageResult<AlertaResponseDto>>>(`${BASE}/criticas`, { params })
      .then((r) => r.data),

  listarPorZona: (zonaId: string, params?: { page?: number; size?: number }) =>
    httpClient
      .get<ApiResponse<PageResult<AlertaResponseDto>>>(`${BASE}/zona/${zonaId}`, { params })
      .then((r) => r.data),

  obtener: (id: string) =>
    httpClient
      .get<ApiResponse<AlertaResponseDto>>(`${BASE}/${id}`)
      .then((r) => r.data),

  registrar: (data: RegistrarAlertaRequest) =>
    httpClient
      .post<ApiResponse<AlertaResponseDto>>(BASE, data)
      .then((r) => r.data),

  cambiarEstado: (id: string, data: CambiarEstadoAlertaRequest) =>
    httpClient
      .patch<ApiResponse<AlertaResponseDto>>(`${BASE}/${id}/estado`, data)
      .then((r) => r.data),

  validar: (id: string, data: ValidarAlertaRequest) =>
    httpClient
      .post<ApiResponse<AlertaResponseDto>>(`${BASE}/${id}/validar`, data)
      .then((r) => r.data),

  agregarFoto: (id: string, data: AgregarFotoAlertaRequest) =>
    httpClient
      .post<ApiResponse<AlertaResponseDto>>(`${BASE}/${id}/fotos`, data)
      .then((r) => r.data),
}
