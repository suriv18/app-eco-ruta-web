import { useTurnosActivosDashboard } from '@/modules/dashboard/hooks/useDashboard'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/config/routePaths'

const ESTADO_TURNO: Record<string, { label: string; cls: string }> = {
  PROGRAMADO: { label: 'Programado', cls: 'bg-blue-100 text-blue-700' },
  EN_CURSO:   { label: 'En curso',   cls: 'bg-green-100 text-green-700' },
  FINALIZADO: { label: 'Finalizado', cls: 'bg-gray-100 text-gray-500' },
  CANCELADO:  { label: 'Cancelado',  cls: 'bg-red-100 text-red-600' },
}

const DIA_HOY = new Date().toISOString().slice(0, 10)

function fmtHora(t: string | null) {
  if (!t) return '—'
  return t.slice(0, 5)
}

export function WidgetTurnos() {
  const { data, isLoading } = useTurnosActivosDashboard()
  const todos   = data?.content ?? []
  const hoy     = todos.filter((t) => t.fecha === DIA_HOY)
  const activos = hoy.filter((t) => t.estado === 'EN_CURSO')
  const programados = hoy.filter((t) => t.estado === 'PROGRAMADO')

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800 text-sm">Turnos de hoy</h2>
        <Link to={ROUTES.OPERACION.TURNOS} className="text-xs text-blue-600 hover:underline">
          Ver todos →
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : hoy.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">Sin turnos para hoy</p>
      ) : (
        <>
          {/* Resumen */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-green-700">{activos.length}</p>
              <p className="text-xs text-green-600">En curso</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-blue-700">{programados.length}</p>
              <p className="text-xs text-blue-600">Programados</p>
            </div>
          </div>

          {/* Lista */}
          <div className="space-y-1.5">
            {hoy.slice(0, 5).map((t) => {
              const est = ESTADO_TURNO[t.estado] ?? ESTADO_TURNO.PROGRAMADO
              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${est.cls}`}>
                      {est.label}
                    </span>
                    <span className="text-xs text-gray-500 font-mono truncate">
                      {t.tipoTurno}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                    {fmtHora(t.horaInicio)} – {fmtHora(t.horaFin)}
                  </span>
                </div>
              )
            })}
            {hoy.length > 5 && (
              <p className="text-xs text-gray-400 text-center mt-1">+{hoy.length - 5} más</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
