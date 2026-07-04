import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Modal } from '@/modules/operacion/components/Modal'
import { FormField, inputCls, selectCls } from '@/modules/operacion/components/FormField'
import { crearRutaSchema, type CrearRutaFormData } from '@/modules/rutas/schemas/rutasSchemas'
import { useCrearRuta } from '@/modules/rutas/hooks/useRutasQuery'
import { useDistritos, useTurnos, useDepositos } from '@/modules/operacion/hooks/useOperacionQuery'
import { extractApiError } from '@/shared/api/apiError'
import { ROUTES } from '@/app/config/routePaths'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const TIPOS_RUTA = ['HISTORICA', 'OPTIMIZADA', 'REOPTIMIZADA'] as const

export function CrearRutaModal({ isOpen, onClose }: Props) {
  const navigate = useNavigate()
  const crear = useCrearRuta()

  const { data: distritos } = useDistritos(0, 100)
  const { data: turnos } = useTurnos(0, 100)
  const { data: depositos } = useDepositos(0, 100)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CrearRutaFormData>({
    resolver: zodResolver(crearRutaSchema),
  })

  const handleClose = () => { reset(); onClose() }

  const onSubmit = (values: CrearRutaFormData) => {
    crear.mutate(values, {
      onSuccess: (res) => {
        handleClose()
        navigate(ROUTES.RUTAS.DETALLE(res.data.id))
      },
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nueva ruta" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Distrito" error={errors.distritoId?.message} required>
            <select {...register('distritoId')} className={selectCls}>
              <option value="">Selecciona un distrito</option>
              {distritos?.content.map((d) => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Turno" error={errors.turnoId?.message} required>
            <select {...register('turnoId')} className={selectCls}>
              <option value="">Selecciona un turno</option>
              {turnos?.content.map((t) => (
                <option key={t.id} value={t.id}>{t.fecha} — {t.tipoTurno}</option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Depósito origen" error={errors.depositoOrigenId?.message} required>
            <select {...register('depositoOrigenId')} className={selectCls}>
              <option value="">Selecciona origen</option>
              {depositos?.content.map((d) => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Depósito destino" error={errors.depositoDestinoId?.message} required>
            <select {...register('depositoDestinoId')} className={selectCls}>
              <option value="">Selecciona destino</option>
              {depositos?.content.map((d) => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Fecha" error={errors.fecha?.message} required>
            <input {...register('fecha')} type="date" className={inputCls} />
          </FormField>
          <FormField label="Tipo de ruta" error={errors.tipoRuta?.message} required>
            <select {...register('tipoRuta')} className={selectCls}>
              <option value="">Selecciona tipo</option>
              {TIPOS_RUTA.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </FormField>
        </div>

        {crear.error && (
          <p className="text-red-600 text-sm">{extractApiError(crear.error).message}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button type="submit" disabled={crear.isPending}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {crear.isPending ? 'Creando...' : 'Crear ruta'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
