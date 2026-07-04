import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DataTable, type Column } from '@/modules/operacion/components/DataTable'
import { Pagination } from '@/modules/operacion/components/Pagination'
import { Modal } from '@/modules/operacion/components/Modal'
import { EstadoBadge } from '@/modules/operacion/components/EstadoBadge'
import { FormField, inputCls, selectCls } from '@/modules/operacion/components/FormField'
import { contenedorSchema, type ContenedorFormData } from '@/modules/operacion/schemas/operacionSchemas'
import { useContenedores, useCrearContenedor, useCambiarEstadoContenedor, useZonas } from '@/modules/operacion/hooks/useOperacionQuery'
import type { ContenedorResponseDto, EstadoContenedor } from '@/modules/operacion/types/operacionTypes'
import { PermissionGuard } from '@/modules/auth/components/PermissionGuard'
import { extractApiError } from '@/shared/api/apiError'

const ESTADOS: EstadoContenedor[] = ['VACIO', 'PARCIAL', 'LLENO', 'DESBORDADO']

export function ContenedoresPage() {
  const [page, setPage] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading } = useContenedores(page)
  const { data: zonas } = useZonas(0, 100)
  const crear = useCrearContenedor()
  const cambiarEstado = useCambiarEstadoContenedor()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContenedorFormData>({
    resolver: zodResolver(contenedorSchema),
  })

  const onSubmit = (values: ContenedorFormData) => {
    crear.mutate(values, { onSuccess: () => { reset(); setIsOpen(false) } })
  }

  const columns: Column<ContenedorResponseDto>[] = [
    { header: 'Código', cell: (r) => <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{r.codigo}</code> },
    { header: 'Capacidad', cell: (r) => `${r.capacidadM3} m³` },
    { header: 'Estado', cell: (r) => <EstadoBadge estado={r.estadoContenedor} /> },
    {
      header: 'Cambiar estado',
      cell: (r) => (
        <PermissionGuard roles={['ADMIN', 'SUPERVISOR', 'OPERADOR']}>
          <select
            value={r.estadoContenedor}
            onChange={(e) => cambiarEstado.mutate({ id: r.id, nuevoEstado: e.target.value as EstadoContenedor })}
            className="text-xs border border-gray-200 rounded px-2 py-1"
          >
            {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </PermissionGuard>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contenedores</h1>
          <p className="text-sm text-gray-500 mt-0.5">Puntos de recolección por zona</p>
        </div>
        <PermissionGuard roles={['ADMIN', 'SUPERVISOR']}>
          <button onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            + Nuevo contenedor
          </button>
        </PermissionGuard>
      </div>

      <DataTable columns={columns} data={data?.content ?? []} keyFn={(r) => r.id}
        isLoading={isLoading} emptyMessage="No hay contenedores registrados" />
      {data && (
        <Pagination page={page} totalPages={data.totalPages} totalElements={data.totalElements}
          size={20} onPageChange={setPage} />
      )}

      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); reset() }} title="Nuevo contenedor">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Zona" error={errors.zonaId?.message} required>
            <select {...register('zonaId')} className={selectCls}>
              <option value="">Selecciona una zona</option>
              {zonas?.content.map((z) => <option key={z.id} value={z.id}>{z.nombre}</option>)}
            </select>
          </FormField>
          <FormField label="Código" error={errors.codigo?.message} required>
            <input {...register('codigo')} className={inputCls} placeholder="Ej: CONT-001" />
          </FormField>
          <FormField label="Capacidad (m³)" error={errors.capacidadM3?.message} required>
            <input {...register('capacidadM3', { valueAsNumber: true })} type="number" step="0.1" className={inputCls} />
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
