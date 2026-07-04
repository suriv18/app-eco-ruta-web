export type EstadoRuta = 'BORRADOR' | 'APROBADA' | 'EN_EJECUCION' | 'FINALIZADA' | 'CANCELADA'
export type EstadoParada = 'PENDIENTE' | 'EN_ATENCION' | 'ATENDIDA' | 'OMITIDA'
export type TipoRuta = 'HISTORICA' | 'OPTIMIZADA' | 'REOPTIMIZADA'
export type MotivoVersion = 'INICIAL' | 'ALERTA_CRITICA' | 'DESVIO' | 'MANUAL' | 'RECALCULO'
export type GeneradoPor = 'USUARIO' | 'SISTEMA' | 'OPTIMIZADOR'
export type TipoEventoRuta = 'INICIO' | 'FIN' | 'DESVIO' | 'PARADA_ATENDIDA' | 'AVERIA' | 'REOPTIMIZACION' | 'OBSERVACION'

// ── Nested DTOs ───────────────────────────────────────────────────────────────

export interface MetricasRutaDto {
  distanciaM: number
  duracionS: number
  cargaKg: number
}

export interface RutaParadaDto {
  id: string
  rutaVersionId: string
  zonaId: string
  contenedorId: string | null
  orden: number
  eta: string | null
  horaLlegadaReal: string | null
  horaSalidaReal: string | null
  demandaEstimadaKg: number
  cargaAcumuladaKg: number
  estado: EstadoParada
  creadoEn: string
}

export interface RutaVersionDto {
  id: string
  rutaId: string
  version: number
  motivo: MotivoVersion
  alertaIdExterno: string | null
  generadoPor: GeneradoPor
  metricas: MetricasRutaDto
  paradas: RutaParadaDto[]
  creadoEn: string
}

export interface RutaEventoDto {
  id: string
  rutaId: string
  tipoEvento: TipoEventoRuta
  descripcion: string | null
  datosJson: string | null
  creadoEn: string
}

// ── Response DTOs ─────────────────────────────────────────────────────────────

export interface RutaResponseDto {
  id: string
  tenantId: string
  turnoId: string
  distritoId: string
  depositoOrigenId: string
  depositoDestinoId: string
  fecha: string
  tipoRuta: TipoRuta
  estado: EstadoRuta
  metricas: MetricasRutaDto
  versionActual: RutaVersionDto | null
  creadoEn: string
  actualizadoEn: string
}

export interface RutaDetalleResponseDto extends RutaResponseDto {
  historialVersiones: RutaVersionDto[]
  eventos: RutaEventoDto[]
}

// ── Requests ──────────────────────────────────────────────────────────────────

export interface CrearRutaRequest {
  turnoId: string
  distritoId: string
  depositoOrigenId: string
  depositoDestinoId: string
  fecha: string
  tipoRuta: TipoRuta
}

export interface ActualizarParadaRequest {
  nuevoEstado: EstadoParada
  horaLlegada?: string
  horaSalida?: string
}

export interface RegistrarEventoRutaRequest {
  tipoEvento: TipoEventoRuta
  descripcion?: string
  datosJson?: string
}

// ── State machine ─────────────────────────────────────────────────────────────

export const TRANSICIONES_RUTA: Record<EstadoRuta, { label: string; action: string }[]> = {
  BORRADOR:     [{ label: 'Aprobar', action: 'aprobar' }, { label: 'Cancelar', action: 'cancelar' }],
  APROBADA:     [{ label: 'Iniciar ejecución', action: 'iniciar-ejecucion' }, { label: 'Cancelar', action: 'cancelar' }],
  EN_EJECUCION: [{ label: 'Finalizar', action: 'finalizar' }],
  FINALIZADA:   [],
  CANCELADA:    [],
}

export const ESTADO_RUTA_LABEL: Record<EstadoRuta, string> = {
  BORRADOR: 'Borrador',
  APROBADA: 'Aprobada',
  EN_EJECUCION: 'En ejecución',
  FINALIZADA: 'Finalizada',
  CANCELADA: 'Cancelada',
}

export const ESTADO_PARADA_LABEL: Record<EstadoParada, string> = {
  PENDIENTE: 'Pendiente',
  EN_ATENCION: 'En atención',
  ATENDIDA: 'Atendida',
  OMITIDA: 'Omitida',
}
