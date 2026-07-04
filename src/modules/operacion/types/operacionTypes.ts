// ── Enums ──────────────────────────────────────────────────────────────────

export type EstadoDistrito = 'ACTIVO' | 'INACTIVO'
export type EstadoChofer = 'ACTIVO' | 'SUSPENDIDO' | 'INACTIVO'
export type EstadoOperativoUnidad = 'OPERATIVA' | 'MANTENIMIENTO' | 'INACTIVA' | 'AVERIADA'
export type EstadoContenedor = 'VACIO' | 'PARCIAL' | 'LLENO' | 'DESBORDADO'
export type EstadoTurno = 'PROGRAMADO' | 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO'

export type TipoUnidad = 'COMPACTADOR' | 'BARANDA' | 'VOLQUETE' | 'MOTOFURGON' | 'OTRO'
export type TipoTurno = 'MANANA' | 'TARDE' | 'NOCHE'
export type TipoZona = 'RESIDENCIAL' | 'COMERCIAL' | 'MIXTA' | 'MERCADO' | 'INDUSTRIAL' | 'OTRA'
export type TipoDeposito = 'BASE' | 'TRANSFERENCIA' | 'RELLENO' | 'OTRO'

// ── Response DTOs ───────────────────────────────────────────────────────────

export interface DistritoResponseDto {
  id: string
  tenantId: string
  nombre: string
  ubigeo: string | null
  estado: EstadoDistrito
  creadoEn: string
  actualizadoEn: string
}

export interface ZonaResponseDto {
  id: string
  tenantId: string
  distritoId: string
  codigo: string
  nombre: string
  tipoZona: TipoZona
  prioridad: number
  estado: EstadoDistrito
  creadoEn: string
  actualizadoEn: string
}

export interface DepositoResponseDto {
  id: string
  tenantId: string
  distritoId: string
  nombre: string
  tipo: TipoDeposito
  estado: EstadoDistrito
  creadoEn: string
  actualizadoEn: string
}

export interface ContenedorResponseDto {
  id: string
  tenantId: string
  zonaId: string
  codigo: string
  capacidadM3: number
  estadoContenedor: EstadoContenedor
  creadoEn: string
  actualizadoEn: string
}

export interface UnidadResponseDto {
  id: string
  tenantId: string
  placa: string
  codigoInterno: string
  tipoUnidad: TipoUnidad
  capacidadM3: number
  capacidadKg: number
  estadoOperativo: EstadoOperativoUnidad
  creadoEn: string
  actualizadoEn: string
}

export interface ChoferResponseDto {
  id: string
  tenantId: string
  nombres: string
  apellidos: string
  dni: string | null
  licencia: string | null
  telefono: string | null
  estado: EstadoChofer
  creadoEn: string
  actualizadoEn: string
}

export interface TurnoResponseDto {
  id: string
  tenantId: string
  unidadId: string
  choferId: string
  distritoId: string
  fecha: string
  horaInicio: string
  horaFin: string
  tipoTurno: TipoTurno
  estado: EstadoTurno
  creadoEn: string
  actualizadoEn: string
}

export interface HorarioResponseDto {
  id: string
  tenantId: string
  zonaId: string
  diaSemana: number
  horaInicio: string
  horaFin: string
  observacion: string | null
  estado: EstadoDistrito
  creadoEn: string
  actualizadoEn: string
}

// ── Request bodies ──────────────────────────────────────────────────────────

export interface CrearDistritoRequest {
  nombre: string
  ubigeo?: string
}

export interface CrearZonaRequest {
  distritoId: string
  codigo: string
  nombre: string
  tipoZona: TipoZona
  prioridad: number
}

export interface ActualizarZonaRequest {
  prioridad?: number
}

export interface CrearDepositoRequest {
  distritoId: string
  nombre: string
  tipo: TipoDeposito
}

export interface CrearContenedorRequest {
  zonaId: string
  codigo: string
  capacidadM3: number
}

export interface CrearUnidadRequest {
  placa: string
  codigoInterno: string
  tipoUnidad: TipoUnidad
  capacidadM3: number
  capacidadKg: number
}

export interface CrearChoferRequest {
  nombres: string
  apellidos: string
  dni?: string
  licencia?: string
  telefono?: string
}

export interface CrearTurnoRequest {
  unidadId: string
  choferId: string
  distritoId: string
  fecha: string
  horaInicio: string
  horaFin: string
  tipoTurno: TipoTurno
}

export interface CrearHorarioRequest {
  zonaId: string
  diaSemana: number
  horaInicio: string
  horaFin: string
  observacion?: string
}

export interface ActualizarHorarioRequest {
  horaInicio: string
  horaFin: string
  observacion?: string
}
