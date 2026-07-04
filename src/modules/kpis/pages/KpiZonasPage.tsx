import { useState } from 'react'
import { DataTable, type Column } from '@/modules/operacion/components/DataTable'
import { Pagination } from '@/modules/operacion/components/Pagination'
import { BarraProgreso } from '@/modules/kpis/components/BarraProgreso'
import { FiltroFechas } from '@/modules/kpis/components/FiltroFechas'
import { useKpisZonas } from '@/modules/kpis/hooks/useKpisQuery'
import type { KpiZonaDto } from '@/modules/kpis/types/kpisTypes'

function hace30Dias() {
  const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().slice(0, 10)
}
function hoy() { return new Date().toISOString().slice(0, 10) }

export function KpiZonasPage() {
  const [page, setPage] = useState(0)
  const [desde, setDesde] = useState(hace30Dias)
  const [hasta, setHasta] = useState(hoy)

  const { data, isLoading } = useKpisZonas({
    fechaDesde: desde || undefined,
    fechaHasta: hasta || undefined,
    page,
  })

  const columns: Column<KpiZonaDto>[] = [
    {
      header: 'Zona',
      cell: (r) => (
        <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono">
          {r.zonaIdExterno.slice(0, 8)}…
        </code>
      ),
    },
    { header: 'Fecha', cell: (r) => <span className="font-medium">{r.fecha}</span> },
    {
      header: 'Atenciones',
      cell: (r) => (
        <span className="text-sm">
          <span className="font-semibold">{r.vecesAtendida}</span>
          <span className="text-gray-400"> / {r.vecesProgramada}</span>
        </span>
      ),
    },
    {
      header: 'Kg recolectados',
      cell: (r) => <span className="font-semibold">{Number(r.kgRecolectados).toFixed(0)} kg</span>,
    },
    {
      header: 'Cobertura',
      cell: (r) => (
        <div className="w-32">
          <BarraProgreso
            valor={Number(r.coberturaPorcentaje)}
            label={`${Number(r.coberturaPorcentaje).toFixed(1)}%`}
          />
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">KPIs de zonas</h1>
        <p className="text-sm text-gray-500 mt-0.5">Cobertura y volumen recolectado por zona</p>
      </div>

      <div className="mb-4">
        <FiltroFechas fechaDesde={desde} fechaHasta={hasta}
          onChange={(d, h) => { setDesde(d); setHasta(h); setPage(0) }} />
      </div>

      <DataTable columns={columns} data={data?.content ?? []} keyFn={(r) => r.kpiZonaId}
        isLoading={isLoading} emptyMessage="No hay KPIs de zonas para el período seleccionado" />
      {data && (
        <Pagination page={page} totalPages={data.totalPages} totalElements={data.totalElements}
          size={20} onPageChange={setPage} />
      )}
    </div>
  )
}
