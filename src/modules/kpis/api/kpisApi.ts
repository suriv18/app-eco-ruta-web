import { httpClient } from '@/shared/api/httpClient'
import type { ApiResponse, PageResult } from '@/shared/types/common'
import type {
  ResumenOperativoDto,
  KpiRutaDto,
  KpiUnidadDto,
  KpiZonaDto,
  KpiAlertaDto,
} from '@/modules/kpis/types/kpisTypes'

const BASE = '/api/v1/kpis'

export const kpisApi = {
  getResumenDiario: (params: { distritoId: string; fecha: string }) =>
    httpClient
      .get<ApiResponse<ResumenOperativoDto>>(`${BASE}/resumen-diario`, { params })
      .then((r) => r.data),

  calcularResumenDiario: (params: { distritoId: string; fecha: string }) =>
    httpClient
      .post<ApiResponse<ResumenOperativoDto>>(`${BASE}/resumen-diario/calcular`, null, { params })
      .then((r) => r.data),

  getRutas: (params?: { fechaDesde?: string; fechaHasta?: string; page?: number; size?: number }) =>
    httpClient
      .get<ApiResponse<PageResult<KpiRutaDto>>>(`${BASE}/rutas`, { params })
      .then((r) => r.data),

  getUnidades: (params?: { unidadId?: string; fechaDesde?: string; fechaHasta?: string; page?: number; size?: number }) =>
    httpClient
      .get<ApiResponse<PageResult<KpiUnidadDto>>>(`${BASE}/unidades`, { params })
      .then((r) => r.data),

  getZonas: (params?: { zonaId?: string; fechaDesde?: string; fechaHasta?: string; page?: number; size?: number }) =>
    httpClient
      .get<ApiResponse<PageResult<KpiZonaDto>>>(`${BASE}/zonas`, { params })
      .then((r) => r.data),

  getAlertas: (params?: { zonaId?: string; fechaDesde?: string; fechaHasta?: string; page?: number; size?: number }) =>
    httpClient
      .get<ApiResponse<PageResult<KpiAlertaDto>>>(`${BASE}/alertas`, { params })
      .then((r) => r.data),
}
