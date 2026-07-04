import { useState } from 'react'
import { DataTable, type Column } from '@/modules/operacion/components/DataTable'
import { Pagination } from '@/modules/operacion/components/Pagination'
import { FiltroFechas } from '@/modules/kpis/components/FiltroFechas'
import { useKpisAlertas } from '@/modules/kpis/hooks/useKpisQuery'
import type { KpiAlertaDto } from '@/modules/kpis/types/kpisTypes'

function hace30Dias() {
  const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().slice(0, 10)
}
function hoy() { return new Date().toISOString().slice(0, 10) }

function fmtDatetime(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-PE', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  })
}

function TiempoBadge({ min }: { min: number | null }) {
  if (min === null) return <span className="text-gray-400 text-xs">Pendiente</span>
  const m = Number(min)
  const cls = m <= 30 ? 'text-green-700 bg-green-50' : m <= 60 ? 'text-yellow-700 bg-yellow-50' : 'text-red-700 bg-red-50'
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${cls}`}>
      {m.toFixed(0)} min
    </span>
  )
}

export function KpiAlertasPage() {
  const [page, setPage] = useState(0)
  const [desde, setDesde] = useState(hace30Dias)
  const [hasta, setHasta] = useState(hoy)

  const { data, isLoading } = useKpisAlertas({
    fechaDesde: desde || undefined,
    fechaHasta: hasta || undefined,
    page,
  })

  const columns: Column<KpiAlertaDto>[] = [
    {
      header: 'Alerta',
      cell: (r) => (
        <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono">
          {r.alertaIdExterno.slice(0, 8)}…
        </code>
      ),
    },
    {
      header: 'Registrada',
      cell: (r) => <span className="text-xs text-gray-600">{fmtDatetime(r.registradaEn)}</span>,
    },
    {
      header: 'Atendida',
      cell: (r) => <span className="text-xs text-gray-600">{fmtDatetime(r.atendidaEn)}</span>,
    },
    {
      header: 'Tiempo respuesta',
      cell: (r) => <TiempoBadge min={r.tiempoRespuestaMin} />,
    },
    {
      header: 'Crítica',
      cell: (r) => r.fueCritica
        ? <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-medium">Sí</span>
        : <span className="text-xs text-gray-400">No</span>,
    },
    {
      header: 'En ruta',
      cell: (r) => r.incluidaEnRuta
        ? <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">Sí</span>
        : <span className="text-xs text-gray-400">No</span>,
    },
  ]

  // Métricas rápidas del resultado
  const total = data?.content.length ?? 0
  const criticas = data?.content.filter((r) => r.fueCritica).length ?? 0
  const conTiempo = data?.content.filter((r) => r.tiempoRespuestaMin !== null) ?? []
  const promedioResp = conTiempo.length > 0
    ? conTiempo.reduce((s, r) => s + Number(r.tiempoRespuestaMin), 0) / conTiempo.length
    : null

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">KPIs de alertas</h1>
        <p className="text-sm text-gray-500 mt-0.5">Tiempo de respuesta y atención de alertas ciudadanas</p>
      </div>

      <div className="mb-4">
        <FiltroFechas fechaDesde={desde} fechaHasta={hasta}
          onChange={(d, h) => { setDesde(d); setHasta(h); setPage(0) }} />
      </div>

      {/* Mini métricas de la página */}
      {total > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-gray-900">{data?.totalElements ?? 0}</p>
            <p className="text-xs text-gray-500 mt-0.5">Alertas en período</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-red-600">{criticas}</p>
            <p className="text-xs text-gray-500 mt-0.5">Críticas (pág. actual)</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-gray-900">
              {promedioResp !== null ? `${promedioResp.toFixed(0)} min` : '—'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Tiempo resp. promedio</p>
          </div>
        </div>
      )}

      <DataTable columns={columns} data={data?.content ?? []} keyFn={(r) => r.kpiAlertaId}
        isLoading={isLoading} emptyMessage="No hay KPIs de alertas para el período seleccionado" />
      {data && (
        <Pagination page={page} totalPages={data.totalPages} totalElements={data.totalElements}
          size={20} onPageChange={setPage} />
      )}
    </div>
  )
}
