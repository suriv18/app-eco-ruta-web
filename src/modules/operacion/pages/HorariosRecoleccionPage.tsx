import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DataTable, type Column } from '@/modules/operacion/components/DataTable'
import { Pagination } from '@/modules/operacion/components/Pagination'
import { Modal } from '@/modules/operacion/components/Modal'
import { EstadoBadge } from '@/modules/operacion/components/EstadoBadge'
import { FormField, inputCls, selectCls } from '@/modules/operacion/components/FormField'
import { horarioSchema, type HorarioFormData } from '@/modules/operacion/schemas/operacionSchemas'
import { useHorarios, useCrearHorario, useEliminarHorario, useZonas } from '@/modules/operacion/hooks/useOperacionQuery'
import type { HorarioResponseDto } from '@/modules/operacion/types/operacionTypes'
import { PermissionGuard } from '@/modules/auth/components/PermissionGuard'
import { extractApiError } from '@/shared/api/apiError'

const DIAS = [
  { value: '1', label: 'Lunes' },
  { value: '2', label: 'Martes' },
  { value: '3', label: 'Miércoles' },
  { value: '4', label: 'Jueves' },
  { value: '5', label: 'Viernes' },
  { value: '6', label: 'Sábado' },
  { value: '7', label: 'Domingo' },
]

export function HorariosRecoleccionPage() {
  const [page, setPage] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const { data, isLoading } = useHorarios(page)
  const { data: zonas } = useZonas(0, 100)
  const crear = useCrearHorario()
  const eliminar = useEliminarHorario()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<HorarioFormData>({
    resolver: zodResolver(horarioSchema),
  })

  const onSubmit = (values: HorarioFormData) => {
    crear.mutate(values, { onSuccess: () => { reset(); setIsOpen(false) } })
  }

  const columns: Column<HorarioResponseDto>[] = [
    { header: 'Zona', cell: (r) => <span className="font-medium">{r.zonaId}</span> },
    {
      header: 'Día',
      cell: (r) => {
        const dia = DIAS.find((d) => d.value === String(r.diaSemana))
        return <span className="text-sm text-gray-700">{dia?.label ?? r.diaSemana}</span>
      },
    },
    {
      header: 'Horario',
      cell: (r) => <span className="text-sm text-gray-600">{r.horaInicio} — {r.horaFin}</span>,
    },
    { header: 'Observación', cell: (r) => r.observacion ?? '—' },
    { header: 'Estado', cell: (r) => <EstadoBadge estado={r.estado} /> },
    {
      header: 'Acciones',
      className: 'text-right',
      cell: (r) => (
        <PermissionGuard roles={['ADMIN']}>
          <button
            onClick={() => setConfirmDeleteId(r.id)}
            className="text-xs px-2.5 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
          >
            Eliminar
          </button>
        </PermissionGuard>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Horarios de recolección</h1>
          <p className="text-sm text-gray-500 mt-0.5">Programación de recolección por zona y día</p>
        </div>
        <PermissionGuard roles={['ADMIN', 'SUPERVISOR']}>
          <button onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            + Nuevo horario
          </button>
        </PermissionGuard>
      </div>

      <DataTable columns={columns} data={data?.content ?? []} keyFn={(r) => r.id}
        isLoading={isLoading} emptyMessage="No hay horarios de recolección registrados" />
      {data && (
        <Pagination page={page} totalPages={data.totalPages} totalElements={data.totalElements}
          size={20} onPageChange={setPage} />
      )}

      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); reset() }} title="Nuevo horario de recolección" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Zona" error={errors.zonaId?.message} required>
            <select {...register('zonaId')} className={selectCls}>
              <option value="">Selecciona una zona</option>
              {zonas?.content.map((z) => <option key={z.id} value={z.id}>{z.nombre}</option>)}
            </select>
          </FormField>
          <FormField label="Día de la semana" error={errors.diaSemana?.message} required>
            <select {...register('diaSemana', { valueAsNumber: true })} className={selectCls}>
              <option value="">Selecciona un día</option>
              {DIAS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Hora inicio (HH:mm)" error={errors.horaInicio?.message} required>
              <input {...register('horaInicio')} className={inputCls} placeholder="06:00" />
            </FormField>
            <FormField label="Hora fin (HH:mm)" error={errors.horaFin?.message} required>
              <input {...register('horaFin')} className={inputCls} placeholder="12:00" />
            </FormField>
          </div>
          <FormField label="Observación" error={errors.observacion?.message}>
            <textarea {...register('observacion')} className={inputCls} rows={2}
              placeholder="Opcional — notas adicionales" />
          </FormField>
          {crear.error && <p className="text-red-600 text-sm">{extractApiError(crear.error).message}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => { setIsOpen(false); reset() }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={crear.isPending}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {crear.isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)} title="Confirmar eliminación" size="sm">
        <p className="text-sm text-gray-600 mb-4">¿Estás seguro de que deseas eliminar este horario? Esta acción no se puede deshacer.</p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setConfirmDeleteId(null)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button
            onClick={() => {
              if (confirmDeleteId) {
                eliminar.mutate(confirmDeleteId, { onSuccess: () => setConfirmDeleteId(null) })
              }
            }}
            disabled={eliminar.isPending}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50">
            {eliminar.isPending ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
