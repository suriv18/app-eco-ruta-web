import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable, type Column } from '@/modules/operacion/components/DataTable'
import { Pagination } from '@/modules/operacion/components/Pagination'
import { EstadoAlertaBadge, CriticidadBadge } from '@/modules/alertas/components/EstadoAlertaBadge'
import { useAlertas } from '@/modules/alertas/hooks/useAlertasQuery'
import type { AlertaResponseDto, EstadoAlerta } from '@/modules/alertas/types/alertasTypes'
import { ROUTES } from '@/app/config/routePaths'

const ESTADOS: { value: EstadoAlerta | ''; label: string }[] = [
  { value: '', label: 'Todos los estados' },
  { value: 'REGISTRADA', label: 'Registrada' },
  { value: 'VALIDADA', label: 'Validada' },
  { value: 'EN_ATENCION', label: 'En atención' },
  { value: 'ATENDIDA', label: 'Atendida' },
  { value: 'DESCARTADA', label: 'Descartada' },
  { value: 'DUPLICADA', label: 'Duplicada' },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function AlertasPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoAlerta | ''>('')

  const { data, isLoading } = useAlertas({
    estado: estadoFiltro || undefined,
    page,
    size: 20,
  })

  const columns: Column<AlertaResponseDto>[] = [
    {
      header: 'Alerta',
      cell: (r) => (
        <div className="max-w-xs">
          <p className="font-medium text-gray-900 truncate">{r.titulo}</p>
          {r.descripcion && (
            <p className="text-xs text-gray-500 truncate mt-0.5">{r.descripcion}</p>
          )}
        </div>
      ),
    },
    {
      header: 'Criticidad',
      cell: (r) => <CriticidadBadge nivel={r.nivelCriticidad} />,
    },
    {
      header: 'Estado',
      cell: (r) => <EstadoAlertaBadge estado={r.estado} />,
    },
    {
      header: 'Volumen',
      cell: (r) => r.volumenEstimado,
    },
    {
      header: 'Fuente',
      cell: (r) => <span className="text-xs text-gray-500">{r.fuente}</span>,
    },
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
          className="text-xs px-2.5 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
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
          <h1 className="text-2xl font-bold text-gray-900">Alertas ciudadanas</h1>
          <p className="text-sm text-gray-500 mt-0.5">Reportes de incidentes de residuos</p>
        </div>
        <a href={ROUTES.ALERTAS.CRITICAS}
          className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1">
          ⚠ Ver solo críticas
        </a>
      </div>

      {/* Filtro por estado */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm text-gray-600 font-medium">Filtrar por estado:</span>
        <div className="flex flex-wrap gap-2">
          {ESTADOS.map((e) => (
            <button
              key={e.value}
              onClick={() => { setEstadoFiltro(e.value); setPage(0) }}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                estadoFiltro === e.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.content ?? []}
        keyFn={(r) => r.id}
        isLoading={isLoading}
        emptyMessage={estadoFiltro ? `No hay alertas en estado "${estadoFiltro}"` : 'No hay alertas registradas'}
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
    </div>
  )
}
