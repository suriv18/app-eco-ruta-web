export type Role = 'ADMIN' | 'SUPERVISOR' | 'OPERADOR' | 'ANALISTA' | 'CIUDADANO'

export const ROLE_PERMISSIONS: Record<string, Role[]> = {
  mapa: ['ADMIN', 'SUPERVISOR', 'OPERADOR', 'ANALISTA'],
  operacion: ['ADMIN', 'SUPERVISOR'],
  alertas: ['ADMIN', 'SUPERVISOR', 'OPERADOR'],
  alertasCriticas: ['ADMIN', 'SUPERVISOR'],
  rutas: ['ADMIN', 'SUPERVISOR', 'OPERADOR', 'ANALISTA'],
  rutasGestion: ['ADMIN', 'SUPERVISOR'],
  kpis: ['ADMIN', 'SUPERVISOR', 'ANALISTA'],
  auditoria: ['ADMIN'],
  auditoriaEventos: ['ADMIN', 'SUPERVISOR'],
}
