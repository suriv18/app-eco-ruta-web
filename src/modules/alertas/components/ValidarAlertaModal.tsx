import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/modules/operacion/components/Modal'
import { FormField, inputCls, selectCls } from '@/modules/operacion/components/FormField'
import { validarAlertaSchema, type ValidarAlertaFormData } from '@/modules/alertas/schemas/alertasSchemas'
import { useValidarAlerta } from '@/modules/alertas/hooks/useAlertasQuery'
import type { AlertaResponseDto } from '@/modules/alertas/types/alertasTypes'
import { extractApiError } from '@/shared/api/apiError'

interface Props {
  alerta: AlertaResponseDto
  isOpen: boolean
  onClose: () => void
}

export function ValidarAlertaModal({ alerta, isOpen, onClose }: Props) {
  const validar = useValidarAlerta()

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ValidarAlertaFormData>({
    resolver: zodResolver(validarAlertaSchema),
    defaultValues: { esDuplicada: false, dentroGeocerca: true, scoreSpam: 0 },
  })

  const esDuplicada = watch('esDuplicada')
  const handleClose = () => { reset(); onClose() }

  const onSubmit = (values: ValidarAlertaFormData) => {
    validar.mutate(
      {
        id: alerta.id,
        data: {
          esDuplicada: values.esDuplicada,
          alertaOriginalId: values.esDuplicada && values.alertaOriginalId ? values.alertaOriginalId : undefined,
          dentroGeocerca: values.dentroGeocerca,
          scoreSpam: Number(values.scoreSpam),
          resultado: values.resultado,
        },
      },
      { onSuccess: handleClose }
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Validar alerta" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
          <span className="font-medium text-gray-700">{alerta.titulo}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('esDuplicada')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">¿Es duplicada?</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('dentroGeocerca')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Dentro de geocerca</span>
          </label>
        </div>

        {esDuplicada && (
          <FormField label="ID de alerta original" error={errors.alertaOriginalId?.message}>
            <input {...register('alertaOriginalId')} className={inputCls}
              placeholder="UUID de la alerta original" />
          </FormField>
        )}

        <FormField label="Score de spam (0.0 – 1.0)" error={errors.scoreSpam?.message} required>
          <input {...register('scoreSpam', { valueAsNumber: true })} type="number" step="0.01" min={0} max={1} className={inputCls} />
        </FormField>

        <FormField label="Resultado" error={errors.resultado?.message} required>
          <select {...register('resultado')} className={selectCls}>
            <option value="">Selecciona un resultado</option>
            <option value="VALIDA">Válida</option>
            <option value="SPAM">Spam</option>
            <option value="DUPLICADA">Duplicada</option>
            <option value="FUERA_DE_AREA">Fuera de área</option>
          </select>
        </FormField>

        {validar.error && (
          <p className="text-red-600 text-sm">{extractApiError(validar.error).message}</p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button type="submit" disabled={validar.isPending}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {validar.isPending ? 'Validando...' : 'Validar alerta'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
