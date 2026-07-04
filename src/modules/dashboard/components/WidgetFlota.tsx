import { Link } from 'react-router-dom'
import { useFlotaDashboard } from '@/modules/dashboard/hooks/useDashboard'
import { ROUTES } from '@/app/config/routePaths'

const ESTADO_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  EN_RUTA:       { label: 'En ruta',       color: 'text-green-700',  dot: 'bg-green-500' },
  DETENIDA:      { label: 'Detenida',      color: 'text-yellow-700', dot: 'bg-yellow-500' },
  SIN_SENAL:     { label: 'Sin señal',     color: 'text-gray-500',   dot: 'bg-gray-400' },
  DESCARGANDO:   { label: 'Descargando',   color: 'text-blue-700',   dot: 'bg-blue-500' },
  FUERA_DE_RUTA: { label: 'Fuera de ruta', color: 'text-red-700',    dot: 'bg-red-500' },
}

export function WidgetFlota() {
  const { data: unidades = [], isLoading } = useFlotaDashboard()

  const conPosicion = unidades.filter((u) => u.latitud !== null)
  const sinSenal    = unidades.filter((u) => u.latitud === null || u.estadoMovimiento === 'SIN_SENAL')

  const conteo = conPosicion.reduce<Record<string, number>>((acc, u) => {
    const k = u.estadoMovimiento ?? 'SIN_SENAL'
    acc[k] = (acc[k] ?? 0) + 1
    return acc
  }, {})
  if (sinSenal.length) conteo['SIN_SENAL'] = (conteo['SIN_SENAL'] ?? 0) + sinSenal.filter((u) => u.latitud === null).length

  const total    = unidades.length
  const activas  = conteo['EN_RUTA'] ?? 0
  const alertas  = conteo['FUERA_DE_RUTA'] ?? 0

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800 text-sm">Estado de flota</h2>
        <Link to={ROUTES.MAPA} className="text-xs text-blue-600 hover:underline">
          Ver mapa →
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : total === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">Sin unidades registradas</p>
      ) : (
        <>
          {/* Número grande */}
          <div className="flex items-end gap-3 mb-4">
            <div>
              <p className="text-3xl font-bold text-gray-900">{activas}</p>
              <p className="text-xs text-gray-500">de {total} unidades activas</p>
            </div>
            {alertas > 0 && (
              <div className="mb-0.5 px-2 py-1 bg-red-100 rounded-lg">
                <p className="text-xs font-semibold text-red-700">{alertas} fuera de ruta</p>
              </div>
            )}
          </div>

          {/* Barras proporcionales */}
          <div className="space-y-2">
            {Object.entries(ESTADO_CONFIG).map(([k, cfg]) => {
              const n = conteo[k] ?? 0
              if (n === 0) return null
              const pct = total > 0 ? (n / total) * 100 : 0
              return (
                <div key={k}>
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <span className="text-xs text-gray-500">{n}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cfg.dot}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
