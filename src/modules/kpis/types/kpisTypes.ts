export interface ResumenOperativoDto {
  resumenId: string
  tenantId: string
  distritoIdExterno: string
  fecha: string
  kmProgramados: number
  kmRecorridos: number
  toneladasRecolectadas: number
  coberturaPorcentaje: number
  alertasRegistradas: number
  alertasAtendidas: number
  tiempoRespuestaPromedioMin: number
  creadoEn: string
}

export interface KpiRutaDto {
  kpiRutaId: string
  tenantId: string
  rutaIdExterno: string
  fecha: string
  distanciaPlanificadaM: number
  distanciaRealM: number
  duracionPlanificadaS: number
  duracionRealS: number
  zonasProgramadas: number
  zonasAtendidas: number
  cumplimientoPorcentaje: number
  kmPorTonelada: number
  creadoEn: string
}

export interface KpiUnidadDto {
  kpiUnidadId: string
  tenantId: string
  unidadIdExterno: string
  fecha: string
  kmRecorridos: number
  horasOperacion: number
  toneladasRecolectadas: number
  consumoEstimadoLitros: number
  creadoEn: string
}

export interface KpiZonaDto {
  kpiZonaId: string
  tenantId: string
  zonaIdExterno: string
  fecha: string
  vecesProgramada: number
  vecesAtendida: number
  kgRecolectados: number
  coberturaPorcentaje: number
  creadoEn: string
}

export interface KpiAlertaDto {
  kpiAlertaId: string
  tenantId: string
  alertaIdExterno: string
  zonaIdExterno: string | null
  registradaEn: string
  atendidaEn: string | null
  tiempoRespuestaMin: number | null
  fueCritica: boolean
  incluidaEnRuta: boolean
  creadoEn: string
}
