import { useState } from 'react'
import { DataTable, type Column } from '@/modules/operacion/components/DataTable'
import { Pagination } from '@/modules/operacion/components/Pagination'
import { BarraProgreso } from '@/modules/kpis/components/BarraProgreso'
import { FiltroFechas } from '@/modules/kpis/components/FiltroFechas'
import { useKpisRutas } from '@/modules/kpis/hooks/useKpisQuery'
import type { KpiRutaDto } from '@/modules/kpis/types/kpisTypes'

function hace30Dias() {
  const d = new Date()
  d.setDate(d.getDate() - 30)
  return d.toISOString().slice(0, 10)
}
function hoy() { return new Date().toISOString().slice(0, 10) }

function fmtDist(m: number) { return `${(m / 1000).toFixed(1)} km` }
function fmtMin(s: number)  { return `${Math.round(s / 60)} min` }
function fmtPct(v: number)  { return `${Number(v).toFixed(1)}%` }

export function KpiRutasPage() {
  const [page, setPage] = useState(0)
  const [desde, setDesde] = useState(hace30Dias)
  const [hasta, setHasta] = useState(hoy)

  const { data, isLoading } = useKpisRutas({
    fechaDesde: desde || undefined,
    fechaHasta: hasta || undefined,
    page,
  })

  const columns: Column<KpiRutaDto>[] = [
    {
      header: 'Fecha',
      cell: (r) => <span className="font-medium text-gray-800">{r.fecha}</span>,
    },
    {
      header: 'Distancia',
      cell: (r) => (
        <div className="text-sm">
          <span className="font-semibold">{fmtDist(r.distanciaRealM)}</span>
          <span className="text-gray-400 text-xs ml-1">/ {fmtDist(r.distanciaPlanificadaM)}</span>
        </div>
      ),
    },
    {
      header: 'Duración',
      cell: (r) => (
        <div className="text-sm">
          <span className="font-semibold">{fmtMin(r.duracionRealS)}</span>
          <span className="text-gray-400 text-xs ml-1">/ {fmtMin(r.duracionPlanificadaS)}</span>
        </div>
      ),
    },
    {
      header: 'Zonas',
      cell: (r) => (
        <span className="text-sm">
          {r.zonasAtendidas} <span className="text-gray-400">/ {r.zonasProgramadas}</span>
        </span>
      ),
    },
    {
      header: 'Cumplimiento',
      cell: (r) => (
        <div className="w-32">
          <BarraProgreso valor={Number(r.cumplimientoPorcentaje)} label={fmtPct(r.cumplimientoPorcentaje)} />
        </div>
      ),
    },
    {
      header: 'km / t',
      cell: (r) => <span className="text-sm font-mono">{Number(r.kmPorTonelada).toFixed(2)}</span>,
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">KPIs de rutas</h1>
        <p className="text-sm text-gray-500 mt-0.5">Eficiencia y cumplimiento por ruta ejecutada</p>
      </div>

      <div className="mb-4">
        <FiltroFechas fechaDesde={desde} fechaHasta={hasta}
          onChange={(d, h) => { setDesde(d); setHasta(h); setPage(0) }} />
      </div>

      <DataTable columns={columns} data={data?.content ?? []} keyFn={(r) => r.kpiRutaId}
        isLoading={isLoading} emptyMessage="No hay KPIs de rutas para el período seleccionado" />
      {data && (
        <Pagination page={page} totalPages={data.totalPages} totalElements={data.totalElements}
          size={20} onPageChange={setPage} />
      )}
    </div>
  )
}
