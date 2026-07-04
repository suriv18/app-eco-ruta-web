import { httpClient } from '@/shared/api/httpClient'
import type { ApiResponse, PageResult } from '@/shared/types/common'
import type {
  RutaResponseDto,
  RutaDetalleResponseDto,
  CrearRutaRequest,
  ActualizarParadaRequest,
  RegistrarEventoRutaRequest,
  EstadoRuta,
} from '@/modules/rutas/types/rutasTypes'

const BASE = '/api/v1/rutas'

export const rutasApi = {
  listar: (params?: { distritoId?: string; fecha?: string; estado?: EstadoRuta; page?: number; size?: number }) =>
    httpClient
      .get<ApiResponse<PageResult<RutaResponseDto>>>(BASE, { params })
      .then((r) => r.data),

  obtener: (id: string) =>
    httpClient
      .get<ApiResponse<RutaResponseDto>>(`${BASE}/${id}`)
      .then((r) => r.data),

  obtenerDetalle: (id: string) =>
    httpClient
      .get<ApiResponse<RutaDetalleResponseDto>>(`${BASE}/${id}/detalle`)
      .then((r) => r.data),

  crear: (data: CrearRutaRequest) =>
    httpClient
      .post<ApiResponse<RutaResponseDto>>(BASE, data)
      .then((r) => r.data),

  aprobar: (id: string) =>
    httpClient
      .patch<ApiResponse<RutaResponseDto>>(`${BASE}/${id}/aprobar`)
      .then((r) => r.data),

  iniciarEjecucion: (id: string) =>
    httpClient
      .patch<ApiResponse<RutaResponseDto>>(`${BASE}/${id}/iniciar-ejecucion`)
      .then((r) => r.data),

  finalizar: (id: string) =>
    httpClient
      .patch<ApiResponse<RutaResponseDto>>(`${BASE}/${id}/finalizar`)
      .then((r) => r.data),

  cancelar: (id: string) =>
    httpClient
      .patch<ApiResponse<RutaResponseDto>>(`${BASE}/${id}/cancelar`)
      .then((r) => r.data),

  actualizarParada: (id: string, paradaId: string, data: ActualizarParadaRequest) =>
    httpClient
      .patch<ApiResponse<RutaResponseDto>>(`${BASE}/${id}/paradas/${paradaId}`, data)
      .then((r) => r.data),

  registrarEvento: (id: string, data: RegistrarEventoRutaRequest) =>
    httpClient
      .post<ApiResponse<RutaResponseDto>>(`${BASE}/${id}/eventos`, data)
      .then((r) => r.data),
}
