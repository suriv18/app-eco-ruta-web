import { NavLink } from 'react-router-dom'
import { usePermissions } from '@/shared/hooks/usePermissions'
import { ROUTES } from '@/app/config/routePaths'
import { env } from '@/app/config/env'
import type { Role } from '@/app/config/permissions'

interface NavItem {
  label: string
  to: string
  roles: Role[]
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD, roles: ['ADMIN', 'SUPERVISOR', 'OPERADOR', 'ANALISTA'] },
  { label: 'Mapa', to: ROUTES.MAPA, roles: ['ADMIN', 'SUPERVISOR', 'OPERADOR', 'ANALISTA'] },
  { label: 'Alertas', to: ROUTES.ALERTAS.LIST, roles: ['ADMIN', 'SUPERVISOR', 'OPERADOR'] },
  { label: 'Rutas', to: ROUTES.RUTAS.LIST, roles: ['ADMIN', 'SUPERVISOR', 'OPERADOR', 'ANALISTA'] },
  { label: 'Operación', to: ROUTES.OPERACION.DISTRITOS, roles: ['ADMIN', 'SUPERVISOR'] },
  { label: 'KPIs', to: ROUTES.KPIS.RESUMEN, roles: ['ADMIN', 'SUPERVISOR', 'ANALISTA'] },
  { label: 'Auditoría', to: ROUTES.AUDITORIA.EVENTOS, roles: ['ADMIN', 'SUPERVISOR'] },
]

export function Sidebar() {
  const { hasAnyRole } = usePermissions()

  return (
    <aside className="w-56 bg-gray-900 text-white flex flex-col">
      <div className="px-4 py-5 border-b border-gray-700">
        <p className="font-bold text-base">{env.appName}</p>
        <p className="text-gray-400 text-xs mt-0.5">Panel Operativo</p>
      </div>
      <nav className="flex-1 py-4 space-y-1 px-2">
        {NAV_ITEMS.filter((item) => hasAnyRole(item.roles)).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
