import { Outlet, NavLink } from 'react-router-dom'
import { ROUTES } from '@/app/config/routePaths'
import { env } from '@/app/config/env'

export function PublicoLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">{env.appName}</p>
              <p className="text-xs text-gray-500">Portal ciudadano</p>
            </div>
          </div>
          <nav className="flex gap-1">
            <NavLink
              to={ROUTES.PUBLICO.ALERTA_NUEVA}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              Reportar alerta
            </NavLink>
            <NavLink
              to={ROUTES.PUBLICO.HORARIOS}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              Horarios
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-400">
        {env.appName} · Municipalidad de Lima · Portal de atención ciudadana
      </footer>
    </div>
  )
}
