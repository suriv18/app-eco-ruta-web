import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/modules/operacion/components/Modal'
import { FormField, selectCls, inputCls } from '@/modules/operacion/components/FormField'
import { cambiarEstadoSchema, type CambiarEstadoFormData } from '@/modules/alertas/schemas/alertasSchemas'
import { useCambiarEstadoAlerta } from '@/modules/alertas/hooks/useAlertasQuery'
import { TRANSICIONES_VALIDAS } from '@/modules/alertas/types/alertasTypes'
import type { AlertaResponseDto, EstadoAlerta } from '@/modules/alertas/types/alertasTypes'
import { extractApiError } from '@/shared/api/apiError'

const ESTADO_LABELS: Record<EstadoAlerta, string> = {
  REGISTRADA: 'Registrada',
  VALIDADA: 'Validada',
  EN_ATENCION: 'En atención',
  ATENDIDA: 'Atendida',
  DESCARTADA: 'Descartada',
  DUPLICADA: 'Duplicada',
}

interface Props {
  alerta: AlertaResponseDto
  isOpen: boolean
  onClose: () => void
}

export function CambiarEstadoModal({ alerta, isOpen, onClose }: Props) {
  const cambiar = useCambiarEstadoAlerta()
  const transiciones = TRANSICIONES_VALIDAS[alerta.estado]

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CambiarEstadoFormData>({
    resolver: zodResolver(cambiarEstadoSchema),
  })

  const handleClose = () => { reset(); onClose() }

  const onSubmit = (values: CambiarEstadoFormData) => {
    cambiar.mutate(
      {
        id: alerta.id,
        data: {
          nuevoEstado: values.nuevoEstado as EstadoAlerta,
          comentario: values.comentario || undefined,
        },
      },
      { onSuccess: handleClose }
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Cambiar estado de alerta" size="sm">
      {transiciones.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">Esta alerta está en un estado terminal y no puede modificarse.</p>
          <button onClick={handleClose} className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm">Cerrar</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
            Estado actual: <span className="font-medium">{ESTADO_LABELS[alerta.estado]}</span>
          </div>
          <FormField label="Nuevo estado" error={errors.nuevoEstado?.message} required>
            <select {...register('nuevoEstado')} className={selectCls}>
              <option value="">Selecciona un estado</option>
              {transiciones.map((e) => (
                <option key={e} value={e}>{ESTADO_LABELS[e]}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Comentario" error={errors.comentario?.message}>
            <textarea {...register('comentario')} className={inputCls} rows={3}
              placeholder="Opcional — agrega una nota sobre este cambio" />
          </FormField>
          {cambiar.error && (
            <p className="text-red-600 text-sm">{extractApiError(cambiar.error).message}</p>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={cambiar.isPending}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {cambiar.isPending ? 'Guardando...' : 'Cambiar estado'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
