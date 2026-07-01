import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/config/routePaths'

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-red-500">403</p>
        <h2 className="text-xl font-semibold text-gray-800 mt-2">Acceso denegado</h2>
        <p className="text-gray-500 mt-1">No tienes permisos para ver esta página.</p>
        <Link to={ROUTES.DASHBOARD} className="mt-4 inline-block text-blue-600 hover:underline">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
