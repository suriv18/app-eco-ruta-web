import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DataTable, type Column } from '@/modules/operacion/components/DataTable'
import { Pagination } from '@/modules/operacion/components/Pagination'
import { Modal } from '@/modules/operacion/components/Modal'
import { EstadoBadge } from '@/modules/operacion/components/EstadoBadge'
import { FormField, inputCls } from '@/modules/operacion/components/FormField'
import { choferSchema, type ChoferFormData } from '@/modules/operacion/schemas/operacionSchemas'
import { useChoferes, useCrearChofer, useCambiarEstadoChofer } from '@/modules/operacion/hooks/useOperacionQuery'
import type { ChoferResponseDto, EstadoChofer } from '@/modules/operacion/types/operacionTypes'
import { PermissionGuard } from '@/modules/auth/components/PermissionGuard'
import { extractApiError } from '@/shared/api/apiError'

const ESTADOS_CHOFER: EstadoChofer[] = ['ACTIVO', 'SUSPENDIDO', 'INACTIVO']

export function ChoferesPage() {
  const [page, setPage] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading } = useChoferes(page)
  const crear = useCrearChofer()
  const cambiarEstado = useCambiarEstadoChofer()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChoferFormData>({
    resolver: zodResolver(choferSchema),
  })

  const onSubmit = (values: ChoferFormData) => {
    crear.mutate(values, { onSuccess: () => { reset(); setIsOpen(false) } })
  }

  const columns: Column<ChoferResponseDto>[] = [
    {
      header: 'Nombre',
      cell: (r) => (
        <div>
          <p className="font-medium">{r.nombres} {r.apellidos}</p>
          {r.dni && <p className="text-xs text-gray-500">DNI: {r.dni}</p>}
        </div>
      ),
    },
    { header: 'Licencia', cell: (r) => r.licencia ? <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{r.licencia}</code> : '—' },
    { header: 'Teléfono', cell: (r) => r.telefono ?? '—' },
    { header: 'Estado', cell: (r) => <EstadoBadge estado={r.estado} /> },
    {
      header: 'Cambiar estado',
      cell: (r) => (
        <PermissionGuard roles={['ADMIN', 'SUPERVISOR']}>
          <select
            value={r.estado}
            onChange={(e) => cambiarEstado.mutate({ id: r.id, estado: e.target.value as EstadoChofer })}
            className="text-xs border border-gray-200 rounded px-2 py-1"
          >
            {ESTADOS_CHOFER.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </PermissionGuard>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Choferes</h1>
          <p className="text-sm text-gray-500 mt-0.5">Personal operativo asignado a rutas</p>
        </div>
        <PermissionGuard roles={['ADMIN', 'SUPERVISOR']}>
          <button onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            + Nuevo chofer
          </button>
        </PermissionGuard>
      </div>

      <DataTable columns={columns} data={data?.content ?? []} keyFn={(r) => r.id}
        isLoading={isLoading} emptyMessage="No hay choferes registrados" />
      {data && (
        <Pagination page={page} totalPages={data.totalPages} totalElements={data.totalElements}
          size={20} onPageChange={setPage} />
      )}

      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); reset() }} title="Nuevo chofer" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Nombres" error={errors.nombres?.message} required>
              <input {...register('nombres')} className={inputCls} placeholder="Ej: Juan Carlos" />
            </FormField>
            <FormField label="Apellidos" error={errors.apellidos?.message} required>
              <input {...register('apellidos')} className={inputCls} placeholder="Ej: Pérez García" />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="DNI" error={errors.dni?.message}>
              <input {...register('dni')} className={inputCls} placeholder="Ej: 12345678" maxLength={8} />
            </FormField>
            <FormField label="Licencia de conducir" error={errors.licencia?.message}>
              <input {...register('licencia')} className={inputCls} placeholder="Ej: A-IIb-123456" />
            </FormField>
          </div>
          <FormField label="Teléfono" error={errors.telefono?.message}>
            <input {...register('telefono')} className={inputCls} placeholder="Ej: 987654321" type="tel" />
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
    </div>
  )
}
