import { useState } from 'react'
import { DataTable, type Column } from '@/modules/operacion/components/DataTable'
import { Pagination } from '@/modules/operacion/components/Pagination'
import { FiltroFechas } from '@/modules/kpis/components/FiltroFechas'
import { useKpisUnidades } from '@/modules/kpis/hooks/useKpisQuery'
import type { KpiUnidadDto } from '@/modules/kpis/types/kpisTypes'

function hace30Dias() {
  const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().slice(0, 10)
}
function hoy() { return new Date().toISOString().slice(0, 10) }

export function KpiUnidadesPage() {
  const [page, setPage] = useState(0)
  const [desde, setDesde] = useState(hace30Dias)
  const [hasta, setHasta] = useState(hoy)

  const { data, isLoading } = useKpisUnidades({
    fechaDesde: desde || undefined,
    fechaHasta: hasta || undefined,
    page,
  })

  const columns: Column<KpiUnidadDto>[] = [
    {
      header: 'Unidad',
      cell: (r) => (
        <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono">
          {r.unidadIdExterno.slice(0, 8)}…
        </code>
      ),
    },
    { header: 'Fecha', cell: (r) => <span className="font-medium">{r.fecha}</span> },
    {
      header: 'Km recorridos',
      cell: (r) => <span className="font-semibold">{Number(r.kmRecorridos).toFixed(1)} km</span>,
    },
    {
      header: 'Horas operación',
      cell: (r) => <span>{Number(r.horasOperacion).toFixed(1)} h</span>,
    },
    {
      header: 'Toneladas',
      cell: (r) => <span className="font-semibold">{Number(r.toneladasRecolectadas).toFixed(2)} t</span>,
    },
    {
      header: 'Consumo est.',
      cell: (r) => (
        <span className="text-gray-600">{Number(r.consumoEstimadoLitros).toFixed(1)} L</span>
      ),
    },
    {
      header: 'Eficiencia',
      cell: (r) => {
        const efic = r.toneladasRecolectadas > 0
          ? Number(r.toneladasRecolectadas) / Number(r.horasOperacion)
          : 0
        return <span className="text-sm font-mono">{efic.toFixed(2)} t/h</span>
      },
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">KPIs de unidades</h1>
        <p className="text-sm text-gray-500 mt-0.5">Rendimiento operativo por vehículo recolector</p>
      </div>

      <div className="mb-4">
        <FiltroFechas fechaDesde={desde} fechaHasta={hasta}
          onChange={(d, h) => { setDesde(d); setHasta(h); setPage(0) }} />
      </div>

      <DataTable columns={columns} data={data?.content ?? []} keyFn={(r) => r.kpiUnidadId}
        isLoading={isLoading} emptyMessage="No hay KPIs de unidades para el período seleccionado" />
      {data && (
        <Pagination page={page} totalPages={data.totalPages} totalElements={data.totalElements}
          size={20} onPageChange={setPage} />
      )}
    </div>
  )
}
