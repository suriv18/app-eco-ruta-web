export const env = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL as string) ?? 'http://localhost:8080',
  wsUrl: (import.meta.env.VITE_WS_URL as string) ?? 'ws://localhost:8080/ws',
  mapTileUrl: (import.meta.env.VITE_MAP_TILE_URL as string) ?? 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  appName: (import.meta.env.VITE_APP_NAME as string) ?? 'Ciudad Sana',
  tenantId: (import.meta.env.VITE_TENANT_ID as string) ?? '11111111-1111-1111-1111-111111111111',
} as const
