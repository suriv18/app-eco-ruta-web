import { env } from '@/app/config/env'
import { publicClient } from '@/shared/api/publicClient'
import type { ApiResponse, PageResult } from '@/shared/types/common'

export interface DistritoPublico {
  id: string
  nombre: string
}

export interface ZonaPublica {
  id: string
  nombre: string
  codigo: string
  distritoId: string
  tipoZona: string
}

export interface HorarioPublico {
  id: string
  zonaId: string
  diaSemana: number
  horaInicio: string
  horaFin: string
  observacion: string | null
  estado: string
}

const tenantHeader = { 'X-Tenant-Id': env.tenantId }

export const publicoApi = {
  listarDistritos: () =>
    publicClient
      .get<ApiResponse<PageResult<DistritoPublico>>>('/api/v1/publico/operacion/distritos', {
        params: { page: 0, size: 100 },
        headers: tenantHeader,
      })
      .then((r) => r.data.data.content),

  listarZonas: () =>
    publicClient
      .get<ApiResponse<PageResult<ZonaPublica>>>('/api/v1/publico/operacion/zonas', {
        params: { page: 0, size: 100 },
        headers: tenantHeader,
      })
      .then((r) => r.data.data.content),

  listarHorarios: (zonaId: string) =>
    publicClient
      .get<ApiResponse<PageResult<HorarioPublico>>>('/api/v1/publico/operacion/horarios', {
        params: { zonaId, page: 0, size: 50 },
        headers: tenantHeader,
      })
      .then((r) => r.data.data.content),
}
