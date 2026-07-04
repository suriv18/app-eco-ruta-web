import { Link } from 'react-router-dom'
import { useRutasHoy } from '@/modules/dashboard/hooks/useDashboard'
import { ROUTES } from '@/app/config/routePaths'
import type { EstadoRuta } from '@/modules/rutas/types/rutasTypes'

const ESTADO_STYLE: Record<EstadoRuta, { bg: string; text: string; label: string }> = {
  BORRADOR:     { bg: 'bg-gray-100',   text: 'text-gray-600',  label: 'Borrador' },
  APROBADA:     { bg: 'bg-blue-100',   text: 'text-blue-700',  label: 'Aprobada' },
  EN_EJECUCION: { bg: 'bg-green-100',  text: 'text-green-700', label: 'En ejecución' },
  FINALIZADA:   { bg: 'bg-purple-100', text: 'text-purple-700',label: 'Finalizada' },
  CANCELADA:    { bg: 'bg-red-100',    text: 'text-red-700',   label: 'Cancelada' },
}

export function WidgetRutasHoy() {
  const { data, isLoading } = useRutasHoy()
  const rutas = data?.content ?? []

  const conteo = rutas.reduce<Record<string, number>>((acc, r) => {
    acc[r.estado] = (acc[r.estado] ?? 0) + 1
    return acc
  }, {})

  const enEjecucion = conteo['EN_EJECUCION'] ?? 0
  const finalizadas = conteo['FINALIZADA'] ?? 0
  const pendientes  = (conteo['BORRADOR'] ?? 0) + (conteo['APROBADA'] ?? 0)

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800 text-sm">Rutas de hoy</h2>
        <Link to={ROUTES.RUTAS.LIST} className="text-xs text-blue-600 hover:underline">
          Ver todas →
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : rutas.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">Sin rutas programadas para hoy</p>
      ) : (
        <>
          {/* Resumen por estado */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center">
              <p className="text-xl font-bold text-green-700">{enEjecucion}</p>
              <p className="text-xs text-gray-500">En ejecución</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-purple-700">{finalizadas}</p>
              <p className="text-xs text-gray-500">Finalizadas</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-blue-700">{pendientes}</p>
              <p className="text-xs text-gray-500">Pendientes</p>
            </div>
          </div>

          {/* Lista reciente */}
          <div className="space-y-1.5">
            {rutas.slice(0, 5).map((r) => {
              const style = ESTADO_STYLE[r.estado as EstadoRuta] ?? ESTADO_STYLE.BORRADOR
              return (
                <Link
                  key={r.id}
                  to={`/rutas/${r.id}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${style.bg} ${style.text} flex-shrink-0`}>
                      {style.label}
                    </span>
                    <span className="text-xs text-gray-500 truncate font-mono">
                      {r.id.slice(0, 8)}…
                    </span>
                  </div>
                  {r.metricas && (
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {(r.metricas.distanciaM / 1000).toFixed(1)} km
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          {rutas.length > 5 && (
            <p className="text-xs text-gray-400 text-center mt-2">
              +{rutas.length - 5} más
            </p>
          )}
        </>
      )}
    </div>
  )
}
