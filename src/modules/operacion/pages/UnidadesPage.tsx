import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DataTable, type Column } from '@/modules/operacion/components/DataTable'
import { Pagination } from '@/modules/operacion/components/Pagination'
import { Modal } from '@/modules/operacion/components/Modal'
import { EstadoBadge } from '@/modules/operacion/components/EstadoBadge'
import { FormField, inputCls, selectCls } from '@/modules/operacion/components/FormField'
import { unidadSchema, type UnidadFormData } from '@/modules/operacion/schemas/operacionSchemas'
import { useUnidades, useCrearUnidad, useCambiarEstadoUnidad } from '@/modules/operacion/hooks/useOperacionQuery'
import type { UnidadResponseDto, EstadoOperativoUnidad, TipoUnidad } from '@/modules/operacion/types/operacionTypes'
import { PermissionGuard } from '@/modules/auth/components/PermissionGuard'
import { extractApiError } from '@/shared/api/apiError'

const TIPOS_UNIDAD: TipoUnidad[] = ['COMPACTADOR', 'BARANDA', 'VOLQUETE', 'MOTOFURGON', 'OTRO']
const ESTADOS_UNIDAD: EstadoOperativoUnidad[] = ['OPERATIVA', 'MANTENIMIENTO', 'INACTIVA', 'AVERIADA']

export function UnidadesPage() {
  const [page, setPage] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading } = useUnidades(page)
  const crear = useCrearUnidad()
  const cambiarEstado = useCambiarEstadoUnidad()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UnidadFormData>({
    resolver: zodResolver(unidadSchema),
  })

  const onSubmit = (values: UnidadFormData) => {
    crear.mutate(values, { onSuccess: () => { reset(); setIsOpen(false) } })
  }

  const columns: Column<UnidadResponseDto>[] = [
    {
      header: 'Placa / Código',
      cell: (r) => (
        <div>
          <code className="text-xs font-mono font-bold bg-gray-100 px-1.5 py-0.5 rounded">{r.placa}</code>
          <p className="text-xs text-gray-500 mt-0.5">{r.codigoInterno}</p>
        </div>
      ),
    },
    { header: 'Tipo', cell: (r) => r.tipoUnidad },
    { header: 'Capacidad', cell: (r) => `${r.capacidadM3} m³ / ${r.capacidadKg} kg` },
    { header: 'Estado', cell: (r) => <EstadoBadge estado={r.estadoOperativo} /> },
    {
      header: 'Cambiar estado',
      cell: (r) => (
        <PermissionGuard roles={['ADMIN', 'SUPERVISOR']}>
          <select
            value={r.estadoOperativo}
            onChange={(e) => cambiarEstado.mutate({ id: r.id, nuevoEstado: e.target.value as EstadoOperativoUnidad })}
            className="text-xs border border-gray-200 rounded px-2 py-1"
          >
            {ESTADOS_UNIDAD.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </PermissionGuard>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Unidades</h1>
          <p className="text-sm text-gray-500 mt-0.5">Vehículos recolectores de residuos</p>
        </div>
        <PermissionGuard roles={['ADMIN', 'SUPERVISOR']}>
          <button onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            + Nueva unidad
          </button>
        </PermissionGuard>
      </div>

      <DataTable columns={columns} data={data?.content ?? []} keyFn={(r) => r.id}
        isLoading={isLoading} emptyMessage="No hay unidades registradas" />
      {data && (
        <Pagination page={page} totalPages={data.totalPages} totalElements={data.totalElements}
          size={20} onPageChange={setPage} />
      )}

      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); reset() }} title="Nueva unidad" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Placa" error={errors.placa?.message} required>
              <input {...register('placa')} className={inputCls} placeholder="Ej: ABC-123"
                style={{ textTransform: 'uppercase' }} />
            </FormField>
            <FormField label="Código interno" error={errors.codigoInterno?.message} required>
              <input {...register('codigoInterno')} className={inputCls} placeholder="Ej: UN-001" />
            </FormField>
          </div>
          <FormField label="Tipo de unidad" error={errors.tipoUnidad?.message} required>
            <select {...register('tipoUnidad')} className={selectCls}>
              <option value="">Selecciona un tipo</option>
              {TIPOS_UNIDAD.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Capacidad (m³)" error={errors.capacidadM3?.message} required>
              <input {...register('capacidadM3', { valueAsNumber: true })} type="number" step="0.1" className={inputCls} />
            </FormField>
            <FormField label="Capacidad (kg)" error={errors.capacidadKg?.message} required>
              <input {...register('capacidadKg', { valueAsNumber: true })} type="number" step="1" className={inputCls} />
            </FormField>
          </div>
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
