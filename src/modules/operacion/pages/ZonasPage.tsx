import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DataTable, type Column } from '@/modules/operacion/components/DataTable'
import { Pagination } from '@/modules/operacion/components/Pagination'
import { Modal } from '@/modules/operacion/components/Modal'
import { EstadoBadge } from '@/modules/operacion/components/EstadoBadge'
import { FormField, inputCls, selectCls } from '@/modules/operacion/components/FormField'
import { zonaSchema, type ZonaFormData } from '@/modules/operacion/schemas/operacionSchemas'
import { useZonas, useCrearZona, useDesactivarZona, useDistritos } from '@/modules/operacion/hooks/useOperacionQuery'
import type { ZonaResponseDto } from '@/modules/operacion/types/operacionTypes'
import { PermissionGuard } from '@/modules/auth/components/PermissionGuard'
import { extractApiError } from '@/shared/api/apiError'

const TIPOS_ZONA = ['RESIDENCIAL', 'COMERCIAL', 'MIXTA', 'MERCADO', 'INDUSTRIAL', 'OTRA'] as const

export function ZonasPage() {
  const [page, setPage] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading } = useZonas(page)
  const { data: distritos } = useDistritos(0, 100)
  const crear = useCrearZona()
  const desactivar = useDesactivarZona()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ZonaFormData>({
    resolver: zodResolver(zonaSchema),
    defaultValues: { prioridad: 3 },
  })

  const onSubmit = (values: ZonaFormData) => {
    crear.mutate(values, { onSuccess: () => { reset(); setIsOpen(false) } })
  }

  const columns: Column<ZonaResponseDto>[] = [
    { header: 'Código', cell: (r) => <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{r.codigo}</code> },
    { header: 'Nombre', cell: (r) => <span className="font-medium">{r.nombre}</span> },
    { header: 'Tipo', cell: (r) => r.tipoZona },
    { header: 'Prioridad', cell: (r) => <span className="font-semibold">{r.prioridad}</span> },
    { header: 'Estado', cell: (r) => <EstadoBadge estado={r.estado} /> },
    {
      header: 'Acciones',
      className: 'text-right',
      cell: (r) => (
        <PermissionGuard roles={['ADMIN']}>
          {r.estado === 'ACTIVO' && (
            <button
              onClick={() => desactivar.mutate(r.id)}
              disabled={desactivar.isPending}
              className="text-xs px-2.5 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Desactivar
            </button>
          )}
        </PermissionGuard>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Zonas</h1>
          <p className="text-sm text-gray-500 mt-0.5">Zonas de recolección por distrito</p>
        </div>
        <PermissionGuard roles={['ADMIN', 'SUPERVISOR']}>
          <button onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            + Nueva zona
          </button>
        </PermissionGuard>
      </div>

      <DataTable columns={columns} data={data?.content ?? []} keyFn={(r) => r.id}
        isLoading={isLoading} emptyMessage="No hay zonas registradas" />
      {data && (
        <Pagination page={page} totalPages={data.totalPages} totalElements={data.totalElements}
          size={20} onPageChange={setPage} />
      )}

      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); reset() }} title="Nueva zona" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Distrito" error={errors.distritoId?.message} required>
            <select {...register('distritoId')} className={selectCls}>
              <option value="">Selecciona un distrito</option>
              {distritos?.content.map((d) => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Código" error={errors.codigo?.message} required>
              <input {...register('codigo')} className={inputCls} placeholder="Ej: ZONA-001" style={{ textTransform: 'uppercase' }} />
            </FormField>
            <FormField label="Prioridad (1-5)" error={errors.prioridad?.message} required>
              <input {...register('prioridad', { valueAsNumber: true })} type="number" min={1} max={5} className={inputCls} />
            </FormField>
          </div>
          <FormField label="Nombre" error={errors.nombre?.message} required>
            <input {...register('nombre')} className={inputCls} placeholder="Ej: Zona Residencial Norte" />
          </FormField>
          <FormField label="Tipo de zona" error={errors.tipoZona?.message} required>
            <select {...register('tipoZona')} className={selectCls}>
              <option value="">Selecciona un tipo</option>
              {TIPOS_ZONA.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
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
