import { Link } from 'react-router-dom'
import { StatCard } from '@/modules/dashboard/components/StatCard'
import { WidgetRutasHoy } from '@/modules/dashboard/components/WidgetRutasHoy'
import { WidgetAlertasCriticas } from '@/modules/dashboard/components/WidgetAlertasCriticas'
import { WidgetFlota } from '@/modules/dashboard/components/WidgetFlota'
import { WidgetTurnos } from '@/modules/dashboard/components/WidgetTurnos'
import {
  useAlertasRecientesDashboard,
  useRutasHoy,
  useFlotaDashboard,
  useTurnosActivosDashboard,
} from '@/modules/dashboard/hooks/useDashboard'
import { ROUTES } from '@/app/config/routePaths'
import { usePermissions } from '@/shared/hooks/usePermissions'

const DIA_HOY = new Date().toISOString().slice(0, 10)

function fmtFecha() {
  return new Date().toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function DashboardPage() {
  const { hasAnyRole } = usePermissions()

  const { data: rutasData,   isLoading: cargandoRutas }   = useRutasHoy()
  const { data: alertasData, isLoading: cargandoAlertas } = useAlertasRecientesDashboard()
  const { data: flota = [],  isLoading: cargandoFlota }   = useFlotaDashboard()
  const { data: turnosData,  isLoading: cargandoTurnos }  = useTurnosActivosDashboard()

  const rutas      = rutasData?.content ?? []
  const rutasEnEj  = rutas.filter((r) => r.estado === 'EN_EJECUCION').length
  const rutasFin   = rutas.filter((r) => r.estado === 'FINALIZADA').length

  const alertas      = alertasData?.content ?? []
  const alertasPend  = alertas.filter((a) => ['REGISTRADA', 'VALIDADA'].includes(a.estado)).length
  const totalAlertas = alertasData?.totalElements ?? 0

  const flotaActiva = flota.filter((u) => u.estadoMovimiento === 'EN_RUTA').length
  const flotaTotal  = flota.length

  const turnos        = turnosData?.content ?? []
  const turnosHoy     = turnos.filter((t) => t.fecha === DIA_HOY)
  const turnosActivos = turnosHoy.filter((t) => t.estado === 'EN_CURSO').length

  const canVerKpis = hasAnyRole(['ADMIN', 'SUPERVISOR', 'ANALISTA'])

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel operativo</h1>
          <p className="text-sm text-gray-500 mt-0.5 capitalize">{fmtFecha()}</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={ROUTES.MAPA}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Ver mapa
          </Link>
          {canVerKpis && (
            <Link
              to={ROUTES.KPIS.RESUMEN}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              KPIs del día
            </Link>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Rutas en ejecución"
          value={rutasEnEj}
          sub={`${rutasFin} finalizadas hoy`}
          color={rutasEnEj > 0 ? 'green' : 'gray'}
          loading={cargandoRutas}
        />
        <StatCard
          label="Unidades activas"
          value={flotaActiva}
          sub={`de ${flotaTotal} unidades`}
          color={flotaActiva > 0 ? 'blue' : 'gray'}
          loading={cargandoFlota}
        />
        <StatCard
          label="Alertas pendientes"
          value={alertasPend}
          sub={`${totalAlertas} total recientes`}
          color={alertasPend > 5 ? 'red' : alertasPend > 0 ? 'yellow' : 'green'}
          loading={cargandoAlertas}
        />
        <StatCard
          label="Turnos en curso"
          value={turnosActivos}
          sub={`${turnosHoy.length} turnos hoy`}
          color={turnosActivos > 0 ? 'green' : 'gray'}
          loading={cargandoTurnos}
        />
      </div>

      {/* Widgets — fila 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WidgetRutasHoy />
        <WidgetAlertasCriticas />
      </div>

      {/* Widgets — fila 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WidgetFlota />
        <WidgetTurnos />
      </div>

      {/* Accesos rápidos */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-semibold text-gray-700 text-sm mb-3">Accesos rápidos</h2>
        <div className="flex flex-wrap gap-2">
          {([
            { label: 'Alertas ciudadanas', to: ROUTES.ALERTAS.LIST,         roles: ['ADMIN', 'SUPERVISOR', 'OPERADOR'] },
            { label: 'Alertas críticas',   to: ROUTES.ALERTAS.CRITICAS,     roles: ['ADMIN', 'SUPERVISOR', 'OPERADOR'] },
            { label: 'Rutas',              to: ROUTES.RUTAS.LIST,           roles: ['ADMIN', 'SUPERVISOR', 'OPERADOR', 'ANALISTA'] },
            { label: 'Turnos',             to: ROUTES.OPERACION.TURNOS,     roles: ['ADMIN', 'SUPERVISOR', 'OPERADOR'] },
            { label: 'Unidades',           to: ROUTES.OPERACION.UNIDADES,   roles: ['ADMIN', 'SUPERVISOR', 'ANALISTA'] },
            { label: 'Choferes',           to: ROUTES.OPERACION.CHOFERES,   roles: ['ADMIN', 'SUPERVISOR'] },
            { label: 'KPIs',               to: ROUTES.KPIS.RESUMEN,         roles: ['ADMIN', 'SUPERVISOR', 'ANALISTA'] },
            { label: 'Auditoría',          to: ROUTES.AUDITORIA.EVENTOS,    roles: ['ADMIN'] },
          ]).filter((item) =>
            hasAnyRole(item.roles as ('ADMIN' | 'SUPERVISOR' | 'OPERADOR' | 'ANALISTA')[])
          ).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
