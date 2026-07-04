import type { EstadoUnidadDto } from '@/modules/mapa/types/mapaTypes'

const ESTADO_COLOR: Record<string, string> = {
  EN_RUTA:       'text-green-700 bg-green-50',
  DETENIDA:      'text-yellow-700 bg-yellow-50',
  SIN_SENAL:     'text-gray-500 bg-gray-100',
  DESCARGANDO:   'text-blue-700 bg-blue-50',
  FUERA_DE_RUTA: 'text-red-700 bg-red-50',
}

const ESTADO_DOT: Record<string, string> = {
  EN_RUTA:       'bg-green-500',
  DETENIDA:      'bg-yellow-500',
  SIN_SENAL:     'bg-gray-400',
  DESCARGANDO:   'bg-blue-500',
  FUERA_DE_RUTA: 'bg-red-500',
}

const ESTADO_LABEL: Record<string, string> = {
  EN_RUTA:       'En ruta',
  DETENIDA:      'Detenida',
  SIN_SENAL:     'Sin señal',
  DESCARGANDO:   'Descargando',
  FUERA_DE_RUTA: 'Fuera de ruta',
}

interface Props {
  unidades: EstadoUnidadDto[]
  selected: string | null
  alertas: string[]
  onSelect: (id: string) => void
}

export function PanelLateral({ unidades, selected, alertas, onSelect }: Props) {
  const conPosicion    = unidades.filter((u) => u.latitud !== null)
  const sinPosicion    = unidades.filter((u) => u.latitud === null)

  const byEstado = (estado: string) => conPosicion.filter((u) => u.estadoMovimiento === estado)
  const enRuta   = byEstado('EN_RUTA').length
  const detenida = byEstado('DETENIDA').length
  const sinSenal = [...byEstado('SIN_SENAL'), ...sinPosicion].length
  const fuera    = byEstado('FUERA_DE_RUTA').length

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Resumen */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Flota — {unidades.length} unidades
        </p>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <span className="flex items-center gap-1.5 text-green-700"><span className="w-2 h-2 rounded-full bg-green-500" />{enRuta} en ruta</span>
          <span className="flex items-center gap-1.5 text-yellow-700"><span className="w-2 h-2 rounded-full bg-yellow-500" />{detenida} detenidas</span>
          <span className="flex items-center gap-1.5 text-red-700"><span className="w-2 h-2 rounded-full bg-red-500" />{fuera} fuera de ruta</span>
          <span className="flex items-center gap-1.5 text-gray-500"><span className="w-2 h-2 rounded-full bg-gray-400" />{sinSenal} sin señal</span>
        </div>
      </div>

      {/* Alertas críticas */}
      {alertas.length > 0 && (
        <div className="mx-3 mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <p className="text-xs font-semibold text-red-700 mb-1">
            ⚠ {alertas.length} alerta{alertas.length > 1 ? 's' : ''} crítica{alertas.length > 1 ? 's' : ''}
          </p>
          <ul className="space-y-0.5">
            {alertas.slice(0, 3).map((a, i) => (
              <li key={i} className="text-xs text-red-600 truncate">{a}</li>
            ))}
            {alertas.length > 3 && (
              <li className="text-xs text-red-400">+{alertas.length - 3} más</li>
            )}
          </ul>
        </div>
      )}

      {/* Lista de unidades */}
      <div className="flex-1 overflow-y-auto py-2">
        {conPosicion.length === 0 && sinPosicion.length === 0 && (
          <p className="text-xs text-gray-400 text-center mt-8">No hay unidades activas</p>
        )}

        {conPosicion.map((u) => {
          const estado = u.estadoMovimiento ?? 'SIN_SENAL'
          return (
            <button
              key={u.unidadExternoId}
              onClick={() => onSelect(u.unidadExternoId)}
              className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                selected === u.unidadExternoId ? 'bg-blue-50 border-blue-100' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ESTADO_DOT[estado] ?? 'bg-gray-400'}`} />
                  <code className="text-xs font-mono text-gray-700">
                    {u.unidadExternoId.slice(0, 8)}…
                  </code>
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${ESTADO_COLOR[estado] ?? 'text-gray-500 bg-gray-100'}`}>
                  {ESTADO_LABEL[estado] ?? estado}
                </span>
              </div>
              {u.ultimoPingEn && (
                <p className="text-xs text-gray-400 ml-4">
                  {new Date(u.ultimoPingEn).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                  {u.ultimaVelocidadKmh !== null && ` · ${u.ultimaVelocidadKmh.toFixed(0)} km/h`}
                </p>
              )}
            </button>
          )
        })}

        {sinPosicion.length > 0 && (
          <>
            <p className="text-xs text-gray-400 px-4 pt-3 pb-1 uppercase tracking-wide font-medium">Sin posición GPS</p>
            {sinPosicion.map((u) => (
              <div key={u.unidadExternoId}
                className="px-4 py-2 border-b border-gray-50 opacity-50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
                  <code className="text-xs font-mono text-gray-500">{u.unidadExternoId.slice(0, 8)}…</code>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
