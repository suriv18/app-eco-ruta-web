export type EstadoAlerta = 'REGISTRADA' | 'VALIDADA' | 'EN_ATENCION' | 'ATENDIDA' | 'DESCARTADA' | 'DUPLICADA'
export type VolumenEstimado = 'BAJO' | 'MEDIO' | 'ALTO'
export type NivelCriticidad = 'NORMAL' | 'CRITICA'
export type FuenteAlerta = 'APP' | 'WEB' | 'OEFA' | 'OPERADOR'

export interface FotoAlertaDto {
  id: string
  urlArchivo: string
  tipoMime: string
  tamanioBytes: number | null
}

export interface HistorialAlertaDto {
  historialId: string
  estadoAnterior: EstadoAlerta
  estadoNuevo: EstadoAlerta
  comentario: string | null
  cambiadoPorUsuarioId: string | null
  cambiadoEn: string
}

export interface ValidacionAlertaDto {
  id: string
  esDuplicada: boolean
  alertaOriginalId: string | null
  dentroGeocerca: boolean
  scoreSpam: number
  resultado: string
  validadaEn: string
}

export interface AlertaResponseDto {
  id: string
  tenantId: string
  ciudadanoId: string | null
  distritoExternoId: string
  zonaExternoId: string | null
  titulo: string
  descripcion: string | null
  latitud: number
  longitud: number
  volumenEstimado: VolumenEstimado
  nivelCriticidad: NivelCriticidad
  fuente: FuenteAlerta
  estado: EstadoAlerta
  fotos: FotoAlertaDto[]
  historial: HistorialAlertaDto[]
  validacion: ValidacionAlertaDto | null
  registradaEn: string
  actualizadaEn: string
}

// ── Requests ─────────────────────────────────────────────────────────────────

export interface RegistrarAlertaRequest {
  ciudadanoId?: string
  distritoExternoId: string
  zonaExternoId?: string
  titulo: string
  descripcion?: string
  latitud: number
  longitud: number
  volumenEstimado: VolumenEstimado
  nivelCriticidad: NivelCriticidad
  fuente: FuenteAlerta
}

export interface CambiarEstadoAlertaRequest {
  nuevoEstado: EstadoAlerta
  comentario?: string
  cambiadoPorUsuarioId?: string
}

export interface AgregarFotoAlertaRequest {
  urlArchivo: string
  tipoMime: string
  tamanioBytes?: number
}

export interface ValidarAlertaRequest {
  esDuplicada: boolean
  alertaOriginalId?: string
  dentroGeocerca: boolean
  scoreSpam: number
  resultado: string
}

// ── State machine ─────────────────────────────────────────────────────────────

export const TRANSICIONES_VALIDAS: Record<EstadoAlerta, EstadoAlerta[]> = {
  REGISTRADA: ['VALIDADA', 'DESCARTADA', 'DUPLICADA'],
  VALIDADA: ['EN_ATENCION', 'DESCARTADA'],
  EN_ATENCION: ['ATENDIDA', 'DESCARTADA'],
  ATENDIDA: [],
  DESCARTADA: [],
  DUPLICADA: [],
}

export const ESTADOS_TERMINALES: EstadoAlerta[] = ['ATENDIDA', 'DESCARTADA', 'DUPLICADA']
