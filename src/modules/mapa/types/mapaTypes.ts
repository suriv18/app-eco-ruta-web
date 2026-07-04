export interface EstadoUnidadDto {
  unidadExternoId: string
  tenantId: string
  rutaExternoId: string | null
  latitud: number | null
  longitud: number | null
  ultimaVelocidadKmh: number | null
  ultimoPingEn: string | null
  estadoMovimiento: string | null
  actualizadoEn: string
}

export interface PingGpsDto {
  id: string
  tenantId: string
  dispositivoId: string
  unidadExternoId: string
  rutaExternoId: string | null
  ts: string
  latitud: number
  longitud: number
  velocidadKmh: number | null
  rumboGrados: number | null
  precisionM: number | null
  origen: string
  recibidoEn: string
}

export interface WsPosicionPayload {
  unidadExternoId: string
  latitud: number
  longitud: number
  tenantId: string
}

export interface WsDesvioPayload {
  agregadoId: string
  unidadExternoId: string
  rutaExternoId: string
  distanciaDesvioM: number
  tenantId: string
}

export interface WsAlertaCriticaPayload {
  alertaId: string
  tenantId: string
  descripcion?: string
}

export type EstadoMovimiento =
  | 'EN_RUTA'
  | 'DETENIDA'
  | 'SIN_SENAL'
  | 'DESCARGANDO'
  | 'FUERA_DE_RUTA'
