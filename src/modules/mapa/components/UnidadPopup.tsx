import type { EstadoUnidadDto } from '@/modules/mapa/types/mapaTypes'

const ESTADO_LABEL: Record<string, string> = {
  EN_RUTA:      'En ruta',
  DETENIDA:     'Detenida',
  SIN_SENAL:    'Sin señal',
  DESCARGANDO:  'Descargando',
  FUERA_DE_RUTA:'Fuera de ruta',
}

const ESTADO_COLOR: Record<string, string> = {
  EN_RUTA:       '#22c55e',
  DETENIDA:      '#f59e0b',
  SIN_SENAL:     '#6b7280',
  DESCARGANDO:   '#3b82f6',
  FUERA_DE_RUTA: '#ef4444',
}

interface Props {
  unidad: EstadoUnidadDto
  onVerHistorial: (id: string) => void
}

export function UnidadPopup({ unidad, onVerHistorial }: Props) {
  const estado = unidad.estadoMovimiento ?? 'SIN_SENAL'
  const color  = ESTADO_COLOR[estado] ?? '#6b7280'
  const label  = ESTADO_LABEL[estado] ?? estado

  return (
    <div className="min-w-[200px] text-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
        <span className="font-semibold text-gray-900">{label}</span>
      </div>

      <table className="w-full text-xs text-gray-600 border-collapse">
        <tbody>
          <tr>
            <td className="py-0.5 pr-2 font-medium text-gray-500">Unidad</td>
            <td className="py-0.5 font-mono">{unidad.unidadExternoId.slice(0, 8)}…</td>
          </tr>
          {unidad.ultimaVelocidadKmh !== null && (
            <tr>
              <td className="py-0.5 pr-2 font-medium text-gray-500">Velocidad</td>
              <td className="py-0.5">{unidad.ultimaVelocidadKmh.toFixed(0)} km/h</td>
            </tr>
          )}
          {unidad.ultimoPingEn && (
            <tr>
              <td className="py-0.5 pr-2 font-medium text-gray-500">Último ping</td>
              <td className="py-0.5">
                {new Date(unidad.ultimoPingEn).toLocaleTimeString('es-PE', {
                  hour: '2-digit', minute: '2-digit', second: '2-digit',
                })}
              </td>
            </tr>
          )}
          {unidad.latitud !== null && (
            <tr>
              <td className="py-0.5 pr-2 font-medium text-gray-500">Posición</td>
              <td className="py-0.5 font-mono text-xs">
                {unidad.latitud.toFixed(5)}, {unidad.longitud?.toFixed(5)}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button
        onClick={() => onVerHistorial(unidad.unidadExternoId)}
        className="mt-3 w-full text-center text-xs text-blue-600 hover:underline"
      >
        Ver historial de recorrido
      </button>
    </div>
  )
}
