import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DataTable, type Column } from '@/modules/operacion/components/DataTable'
import { Pagination } from '@/modules/operacion/components/Pagination'
import { Modal } from '@/modules/operacion/components/Modal'
import { EstadoBadge } from '@/modules/operacion/components/EstadoBadge'
import { FormField, inputCls, selectCls } from '@/modules/operacion/components/FormField'
import { depositoSchema, type DepositoFormData } from '@/modules/operacion/schemas/operacionSchemas'
import { useDepositos, useCrearDeposito, useDistritos } from '@/modules/operacion/hooks/useOperacionQuery'
import type { DepositoResponseDto } from '@/modules/operacion/types/operacionTypes'
import { PermissionGuard } from '@/modules/auth/components/PermissionGuard'
import { extractApiError } from '@/shared/api/apiError'

const TIPOS = ['BASE', 'TRANSFERENCIA', 'RELLENO', 'OTRO'] as const

export function DepositosPage() {
  const [page, setPage] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading } = useDepositos(page)
  const { data: distritos } = useDistritos(0, 100)
  const crear = useCrearDeposito()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DepositoFormData>({
    resolver: zodResolver(depositoSchema),
  })

  const onSubmit = (values: DepositoFormData) => {
    crear.mutate(values, { onSuccess: () => { reset(); setIsOpen(false) } })
  }

  const columns: Column<DepositoResponseDto>[] = [
    { header: 'Nombre', cell: (r) => <span className="font-medium">{r.nombre}</span> },
    { header: 'Tipo', cell: (r) => r.tipo },
    { header: 'Estado', cell: (r) => <EstadoBadge estado={r.estado} /> },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Depósitos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Bases, puntos de transferencia y rellenos sanitarios</p>
        </div>
        <PermissionGuard roles={['ADMIN', 'SUPERVISOR']}>
          <button onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            + Nuevo depósito
          </button>
        </PermissionGuard>
      </div>

      <DataTable columns={columns} data={data?.content ?? []} keyFn={(r) => r.id}
        isLoading={isLoading} emptyMessage="No hay depósitos registrados" />
      {data && (
        <Pagination page={page} totalPages={data.totalPages} totalElements={data.totalElements}
          size={20} onPageChange={setPage} />
      )}

      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); reset() }} title="Nuevo depósito">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Distrito" error={errors.distritoId?.message} required>
            <select {...register('distritoId')} className={selectCls}>
              <option value="">Selecciona un distrito</option>
              {distritos?.content.map((d) => <option key={d.id} value={d.id}>{d.nombre}</option>)}
            </select>
          </FormField>
          <FormField label="Nombre" error={errors.nombre?.message} required>
            <input {...register('nombre')} className={inputCls} placeholder="Ej: Base Central Surquillo" />
          </FormField>
          <FormField label="Tipo" error={errors.tipo?.message} required>
            <select {...register('tipo')} className={selectCls}>
              <option value="">Selecciona un tipo</option>
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
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
