import { useAccionRuta } from '@/modules/rutas/hooks/useRutasQuery'
import { TRANSICIONES_RUTA } from '@/modules/rutas/types/rutasTypes'
import type { RutaResponseDto } from '@/modules/rutas/types/rutasTypes'
import { PermissionGuard } from '@/modules/auth/components/PermissionGuard'
import { extractApiError } from '@/shared/api/apiError'

interface Props {
  ruta: RutaResponseDto
}

const ACTION_STYLES: Record<string, string> = {
  aprobar: 'border-blue-300 text-blue-600 hover:bg-blue-50',
  'iniciar-ejecucion': 'border-green-300 text-green-600 hover:bg-green-50',
  finalizar: 'border-green-300 text-green-600 hover:bg-green-50',
  cancelar: 'border-red-300 text-red-600 hover:bg-red-50',
}

const ACTION_ROLES: Record<string, ('ADMIN' | 'SUPERVISOR' | 'OPERADOR')[]> = {
  aprobar: ['ADMIN', 'SUPERVISOR'],
  'iniciar-ejecucion': ['ADMIN', 'SUPERVISOR', 'OPERADOR'],
  finalizar: ['ADMIN', 'SUPERVISOR', 'OPERADOR'],
  cancelar: ['ADMIN', 'SUPERVISOR'],
}

export function AccionesRuta({ ruta }: Props) {
  const accion = useAccionRuta()
  const transiciones = TRANSICIONES_RUTA[ruta.estado]

  if (transiciones.length === 0) return null

  return (
    <div className="flex items-center gap-2">
      {accion.error && (
        <span className="text-xs text-red-600">{extractApiError(accion.error).message}</span>
      )}
      {transiciones.map((t) => (
        <PermissionGuard key={t.action} roles={ACTION_ROLES[t.action] ?? ['ADMIN']}>
          <button
            onClick={() => accion.mutate({ id: ruta.id, accion: t.action as Parameters<typeof accion.mutate>[0]['accion'] })}
            disabled={accion.isPending}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${ACTION_STYLES[t.action] ?? 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
          >
            {accion.isPending ? '...' : t.label}
          </button>
        </PermissionGuard>
      ))}
    </div>
  )
}
