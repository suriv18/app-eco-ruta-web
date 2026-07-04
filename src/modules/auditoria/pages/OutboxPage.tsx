import { useState } from 'react'
import { DataTable, type Column } from '@/modules/operacion/components/DataTable'
import { Pagination } from '@/modules/operacion/components/Pagination'
import { useOutboxEventos } from '@/modules/auditoria/hooks/useAuditoriaQuery'
import type { OutboxEventDto } from '@/modules/auditoria/types/auditoriaTypes'
import { inputCls, selectCls } from '@/modules/operacion/components/FormField'

const ESTADOS_OUTBOX = ['', 'PENDIENTE', 'PUBLICADO', 'ERROR']

function EstadoBadge({ estado }: { estado: OutboxEventDto['estado'] }) {
  const cls: Record<OutboxEventDto['estado'], string> = {
    PENDIENTE: 'bg-yellow-100 text-yellow-700',
    PUBLICADO: 'bg-green-100 text-green-700',
    ERROR:     'bg-red-100 text-red-700',
  }
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${cls[estado]}`}>
      {estado}
    </span>
  )
}

function PayloadModal({ evento, onClose }: { evento: OutboxEventDto; onClose: () => void }) {
  const fmt = (json: string) => {
    try { return JSON.stringify(JSON.parse(json), null, 2) } catch { return json }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-[640px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h2 className="font-semibold text-gray-900">Payload del evento</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {evento.aggregateType} · {evento.eventType}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>
        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-400 block mb-0.5">Outbox ID</span>
              <code className="font-mono text-gray-700 break-all">{evento.outboxId}</code>
            </div>
            <div>
              <span className="text-gray-400 block mb-0.5">Aggregate ID</span>
              <code className="font-mono text-gray-700 break-all">{evento.aggregateId}</code>
            </div>
            <div>
              <span className="text-gray-400 block mb-0.5">Estado</span>
              <EstadoBadge estado={evento.estado} />
            </div>
            <div>
              <span className="text-gray-400 block mb-0.5">Creado</span>
              <span className="text-gray-700">{new Date(evento.creadoEn).toLocaleString('es-PE')}</span>
            </div>
            {evento.publicadoEn && (
              <div>
                <span className="text-gray-400 block mb-0.5">Publicado</span>
                <span className="text-gray-700">{new Date(evento.publicadoEn).toLocaleString('es-PE')}</span>
              </div>
            )}
          </div>

          {evento.errorMensaje && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-red-600 mb-1">Error</p>
              <p className="text-xs text-red-700 font-mono break-all">{evento.errorMensaje}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">Payload</p>
            <pre className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-auto max-h-56 whitespace-pre-wrap break-all">
              {fmt(evento.payload)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export function OutboxPage() {
  const [page, setPage]         = useState(0)
  const [estado, setEstado]     = useState('')
  const [eventType, setEvType]  = useState('')
  const [selected, setSelected] = useState<OutboxEventDto | null>(null)

  const params = {
    estado:    estado    || undefined,
    eventType: eventType || undefined,
    page,
  }
  const { data, isLoading } = useOutboxEventos(params)

  // Conteo por estado de la página actual
  const porEstado = (data?.content ?? []).reduce<Record<string, number>>((acc, ev) => {
    acc[ev.estado] = (acc[ev.estado] ?? 0) + 1
    return acc
  }, {})

  const columns: Column<OutboxEventDto>[] = [
    {
      header: 'Fecha',
      cell: (r) => (
        <span className="text-xs text-gray-600 whitespace-nowrap">
          {new Date(r.creadoEn).toLocaleString('es-PE', {
            day: '2-digit', month: '2-digit', year: '2-digit',
            hour: '2-digit', minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      header: 'Aggregate',
      cell: (r) => (
        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-mono">
          {r.aggregateType}
        </span>
      ),
    },
    {
      header: 'Tipo de evento',
      cell: (r) => <span className="text-sm font-medium text-gray-800">{r.eventType}</span>,
    },
    { header: 'Estado', cell: (r) => <EstadoBadge estado={r.estado} /> },
    {
      header: 'Publicado',
      cell: (r) => r.publicadoEn
        ? <span className="text-xs text-gray-500">{new Date(r.publicadoEn).toLocaleString('es-PE', { hour: '2-digit', minute: '2-digit' })}</span>
        : <span className="text-gray-400 text-xs">—</span>,
    },
    {
      header: 'Error',
      cell: (r) => r.errorMensaje
        ? <span className="text-xs text-red-600 truncate max-w-[160px] block" title={r.errorMensaje}>{r.errorMensaje}</span>
        : <span className="text-gray-400 text-xs">—</span>,
    },
    {
      header: '',
      cell: (r) => (
        <button onClick={() => setSelected(r)} className="text-xs text-blue-600 hover:underline">
          Ver payload
        </button>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Outbox de eventos</h1>
        <p className="text-sm text-gray-500 mt-0.5">Estado de publicación de eventos de dominio</p>
      </div>

      {/* Mini métricas */}
      {data && data.totalElements > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          {(['PENDIENTE', 'PUBLICADO', 'ERROR'] as const).map((e) => (
            <div key={e} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <p className={`text-xl font-bold ${e === 'ERROR' ? 'text-red-600' : e === 'PENDIENTE' ? 'text-yellow-600' : 'text-green-600'}`}>
                {porEstado[e] ?? 0}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{e} (pág. actual)</p>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Estado</label>
          <select value={estado} onChange={(e) => { setEstado(e.target.value); setPage(0) }}
            className={`${selectCls} w-36`}>
            {ESTADOS_OUTBOX.map((s) => <option key={s} value={s}>{s || 'Todos'}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Tipo de evento</label>
          <input value={eventType} onChange={(e) => { setEvType(e.target.value); setPage(0) }}
            placeholder="Ej: RutaCreada" className={`${inputCls} w-44`} />
        </div>
        <button onClick={() => { setEstado(''); setEvType(''); setPage(0) }}
          className="text-xs text-gray-500 hover:text-gray-700 underline self-end pb-2">
          Limpiar
        </button>
      </div>

      <DataTable
        columns={columns}
        data={data?.content ?? []}
        keyFn={(r) => r.outboxId}
        isLoading={isLoading}
        emptyMessage="No hay eventos en el outbox para los filtros seleccionados"
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

      {selected && <PayloadModal evento={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
