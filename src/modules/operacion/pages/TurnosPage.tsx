import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DataTable, type Column } from '@/modules/operacion/components/DataTable'
import { Pagination } from '@/modules/operacion/components/Pagination'
import { Modal } from '@/modules/operacion/components/Modal'
import { EstadoBadge } from '@/modules/operacion/components/EstadoBadge'
import { FormField, inputCls, selectCls } from '@/modules/operacion/components/FormField'
import { turnoSchema, type TurnoFormData } from '@/modules/operacion/schemas/operacionSchemas'
import { useTurnos, useCrearTurno, useAccionTurno, useUnidades, useChoferes, useDistritos } from '@/modules/operacion/hooks/useOperacionQuery'
import type { TurnoResponseDto } from '@/modules/operacion/types/operacionTypes'
import { PermissionGuard } from '@/modules/auth/components/PermissionGuard'
import { extractApiError } from '@/shared/api/apiError'

const TIPOS_TURNO = ['MANANA', 'TARDE', 'NOCHE'] as const

export function TurnosPage() {
  const [page, setPage] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading } = useTurnos(page)
  const { data: unidades } = useUnidades(0, 100)
  const { data: choferes } = useChoferes(0, 100)
  const { data: distritos } = useDistritos(0, 100)
  const crear = useCrearTurno()
  const accion = useAccionTurno()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TurnoFormData>({
    resolver: zodResolver(turnoSchema),
  })

  const onSubmit = (values: TurnoFormData) => {
    crear.mutate(values, { onSuccess: () => { reset(); setIsOpen(false) } })
  }

  const columns: Column<TurnoResponseDto>[] = [
    {
      header: 'Fecha',
      cell: (r) => (
        <div>
          <p className="font-medium">{r.fecha}</p>
          <p className="text-xs text-gray-500">{r.tipoTurno}</p>
        </div>
      ),
    },
    {
      header: 'Horario',
      cell: (r) => (
        <span className="text-sm text-gray-600">{r.horaInicio} — {r.horaFin}</span>
      ),
    },
    { header: 'Estado', cell: (r) => <EstadoBadge estado={r.estado} /> },
    {
      header: 'Acciones',
      className: 'text-right',
      cell: (r) => (
        <PermissionGuard roles={['ADMIN', 'SUPERVISOR']}>
          <div className="flex justify-end gap-1.5">
            {r.estado === 'PROGRAMADO' && (
              <button onClick={() => accion.mutate({ id: r.id, accion: 'iniciar' })}
                disabled={accion.isPending}
                className="text-xs px-2.5 py-1 rounded-lg border border-green-200 text-green-600 hover:bg-green-50 disabled:opacity-50">
                Iniciar
              </button>
            )}
            {r.estado === 'EN_CURSO' && (
              <button onClick={() => accion.mutate({ id: r.id, accion: 'finalizar' })}
                disabled={accion.isPending}
                className="text-xs px-2.5 py-1 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-50">
                Finalizar
              </button>
            )}
            {(r.estado === 'PROGRAMADO' || r.estado === 'EN_CURSO') && (
              <button onClick={() => accion.mutate({ id: r.id, accion: 'cancelar' })}
                disabled={accion.isPending}
                className="text-xs px-2.5 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50">
                Cancelar
              </button>
            )}
          </div>
        </PermissionGuard>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Turnos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Turnos de trabajo del personal operativo</p>
        </div>
        <PermissionGuard roles={['ADMIN', 'SUPERVISOR']}>
          <button onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            + Nuevo turno
          </button>
        </PermissionGuard>
      </div>

      <DataTable columns={columns} data={data?.content ?? []} keyFn={(r) => r.id}
        isLoading={isLoading} emptyMessage="No hay turnos registrados" />
      {data && (
        <Pagination page={page} totalPages={data.totalPages} totalElements={data.totalElements}
          size={20} onPageChange={setPage} />
      )}

      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); reset() }} title="Nuevo turno" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Unidad" error={errors.unidadId?.message} required>
              <select {...register('unidadId')} className={selectCls}>
                <option value="">Selecciona una unidad</option>
                {unidades?.content.map((u) => (
                  <option key={u.id} value={u.id}>{u.placa} — {u.codigoInterno}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Chofer" error={errors.choferId?.message} required>
              <select {...register('choferId')} className={selectCls}>
                <option value="">Selecciona un chofer</option>
                {choferes?.content.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombres} {c.apellidos}</option>
                ))}
              </select>
            </FormField>
          </div>
          <FormField label="Distrito" error={errors.distritoId?.message} required>
            <select {...register('distritoId')} className={selectCls}>
              <option value="">Selecciona un distrito</option>
              {distritos?.content.map((d) => <option key={d.id} value={d.id}>{d.nombre}</option>)}
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Fecha" error={errors.fecha?.message} required>
              <input {...register('fecha')} type="date" className={inputCls} />
            </FormField>
            <FormField label="Tipo de turno" error={errors.tipoTurno?.message} required>
              <select {...register('tipoTurno')} className={selectCls}>
                <option value="">Selecciona un tipo</option>
                {TIPOS_TURNO.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Hora inicio (HH:mm)" error={errors.horaInicio?.message} required>
              <input {...register('horaInicio')} className={inputCls} placeholder="06:00" />
            </FormField>
            <FormField label="Hora fin (HH:mm)" error={errors.horaFin?.message} required>
              <input {...register('horaFin')} className={inputCls} placeholder="14:00" />
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
