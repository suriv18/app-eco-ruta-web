import { useQuery } from '@tanstack/react-query'
import { auditoriaApi } from '@/modules/auditoria/api/auditoriaApi'
import type { ListarEventosParams, ListarOutboxParams } from '@/modules/auditoria/types/auditoriaTypes'

const keys = {
  eventos: (p: ListarEventosParams) => ['auditoria', 'eventos', p] as const,
  outbox:  (p: ListarOutboxParams)  => ['auditoria', 'outbox', p]  as const,
}

export function useEventosAuditoria(params: ListarEventosParams) {
  return useQuery({
    queryKey: keys.eventos(params),
    queryFn:  () => auditoriaApi.listarEventos(params),
    select:   (r) => r.data,
  })
}

export function useOutboxEventos(params: ListarOutboxParams) {
  return useQuery({
    queryKey: keys.outbox(params),
    queryFn:  () => auditoriaApi.listarOutbox(params),
    select:   (r) => r.data,
  })
}
