import { Link } from 'react-router-dom'
import { useAlertasCriticasDashboard } from '@/modules/dashboard/hooks/useDashboard'
import { ROUTES } from '@/app/config/routePaths'

const CRITICIDAD_COLOR: Record<string, string> = {
  CRITICA: 'text-red-700 bg-red-100',
  ALTA:    'text-orange-700 bg-orange-100',
  MEDIA:   'text-yellow-700 bg-yellow-100',
  BAJA:    'text-gray-600 bg-gray-100',
}

const ESTADO_DOT: Record<string, string> = {
  REGISTRADA:   'bg-gray-400',
  VALIDADA:     'bg-blue-400',
  EN_ATENCION:  'bg-yellow-400',
  ATENDIDA:     'bg-green-400',
  DESCARTADA:   'bg-gray-300',
  DUPLICADA:    'bg-gray-300',
}

function fmtRelativo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const min  = Math.floor(diff / 60_000)
  if (min < 60)  return `hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `hace ${h} h`
  return `hace ${Math.floor(h / 24)} d`
}

export function WidgetAlertasCriticas() {
  const { data, isLoading } = useAlertasCriticasDashboard()
  const alertas = data?.content ?? []

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-800 text-sm">Alertas críticas</h2>
          {!isLoading && data && data.totalElements > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold">
              {data.totalElements}
            </span>
          )}
        </div>
        <Link to={ROUTES.ALERTAS.CRITICAS} className="text-xs text-blue-600 hover:underline">
          Ver todas →
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : alertas.length === 0 ? (
        <div className="text-center py-6">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 font-medium">Sin alertas críticas</p>
        </div>
      ) : (
        <div className="space-y-2">
          {alertas.map((a) => (
            <Link
              key={a.id}
              to={`/alertas/${a.id}`}
              className="block p-3 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5 ${ESTADO_DOT[a.estado] ?? 'bg-gray-400'}`} />
                  <p className="text-xs font-medium text-gray-800 truncate">{a.titulo}</p>
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${CRITICIDAD_COLOR[a.nivelCriticidad] ?? CRITICIDAD_COLOR.BAJA}`}>
                  {a.nivelCriticidad}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-3">{fmtRelativo(a.registradaEn)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
