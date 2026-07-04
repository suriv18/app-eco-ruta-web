import { httpClient } from '@/shared/api/httpClient'
import type { ApiResponse, PageResult } from '@/shared/types/common'
import type { EventoAuditoriaDto, ListarEventosParams, ListarOutboxParams, OutboxEventDto } from '@/modules/auditoria/types/auditoriaTypes'

const BASE = '/api/v1/auditoria'

export const auditoriaApi = {
  listarEventos: (params: ListarEventosParams = {}) =>
    httpClient
      .get<ApiResponse<PageResult<EventoAuditoriaDto>>>(`${BASE}/eventos`, { params })
      .then((r) => r.data),

  listarOutbox: (params: ListarOutboxParams = {}) =>
    httpClient
      .get<ApiResponse<PageResult<OutboxEventDto>>>(`${BASE}/outbox`, { params })
      .then((r) => r.data),
}
