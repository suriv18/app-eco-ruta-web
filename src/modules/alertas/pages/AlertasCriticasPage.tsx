import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable, type Column } from '@/modules/operacion/components/DataTable'
import { Pagination } from '@/modules/operacion/components/Pagination'
import { EstadoAlertaBadge } from '@/modules/alertas/components/EstadoAlertaBadge'
import { useAlertasCriticas } from '@/modules/alertas/hooks/useAlertasQuery'
import type { AlertaResponseDto } from '@/modules/alertas/types/alertasTypes'
import { ROUTES } from '@/app/config/routePaths'

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function AlertasCriticasPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)

  const { data, isLoading } = useAlertasCriticas({ page, size: 20 })

  const columns: Column<AlertaResponseDto>[] = [
    {
      header: 'Alerta',
      cell: (r) => (
        <div className="max-w-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-red-500 text-sm">⚠</span>
            <p className="font-semibold text-gray-900 truncate">{r.titulo}</p>
          </div>
          {r.descripcion && (
            <p className="text-xs text-gray-500 truncate mt-0.5 ml-5">{r.descripcion}</p>
          )}
        </div>
      ),
    },
    { header: 'Estado', cell: (r) => <EstadoAlertaBadge estado={r.estado} /> },
    { header: 'Volumen', cell: (r) => r.volumenEstimado },
    { header: 'Fuente', cell: (r) => <span className="text-xs text-gray-500">{r.fuente}</span> },
    {
      header: 'Registrada',
      cell: (r) => <span className="text-xs text-gray-500">{formatDate(r.registradaEn)}</span>,
    },
    {
      header: '',
      className: 'text-right',
      cell: (r) => (
        <button
          onClick={() => navigate(ROUTES.ALERTAS.DETALLE(r.id))}
          className="text-xs px-2.5 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          Ver detalle
        </button>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Alertas críticas</h1>
            {data && (
              <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                {data.totalElements}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">Incidentes con nivel de criticidad alto</p>
        </div>
        <a href={ROUTES.ALERTAS.LIST}
          className="text-sm text-gray-600 hover:text-gray-800">
          Ver todas las alertas →
        </a>
      </div>

      {data && data.totalElements === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <p className="text-green-700 font-medium">No hay alertas críticas en este momento</p>
          <p className="text-green-600 text-sm mt-1">¡Todo bajo control!</p>
        </div>
      ) : (
        <>
          <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden">
            <DataTable
              columns={columns}
              data={data?.content ?? []}
              keyFn={(r) => r.id}
              isLoading={isLoading}
              emptyMessage="No hay alertas críticas"
            />
          </div>
          {data && (
            <Pagination
              page={page}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              size={20}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  )
}
