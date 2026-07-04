import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EstadoParadaBadge } from '@/modules/rutas/components/EstadoRutaBadge'
import { Modal } from '@/modules/operacion/components/Modal'
import { FormField, selectCls } from '@/modules/operacion/components/FormField'
import { actualizarParadaSchema, type ActualizarParadaFormData } from '@/modules/rutas/schemas/rutasSchemas'
import { useActualizarParada } from '@/modules/rutas/hooks/useRutasQuery'
import { PermissionGuard } from '@/modules/auth/components/PermissionGuard'
import { extractApiError } from '@/shared/api/apiError'
import type { RutaParadaDto, EstadoParada } from '@/modules/rutas/types/rutasTypes'

const TRANSICIONES_PARADA: Record<EstadoParada, EstadoParada[]> = {
  PENDIENTE:   ['EN_ATENCION', 'OMITIDA'],
  EN_ATENCION: ['ATENDIDA', 'OMITIDA'],
  ATENDIDA:    [],
  OMITIDA:     [],
}

function formatETA(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
}

interface Props {
  rutaId: string
  paradas: RutaParadaDto[]
  canEdit: boolean
}

export function ParadasTable({ rutaId, paradas, canEdit }: Props) {
  const [selected, setSelected] = useState<RutaParadaDto | null>(null)
  const actualizar = useActualizarParada()

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ActualizarParadaFormData>({
    resolver: zodResolver(actualizarParadaSchema),
  })

  const nuevoEstado = watch('nuevoEstado') as EstadoParada | undefined

  const handleClose = () => { setSelected(null); reset() }

  const onSubmit = (values: ActualizarParadaFormData) => {
    if (!selected) return
    actualizar.mutate(
      { rutaId, paradaId: selected.id, data: { nuevoEstado: values.nuevoEstado as EstadoParada } },
      { onSuccess: handleClose }
    )
  }

  const sortedParadas = [...paradas].sort((a, b) => a.orden - b.orden)

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide w-10">#</th>
              <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Zona</th>
              <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">ETA</th>
              <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Carga (kg)</th>
              <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Estado</th>
              {canEdit && <th className="py-2 px-3 w-20" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sortedParadas.map((p) => {
              const transiciones = TRANSICIONES_PARADA[p.estado]
              return (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 px-3 text-gray-400 font-mono text-xs">{p.orden}</td>
                  <td className="py-2.5 px-3">
                    <p className="font-medium text-gray-800 text-xs font-mono">{p.zonaId.slice(0, 8)}…</p>
                    {p.contenedorId && (
                      <p className="text-xs text-gray-400">Cont: {p.contenedorId.slice(0, 8)}…</p>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-gray-600 text-xs">{formatETA(p.eta)}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-gray-700">{p.demandaEstimadaKg.toFixed(1)}</span>
                    {p.cargaAcumuladaKg > 0 && (
                      <span className="text-gray-400 text-xs ml-1">/ {p.cargaAcumuladaKg.toFixed(1)}</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3"><EstadoParadaBadge estado={p.estado} /></td>
                  {canEdit && (
                    <td className="py-2.5 px-3 text-right">
                      <PermissionGuard roles={['ADMIN', 'SUPERVISOR', 'OPERADOR']}>
                        {transiciones.length > 0 && (
                          <button
                            onClick={() => { setSelected(p); reset() }}
                            className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-100 text-gray-600"
                          >
                            Actualizar
                          </button>
                        )}
                      </PermissionGuard>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
        {sortedParadas.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-6">Sin paradas en esta versión</p>
        )}
      </div>

      <Modal isOpen={!!selected} onClose={handleClose} title="Actualizar estado de parada" size="sm">
        {selected && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
              Parada #{selected.orden} — Estado actual: <span className="font-medium">{selected.estado}</span>
            </div>
            <FormField label="Nuevo estado" error={errors.nuevoEstado?.message} required>
              <select {...register('nuevoEstado')} className={selectCls}>
                <option value="">Selecciona estado</option>
                {TRANSICIONES_PARADA[selected.estado].map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </FormField>
            {(nuevoEstado === 'ATENDIDA') && (
              <p className="text-xs text-gray-500">
                Los tiempos de llegada/salida se registran automáticamente al marcar como Atendida.
              </p>
            )}
            {actualizar.error && (
              <p className="text-red-600 text-sm">{extractApiError(actualizar.error).message}</p>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                Cancelar
              </button>
              <button type="submit" disabled={actualizar.isPending}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {actualizar.isPending ? 'Guardando...' : 'Actualizar'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  )
}
