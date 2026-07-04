export interface EventoAuditoriaDto {
  eventoId: string
  tenantId: string
  usuarioId: string | null
  modulo: string
  accion: string
  entidad: string
  entidadId: string | null
  datosAntes: string | null
  datosDespues: string | null
  creadoEn: string
}

export interface OutboxEventDto {
  outboxId: string
  tenantId: string
  aggregateType: string
  aggregateId: string
  eventType: string
  payload: string
  estado: 'PENDIENTE' | 'PUBLICADO' | 'ERROR'
  creadoEn: string
  publicadoEn: string | null
  errorMensaje: string | null
}

export interface ListarEventosParams {
  modulo?: string
  entidad?: string
  usuarioId?: string
  fechaDesde?: string
  fechaHasta?: string
  page?: number
  size?: number
}

export interface ListarOutboxParams {
  estado?: string
  eventType?: string
  page?: number
  size?: number
}
