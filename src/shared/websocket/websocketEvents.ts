export interface PosicionActualizadaEvent {
  unidadExternoId: string
  latitud: number
  longitud: number
  tenantId: string
}

export interface UnidadSinSenalEvent {
  agregadoId: string
  unidadExternoId: string
  rutaExternoId: string
  distanciaDesvioM: number
  tenantId: string
}

export interface AlertaCriticaEvent {
  alertaId: string
  distritoExternoId: string
  titulo: string
  tenantId: string
}

export interface RutaActualizadaEvent {
  rutaId: string
  version: number
  motivo: string
  tenantId: string
}

export interface RutaEstadoCambiadoEvent {
  rutaId: string
  estadoAnterior: string
  estadoNuevo: string
  tenantId: string
}

export type WebSocketTopic =
  | '/topic/unidad.posicion.actualizada'
  | '/topic/unidad.sin.senal'
  | '/topic/alerta.critica.recibida'
  | '/topic/ruta.actualizada'
  | '/topic/ruta.estado.cambiado'
