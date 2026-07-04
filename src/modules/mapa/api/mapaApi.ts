import { httpClient } from '@/shared/api/httpClient'
import type { ApiResponse, PageResult } from '@/shared/types/common'
import type { EstadoUnidadDto, PingGpsDto } from '@/modules/mapa/types/mapaTypes'

export const mapaApi = {
  // El backend pagina este endpoint; se desenvuelve content para que los
  // consumidores trabajen con el array de unidades
  listarEstadoUnidades: () =>
    httpClient
      .get<ApiResponse<PageResult<EstadoUnidadDto>>>('/api/v1/telemetria/estado-unidades')
      .then((r) => ({ ...r.data, data: r.data.data.content })),

  obtenerEstadoUnidad: (unidadId: string) =>
    httpClient
      .get<ApiResponse<EstadoUnidadDto>>(`/api/v1/telemetria/estado-unidades/${unidadId}`)
      .then((r) => r.data),

  pingsPorUnidad: (unidadId: string, page = 0, size = 50) =>
    httpClient
      .get<ApiResponse<PageResult<PingGpsDto>>>(`/api/v1/telemetria/pings/unidad/${unidadId}`, {
        params: { page, size },
      })
      .then((r) => r.data),
}
