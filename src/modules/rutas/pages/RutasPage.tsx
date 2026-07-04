import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable, type Column } from '@/modules/operacion/components/DataTable'
import { Pagination } from '@/modules/operacion/components/Pagination'
import { EstadoRutaBadge } from '@/modules/rutas/components/EstadoRutaBadge'
import { CrearRutaModal } from '@/modules/rutas/components/CrearRutaModal'
import { useRutas } from '@/modules/rutas/hooks/useRutasQuery'
import { PermissionGuard } from '@/modules/auth/components/PermissionGuard'
import { ROUTES } from '@/app/config/routePaths'
import type { RutaResponseDto, EstadoRuta } from '@/modules/rutas/types/rutasTypes'

const ESTADOS: { value: EstadoRuta | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'BORRADOR', label: 'Borrador' },
  { value: 'APROBADA', label: 'Aprobada' },
  { value: 'EN_EJECUCION', label: 'En ejecución' },
  { value: 'FINALIZADA', label: 'Finalizada' },
  { value: 'CANCELADA', label: 'Cancelada' },
]

function formatMetricas(m: RutaResponseDto['metricas']) {
  const km = (m.distanciaM / 1000).toFixed(1)
  const min = Math.round(m.duracionS / 60)
  return `${km} km · ${min} min`
}

export function RutasPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoRuta | ''>('')
  const [isCrearOpen, setIsCrearOpen] = useState(false)

  const { data, isLoading } = useRutas({ estado: estadoFiltro || undefined, page, size: 20 })

  const columns: Column<RutaResponseDto>[] = [
    {
      header: 'Fecha / Tipo',
      cell: (r) => (
        <div>
          <p className="font-semibold text-gray-900">{r.fecha}</p>
          <p className="text-xs text-gray-400 mt-0.5">{r.tipoRuta}</p>
        </div>
      ),
    },
    { header: 'Estado', cell: (r) => <EstadoRutaBadge estado={r.estado} /> },
    {
      header: 'Métricas',
      cell: (r) => (
        <span className="text-xs text-gray-600 font-mono">{formatMetricas(r.metricas)}</span>
      ),
    },
    {
      header: 'Paradas',
      cell: (r) => (
        <span className="text-sm text-gray-700">
          {r.versionActual ? r.versionActual.paradas.length : '—'}
        </span>
      ),
    },
    {
      header: 'Carga (kg)',
      cell: (r) => (
        <span className="text-sm font-mono text-gray-700">
          {r.metricas.cargaKg.toFixed(0)}
        </span>
      ),
    },
    {
      header: '',
      className: 'text-right',
      cell: (r) => (
        <button
          onClick={() => navigate(ROUTES.RUTAS.DETALLE(r.id))}
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
          <h1 className="text-2xl font-bold text-gray-900">Rutas</h1>
          <p className="text-sm text-gray-500 mt-0.5">Planificación y seguimiento de rutas de recolección</p>
        </div>
        <PermissionGuard roles={['ADMIN', 'SUPERVISOR']}>
          <button
            onClick={() => setIsCrearOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nueva ruta
          </button>
        </PermissionGuard>
      </div>

      {/* Filtro de estado */}
      <div className="mb-4 flex items-center gap-2 flex-wrap">
        {ESTADOS.map((e) => (
          <button
            key={e.value}
            onClick={() => { setEstadoFiltro(e.value); setPage(0) }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              estadoFiltro === e.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 text-gray-600 hover:border-blue-400'
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={data?.content ?? []}
        keyFn={(r) => r.id}
        isLoading={isLoading}
        emptyMessage="No hay rutas registradas"
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

      <CrearRutaModal isOpen={isCrearOpen} onClose={() => setIsCrearOpen(false)} />
    </div>
  )
}
