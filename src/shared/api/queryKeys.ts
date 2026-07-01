export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  distritos: {
    all: () => ['distritos'] as const,
    list: (params?: object) => ['distritos', 'list', params] as const,
    detail: (id: string) => ['distritos', 'detail', id] as const,
  },
  zonas: {
    all: () => ['zonas'] as const,
    list: (params?: object) => ['zonas', 'list', params] as const,
    detail: (id: string) => ['zonas', 'detail', id] as const,
  },
  unidades: {
    all: () => ['unidades'] as const,
    list: (params?: object) => ['unidades', 'list', params] as const,
    detail: (id: string) => ['unidades', 'detail', id] as const,
    estadoActual: () => ['unidades', 'estadoActual'] as const,
  },
  choferes: {
    all: () => ['choferes'] as const,
    list: (params?: object) => ['choferes', 'list', params] as const,
    detail: (id: string) => ['choferes', 'detail', id] as const,
  },
  turnos: {
    all: () => ['turnos'] as const,
    list: (params?: object) => ['turnos', 'list', params] as const,
    detail: (id: string) => ['turnos', 'detail', id] as const,
  },
  alertas: {
    all: () => ['alertas'] as const,
    list: (params?: object) => ['alertas', 'list', params] as const,
    detail: (id: string) => ['alertas', 'detail', id] as const,
    criticas: (params?: object) => ['alertas', 'criticas', params] as const,
  },
  rutas: {
    all: () => ['rutas'] as const,
    list: (params?: object) => ['rutas', 'list', params] as const,
    detail: (id: string) => ['rutas', 'detail', id] as const,
    versiones: (id: string) => ['rutas', 'versiones', id] as const,
  },
  kpis: {
    resumenDiario: (params?: object) => ['kpis', 'resumenDiario', params] as const,
    rutas: (params?: object) => ['kpis', 'rutas', params] as const,
    unidades: (params?: object) => ['kpis', 'unidades', params] as const,
    zonas: (params?: object) => ['kpis', 'zonas', params] as const,
    alertas: (params?: object) => ['kpis', 'alertas', params] as const,
  },
  auditoria: {
    eventos: (params?: object) => ['auditoria', 'eventos', params] as const,
    outbox: (params?: object) => ['auditoria', 'outbox', params] as const,
  },
}
