import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/modules/operacion/components/Modal'
import { FormField, selectCls, inputCls } from '@/modules/operacion/components/FormField'
import { registrarEventoSchema, type RegistrarEventoFormData } from '@/modules/rutas/schemas/rutasSchemas'
import { useRegistrarEvento } from '@/modules/rutas/hooks/useRutasQuery'
import { PermissionGuard } from '@/modules/auth/components/PermissionGuard'
import { extractApiError } from '@/shared/api/apiError'
import type { RutaEventoDto, TipoEventoRuta } from '@/modules/rutas/types/rutasTypes'

const TIPO_LABELS: Record<TipoEventoRuta, string> = {
  INICIO: 'Inicio',
  FIN: 'Fin',
  DESVIO: 'Desvío',
  PARADA_ATENDIDA: 'Parada atendida',
  AVERIA: 'Avería',
  REOPTIMIZACION: 'Reoptimización',
  OBSERVACION: 'Observación',
}

const TIPO_COLORS: Record<TipoEventoRuta, string> = {
  INICIO: 'bg-green-100 text-green-700',
  FIN: 'bg-blue-100 text-blue-700',
  DESVIO: 'bg-orange-100 text-orange-700',
  PARADA_ATENDIDA: 'bg-teal-100 text-teal-700',
  AVERIA: 'bg-red-100 text-red-700',
  REOPTIMIZACION: 'bg-purple-100 text-purple-700',
  OBSERVACION: 'bg-gray-100 text-gray-600',
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('es-PE', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  })
}

interface Props {
  rutaId: string
  eventos: RutaEventoDto[]
  canAdd: boolean
}

export function EventosRuta({ rutaId, eventos, canAdd }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const registrar = useRegistrarEvento()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RegistrarEventoFormData>({
    resolver: zodResolver(registrarEventoSchema),
  })

  const handleClose = () => { setIsOpen(false); reset() }

  const onSubmit = (values: RegistrarEventoFormData) => {
    registrar.mutate(
      { rutaId, data: { tipoEvento: values.tipoEvento as TipoEventoRuta, descripcion: values.descripcion || undefined } },
      { onSuccess: handleClose }
    )
  }

  const sorted = [...eventos].sort((a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime())

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
          Eventos ({eventos.length})
        </h3>
        {canAdd && (
          <PermissionGuard roles={['ADMIN', 'SUPERVISOR', 'OPERADOR']}>
            <button onClick={() => setIsOpen(true)}
              className="text-xs px-2.5 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
              + Registrar evento
            </button>
          </PermissionGuard>
        )}
      </div>

      {sorted.length === 0 ? (
        <p className="text-gray-400 text-sm italic">Sin eventos registrados</p>
      ) : (
        <ol className="relative border-l border-gray-200 space-y-3 ml-2">
          {sorted.map((e) => (
            <li key={e.id} className="ml-4">
              <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-gray-300 border-2 border-white" />
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${TIPO_COLORS[e.tipoEvento] ?? 'bg-gray-100 text-gray-600'}`}>
                  {TIPO_LABELS[e.tipoEvento] ?? e.tipoEvento}
                </span>
                <span className="text-xs text-gray-400">{formatDateTime(e.creadoEn)}</span>
              </div>
              {e.descripcion && (
                <p className="text-sm text-gray-600 italic">"{e.descripcion}"</p>
              )}
            </li>
          ))}
        </ol>
      )}

      <Modal isOpen={isOpen} onClose={handleClose} title="Registrar evento" size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Tipo de evento" error={errors.tipoEvento?.message} required>
            <select {...register('tipoEvento')} className={selectCls}>
              <option value="">Selecciona un tipo</option>
              {(Object.keys(TIPO_LABELS) as TipoEventoRuta[]).map((t) => (
                <option key={t} value={t}>{TIPO_LABELS[t]}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Descripción" error={errors.descripcion?.message}>
            <textarea {...register('descripcion')} className={inputCls} rows={3}
              placeholder="Opcional — detalle del evento" />
          </FormField>
          {registrar.error && (
            <p className="text-red-600 text-sm">{extractApiError(registrar.error).message}</p>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={registrar.isPending}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {registrar.isPending ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
