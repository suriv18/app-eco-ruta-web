export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  MAPA: '/mapa',
  OPERACION: {
    DISTRITOS: '/operacion/distritos',
    ZONAS: '/operacion/zonas',
    DEPOSITOS: '/operacion/depositos',
    CONTENEDORES: '/operacion/contenedores',
    UNIDADES: '/operacion/unidades',
    CHOFERES: '/operacion/choferes',
    TURNOS: '/operacion/turnos',
    HORARIOS: '/operacion/horarios',
  },
  ALERTAS: {
    LIST: '/alertas',
    CRITICAS: '/alertas/criticas',
    DETALLE: (id: string) => `/alertas/${id}`,
  },
  RUTAS: {
    LIST: '/rutas',
    OPTIMIZAR: '/rutas/optimizar',
    DETALLE: (id: string) => `/rutas/${id}`,
    VERSIONES: (id: string) => `/rutas/${id}/versiones`,
  },
  KPIS: {
    RESUMEN: '/kpis/resumen',
    RUTAS: '/kpis/rutas',
    UNIDADES: '/kpis/unidades',
    ZONAS: '/kpis/zonas',
    ALERTAS: '/kpis/alertas',
  },
  AUDITORIA: {
    EVENTOS: '/auditoria/eventos',
    OUTBOX: '/auditoria/outbox',
  },
  PUBLICO: {
    ALERTA_NUEVA: '/publico/alertas/nueva',
    HORARIOS: '/publico/horarios',
  },
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '/not-found',
} as const
