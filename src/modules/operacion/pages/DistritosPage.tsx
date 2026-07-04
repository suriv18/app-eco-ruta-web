import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DataTable, type Column } from '@/modules/operacion/components/DataTable'
import { Pagination } from '@/modules/operacion/components/Pagination'
import { Modal } from '@/modules/operacion/components/Modal'
import { EstadoBadge } from '@/modules/operacion/components/EstadoBadge'
import { FormField, inputCls } from '@/modules/operacion/components/FormField'
import { distritoSchema, type DistritoFormData } from '@/modules/operacion/schemas/operacionSchemas'
import { useDistritos, useCrearDistrito, useToggleDistrito } from '@/modules/operacion/hooks/useOperacionQuery'
import type { DistritoResponseDto } from '@/modules/operacion/types/operacionTypes'
import { PermissionGuard } from '@/modules/auth/components/PermissionGuard'
import { extractApiError } from '@/shared/api/apiError'

export function DistritosPage() {
  const [page, setPage] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading } = useDistritos(page)
  const crear = useCrearDistrito()
  const toggle = useToggleDistrito()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DistritoFormData>({
    resolver: zodResolver(distritoSchema),
  })

  const onSubmit = (values: DistritoFormData) => {
    crear.mutate(
      { nombre: values.nombre, ubigeo: values.ubigeo || undefined },
      { onSuccess: () => { reset(); setIsOpen(false) } }
    )
  }

  const columns: Column<DistritoResponseDto>[] = [
    { header: 'Nombre', cell: (r) => <span className="font-medium">{r.nombre}</span> },
    { header: 'Ubigeo', cell: (r) => r.ubigeo ?? '—' },
    { header: 'Estado', cell: (r) => <EstadoBadge estado={r.estado} /> },
    {
      header: 'Acciones',
      className: 'text-right',
      cell: (r) => (
        <PermissionGuard roles={['ADMIN']}>
          <button
            onClick={() => toggle.mutate({ id: r.id, activo: r.estado === 'ACTIVO' })}
            disabled={toggle.isPending}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-colors disabled:opacity-50 ${
              r.estado === 'ACTIVO'
                ? 'border-red-200 text-red-600 hover:bg-red-50'
                : 'border-green-200 text-green-600 hover:bg-green-50'
            }`}
          >
            {r.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
          </button>
        </PermissionGuard>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Distritos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestión de distritos municipales</p>
        </div>
        <PermissionGuard roles={['ADMIN', 'SUPERVISOR']}>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nuevo distrito
          </button>
        </PermissionGuard>
      </div>

      <DataTable
        columns={columns}
        data={data?.content ?? []}
        keyFn={(r) => r.id}
        isLoading={isLoading}
        emptyMessage="No hay distritos registrados"
      />
      {data && (
        <Pagination
          page={page}
          totalPages={data.totalPages}
          totalElements={data.totalElements}
          size={20}
          onPageChange={setPage}
        />
      )}

      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); reset() }} title="Nuevo distrito">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Nombre" error={errors.nombre?.message} required>
            <input {...register('nombre')} className={inputCls} placeholder="Ej: Miraflores" />
          </FormField>
          <FormField label="Ubigeo" error={errors.ubigeo?.message}>
            <input {...register('ubigeo')} className={inputCls} placeholder="Ej: 150122" />
          </FormField>
          {crear.error && (
            <p className="text-red-600 text-sm">{extractApiError(crear.error).message}</p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => { setIsOpen(false); reset() }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
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
