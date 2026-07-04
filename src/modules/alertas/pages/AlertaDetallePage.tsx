import { useNavigate, useParams } from 'react-router-dom'
import { AlertaDetalle } from '@/modules/alertas/components/AlertaDetalle'
import { useAlerta } from '@/modules/alertas/hooks/useAlertasQuery'
import { ROUTES } from '@/app/config/routePaths'

export function AlertaDetallePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: alerta, isLoading, isError } = useAlerta(id ?? '')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (isError || !alerta) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No se pudo cargar la alerta.</p>
        <button onClick={() => navigate(ROUTES.ALERTAS.LIST)}
          className="text-blue-600 hover:text-blue-800 text-sm">
          Volver a la lista
        </button>
      </div>
    )
  }

  return (
    <AlertaDetalle
      alerta={alerta}
      onBack={() => navigate(ROUTES.ALERTAS.LIST)}
    />
  )
}
