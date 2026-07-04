export interface RegistrarAlertaRequest {
  ciudadanoId?: string
  distritoExternoId: string
  zonaExternoId?: string
  titulo: string
  descripcion?: string
  latitud: number
  longitud: number
  volumenEstimado: string
  nivelCriticidad: string
  fuente: string
}

export interface AlertaFotoDto {
  id: string
  urlArchivo: string
  tipoMime: string
  tamanioBytes: number | null
}

export interface AlertaHistorialDto {
  historialId: string
  estadoAnterior: string | null
  estadoNuevo: string
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

export interface AlertaCiudadanaResponseDto {
  id: string
  tenantId: string
  ciudadanoId: string | null
  distritoExternoId: string
  zonaExternoId: string | null
  titulo: string
  descripcion: string | null
  latitud: number
  longitud: number
  volumenEstimado: string
  nivelCriticidad: string
  fuente: string
  estado: string
  fotos: AlertaFotoDto[]
  historial: AlertaHistorialDto[]
  validacion: ValidacionAlertaDto | null
  registradaEn: string
  actualizadaEn: string
}

export const VOLUMENES = ['PEQUENO', 'MEDIANO', 'GRANDE', 'MUY_GRANDE'] as const
export const CRITICIDADES = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'] as const

export const VOLUMEN_LABEL: Record<string, string> = {
  PEQUENO:   'Pequeño (< 1 bolsa)',
  MEDIANO:   'Mediano (1–3 bolsas)',
  GRANDE:    'Grande (3–10 bolsas)',
  MUY_GRANDE:'Muy grande (> 10 bolsas)',
}

export const CRITICIDAD_LABEL: Record<string, string> = {
  BAJA:   'Baja — acumulación menor',
  MEDIA:  'Media — residuos expuestos',
  ALTA:   'Alta — punto crítico',
  CRITICA:'Crítica — riesgo sanitario',
}
