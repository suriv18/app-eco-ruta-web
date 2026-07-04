import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { usePermissions } from '@/shared/hooks/usePermissions'
import { ROUTES } from '@/app/config/routePaths'
import { env } from '@/app/config/env'
import type { Role } from '@/app/config/permissions'

interface NavItem {
  label: string
  to: string
  roles: Role[]
  children?: NavItem[]
}


const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD, roles: ['ADMIN', 'SUPERVISOR', 'OPERADOR', 'ANALISTA'] },
  { label: 'Mapa', to: ROUTES.MAPA, roles: ['ADMIN', 'SUPERVISOR', 'OPERADOR', 'ANALISTA'] },
  {
    label: 'Alertas',
    to: ROUTES.ALERTAS.LIST,
    roles: ['ADMIN', 'SUPERVISOR', 'OPERADOR'],
    children: [
      { label: 'Todas', to: ROUTES.ALERTAS.LIST, roles: ['ADMIN', 'SUPERVISOR', 'OPERADOR'] },
      { label: 'Críticas', to: ROUTES.ALERTAS.CRITICAS, roles: ['ADMIN', 'SUPERVISOR', 'OPERADOR'] },
    ],
  },
  { label: 'Rutas', to: ROUTES.RUTAS.LIST, roles: ['ADMIN', 'SUPERVISOR', 'OPERADOR', 'ANALISTA'] },
  {
    label: 'Operación',
    to: ROUTES.OPERACION.DISTRITOS,
    roles: ['ADMIN', 'SUPERVISOR', 'OPERADOR', 'ANALISTA'],
    children: [
      { label: 'Distritos', to: ROUTES.OPERACION.DISTRITOS, roles: ['ADMIN', 'SUPERVISOR', 'ANALISTA'] },
      { label: 'Zonas', to: ROUTES.OPERACION.ZONAS, roles: ['ADMIN', 'SUPERVISOR', 'ANALISTA'] },
      { label: 'Depósitos', to: ROUTES.OPERACION.DEPOSITOS, roles: ['ADMIN', 'SUPERVISOR', 'ANALISTA'] },
      { label: 'Contenedores', to: ROUTES.OPERACION.CONTENEDORES, roles: ['ADMIN', 'SUPERVISOR', 'OPERADOR'] },
      { label: 'Unidades', to: ROUTES.OPERACION.UNIDADES, roles: ['ADMIN', 'SUPERVISOR', 'ANALISTA'] },
      { label: 'Choferes', to: ROUTES.OPERACION.CHOFERES, roles: ['ADMIN', 'SUPERVISOR'] },
      { label: 'Turnos', to: ROUTES.OPERACION.TURNOS, roles: ['ADMIN', 'SUPERVISOR', 'OPERADOR'] },
      { label: 'Horarios', to: ROUTES.OPERACION.HORARIOS, roles: ['ADMIN', 'SUPERVISOR'] },
    ],
  },
  {
    label: 'KPIs',
    to: ROUTES.KPIS.RESUMEN,
    roles: ['ADMIN', 'SUPERVISOR', 'ANALISTA'],
    children: [
      { label: 'Resumen', to: ROUTES.KPIS.RESUMEN, roles: ['ADMIN', 'SUPERVISOR', 'ANALISTA'] },
      { label: 'Rutas', to: ROUTES.KPIS.RUTAS, roles: ['ADMIN', 'SUPERVISOR', 'ANALISTA'] },
      { label: 'Unidades', to: ROUTES.KPIS.UNIDADES, roles: ['ADMIN', 'SUPERVISOR', 'ANALISTA'] },
      { label: 'Zonas', to: ROUTES.KPIS.ZONAS, roles: ['ADMIN', 'SUPERVISOR', 'ANALISTA'] },
      { label: 'Alertas', to: ROUTES.KPIS.ALERTAS, roles: ['ADMIN', 'SUPERVISOR', 'ANALISTA'] },
    ],
  },
  {
    label: 'Auditoría',
    to: ROUTES.AUDITORIA.EVENTOS,
    roles: ['ADMIN'],
    children: [
      { label: 'Eventos', to: ROUTES.AUDITORIA.EVENTOS, roles: ['ADMIN'] },
      { label: 'Outbox',  to: ROUTES.AUDITORIA.OUTBOX,  roles: ['ADMIN'] },
    ],
  },
]

function NavItemRow({ item }: { item: NavItem }) {
  const { hasAnyRole } = usePermissions()
  const location = useLocation()
  const childPaths = item.children?.map((c) => c.to) ?? []
  const isInSection = childPaths.some((p) => location.pathname.startsWith(p))
  const [open, setOpen] = useState(isInSection)

  if (!hasAnyRole(item.roles)) return null

  if (item.children) {
    const visibleChildren = item.children.filter((c) => hasAnyRole(c.roles))
    return (
      <div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <span>{item.label}</span>
          <span className="text-gray-500 text-xs">{open ? '▾' : '▸'}</span>
        </button>
        {open && (
          <div className="ml-3 mt-1 space-y-0.5 border-l border-gray-700 pl-3">
            {visibleChildren.map((child) => (
              <NavLink
                key={child.to}
                to={child.to}
                className={({ isActive }) =>
                  `block px-2 py-1.5 rounded text-xs transition-colors ${
                    isActive
                      ? 'text-blue-400 font-medium'
                      : 'text-gray-400 hover:text-white'
                  }`
                }
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <NavLink
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
  )
}

export function Sidebar() {
  return (
    <aside className="w-56 bg-gray-900 text-white flex flex-col">
      <div className="px-4 py-5 border-b border-gray-700">
        <p className="font-bold text-base">{env.appName}</p>
        <p className="text-gray-400 text-xs mt-0.5">Panel Operativo</p>
      </div>
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavItemRow key={item.to} item={item} />
        ))}
      </nav>
    </aside>
  )
}
