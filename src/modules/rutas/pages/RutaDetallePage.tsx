import { useNavigate, useParams } from 'react-router-dom'
import { useRutaDetalle } from '@/modules/rutas/hooks/useRutasQuery'
import { EstadoRutaBadge } from '@/modules/rutas/components/EstadoRutaBadge'
import { AccionesRuta } from '@/modules/rutas/components/AccionesRuta'
import { ParadasTable } from '@/modules/rutas/components/ParadasTable'
import { EventosRuta } from '@/modules/rutas/components/EventosRuta'
import { ROUTES } from '@/app/config/routePaths'

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const MOTIVO_LABEL: Record<string, string> = {
  INICIAL: 'Inicial', ALERTA_CRITICA: 'Alerta crítica',
  DESVIO: 'Desvío', MANUAL: 'Manual', RECALCULO: 'Recálculo',
}

export function RutaDetallePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: ruta, isLoading, isError } = useRutaDetalle(id ?? '')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (isError || !ruta) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No se pudo cargar la ruta.</p>
        <button onClick={() => navigate(ROUTES.RUTAS.LIST)}
          className="text-blue-600 hover:text-blue-800 text-sm">
          Volver a la lista
        </button>
      </div>
    )
  }

  const canEdit = ruta.estado === 'EN_EJECUCION'
  const versionActual = ruta.versionActual

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(ROUTES.RUTAS.LIST)}
            className="text-sm text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1"
          >
            ← Volver a rutas
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Ruta — {ruta.fecha}</h1>
            <EstadoRutaBadge estado={ruta.estado} />
          </div>
          <p className="text-sm text-gray-500 mt-1">{ruta.tipoRuta} · Creada {formatDate(ruta.creadoEn)}</p>
        </div>
        <AccionesRuta ruta={ruta} />
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Distancia', value: `${(ruta.metricas.distanciaM / 1000).toFixed(1)} km` },
          { label: 'Duración estimada', value: `${Math.round(ruta.metricas.duracionS / 60)} min` },
          { label: 'Carga total', value: `${ruta.metricas.cargaKg.toFixed(0)} kg` },
        ].map((m) => (
          <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{m.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Paradas (versión actual) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">
              Paradas
              {versionActual && (
                <span className="ml-2 text-xs text-gray-400 font-normal">
                  v{versionActual.version} · {MOTIVO_LABEL[versionActual.motivo] ?? versionActual.motivo}
                </span>
              )}
            </h2>
            {versionActual && (
              <span className="text-xs text-gray-400">{versionActual.paradas.length} paradas</span>
            )}
          </div>
          {versionActual ? (
            <ParadasTable
              rutaId={ruta.id}
              paradas={versionActual.paradas}
              canEdit={canEdit}
            />
          ) : (
            <p className="text-gray-400 text-sm italic">Sin versión activa — agrega paradas para comenzar</p>
          )}
        </div>

        {/* Panel lateral: versiones + eventos */}
        <div className="space-y-6">
          {/* Historial de versiones */}
          {ruta.historialVersiones.length > 1 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-3">
                Versiones ({ruta.historialVersiones.length})
              </h3>
              <div className="space-y-2">
                {ruta.historialVersiones.slice().reverse().map((v) => (
                  <div key={v.id} className={`flex items-center justify-between text-xs rounded-lg px-3 py-2 ${
                    v.id === versionActual?.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}>
                    <div>
                      <span className="font-medium">v{v.version}</span>
                      <span className="text-gray-500 ml-1.5">{MOTIVO_LABEL[v.motivo] ?? v.motivo}</span>
                    </div>
                    <div className="text-gray-400 text-right">
                      <p>{v.paradas.length} paradas</p>
                      <p>{(v.metricas.distanciaM / 1000).toFixed(1)} km</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eventos */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <EventosRuta
              rutaId={ruta.id}
              eventos={ruta.eventos}
              canAdd={ruta.estado === 'EN_EJECUCION'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
