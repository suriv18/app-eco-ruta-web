import { useState } from 'react'
import { DataTable, type Column } from '@/modules/operacion/components/DataTable'
import { Pagination } from '@/modules/operacion/components/Pagination'
import { useEventosAuditoria } from '@/modules/auditoria/hooks/useAuditoriaQuery'
import type { EventoAuditoriaDto } from '@/modules/auditoria/types/auditoriaTypes'
import { inputCls, selectCls } from '@/modules/operacion/components/FormField'

const MODULOS = ['', 'RUTAS', 'OPERACION', 'ALERTAS', 'KPIS', 'AUTH', 'TELEMETRIA', 'AUDITORIA']
const ACCIONES = ['', 'CREATE', 'UPDATE', 'DELETE', 'CAMBIO_ESTADO']

function hace7Dias() {
  const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().slice(0, 10)
}
function hoy() { return new Date().toISOString().slice(0, 10) }

function AccionBadge({ accion }: { accion: string }) {
  const cls: Record<string, string> = {
    CREATE: 'bg-green-100 text-green-700',
    UPDATE: 'bg-blue-100 text-blue-700',
    DELETE: 'bg-red-100 text-red-700',
    CAMBIO_ESTADO: 'bg-yellow-100 text-yellow-700',
  }
  return (
    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${cls[accion] ?? 'bg-gray-100 text-gray-600'}`}>
      {accion}
    </span>
  )
}

function DiffModal({ evento, onClose }: { evento: EventoAuditoriaDto; onClose: () => void }) {
  const fmt = (json: string | null) => {
    if (!json) return null
    try { return JSON.stringify(JSON.parse(json), null, 2) } catch { return json }
  }
  const antes    = fmt(evento.datosAntes)
  const despues  = fmt(evento.datosDespues)
  const sinCambios = !antes && !despues

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-[760px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h2 className="font-semibold text-gray-900">Detalle del evento</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {evento.modulo} / {evento.entidad} / <AccionBadge accion={evento.accion} />
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>
        <div className="overflow-y-auto p-5 space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-400 block mb-0.5">Evento ID</span>
              <code className="font-mono text-gray-700 break-all">{evento.eventoId}</code>
            </div>
            <div>
              <span className="text-gray-400 block mb-0.5">Usuario ID</span>
              <code className="font-mono text-gray-700 break-all">{evento.usuarioId ?? '—'}</code>
            </div>
            <div>
              <span className="text-gray-400 block mb-0.5">Entidad ID</span>
              <code className="font-mono text-gray-700 break-all">{evento.entidadId ?? '—'}</code>
            </div>
            <div>
              <span className="text-gray-400 block mb-0.5">Fecha</span>
              <span className="text-gray-700">{new Date(evento.creadoEn).toLocaleString('es-PE')}</span>
            </div>
          </div>

          {sinCambios && (
            <p className="text-sm text-gray-400 italic">Sin datos de cambio registrados.</p>
          )}

          {(antes || despues) && (
            <div className={`grid gap-3 ${antes && despues ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {antes && (
                <div>
                  <p className="text-xs font-semibold text-red-600 mb-1">Antes</p>
                  <pre className="text-xs bg-red-50 border border-red-100 rounded-lg p-3 overflow-auto max-h-48 whitespace-pre-wrap break-all">
                    {antes}
                  </pre>
                </div>
              )}
              {despues && (
                <div>
                  <p className="text-xs font-semibold text-green-600 mb-1">Después</p>
                  <pre className="text-xs bg-green-50 border border-green-100 rounded-lg p-3 overflow-auto max-h-48 whitespace-pre-wrap break-all">
                    {despues}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function EventosAuditoriaPage() {
  const [page, setPage]         = useState(0)
  const [modulo, setModulo]     = useState('')
  const [accion, setAccion]     = useState('')
  const [entidad, setEntidad]   = useState('')
  const [usuarioId, setUsuario] = useState('')
  const [desde, setDesde]       = useState(hace7Dias)
  const [hasta, setHasta]       = useState(hoy)
  const [selected, setSelected] = useState<EventoAuditoriaDto | null>(null)

  const params = {
    modulo:     modulo     || undefined,
    entidad:    entidad    || undefined,
    usuarioId:  usuarioId  || undefined,
    fechaDesde: desde      || undefined,
    fechaHasta: hasta      || undefined,
    page,
  }
  const { data, isLoading } = useEventosAuditoria(params)

  const columns: Column<EventoAuditoriaDto>[] = [
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
      header: 'Módulo',
      cell: (r) => (
        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-mono">
          {r.modulo}
        </span>
      ),
    },
    { header: 'Entidad', cell: (r) => <span className="text-sm font-medium">{r.entidad}</span> },
    { header: 'Acción',  cell: (r) => <AccionBadge accion={r.accion} /> },
    {
      header: 'Usuario',
      cell: (r) => r.usuarioId
        ? <code className="text-xs text-gray-500 font-mono">{r.usuarioId.slice(0, 8)}…</code>
        : <span className="text-gray-400 text-xs">Sistema</span>,
    },
    {
      header: '',
      cell: (r) => (
        <button
          onClick={() => setSelected(r)}
          className="text-xs text-blue-600 hover:underline"
        >
          Ver cambios
        </button>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Eventos de auditoría</h1>
        <p className="text-sm text-gray-500 mt-0.5">Historial completo de cambios en el sistema</p>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Módulo</label>
          <select value={modulo} onChange={(e) => { setModulo(e.target.value); setPage(0) }}
            className={`${selectCls} w-36`}>
            {MODULOS.map((m) => <option key={m} value={m}>{m || 'Todos'}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Acción</label>
          <select value={accion} onChange={(e) => { setAccion(e.target.value); setPage(0) }}
            className={`${selectCls} w-36`}>
            {ACCIONES.map((a) => <option key={a} value={a}>{a || 'Todas'}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Entidad</label>
          <input value={entidad} onChange={(e) => { setEntidad(e.target.value); setPage(0) }}
            placeholder="Ej: Ruta" className={`${inputCls} w-32`} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Usuario ID</label>
          <input value={usuarioId} onChange={(e) => { setUsuario(e.target.value); setPage(0) }}
            placeholder="UUID" className={`${inputCls} w-44 font-mono text-xs`} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Desde</label>
          <input type="date" value={desde} onChange={(e) => { setDesde(e.target.value); setPage(0) }}
            className={`${inputCls} w-36`} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Hasta</label>
          <input type="date" value={hasta} onChange={(e) => { setHasta(e.target.value); setPage(0) }}
            className={`${inputCls} w-36`} />
        </div>
        <button onClick={() => { setModulo(''); setAccion(''); setEntidad(''); setUsuario(''); setDesde(hace7Dias()); setHasta(hoy()); setPage(0) }}
          className="text-xs text-gray-500 hover:text-gray-700 underline self-end pb-2">
          Limpiar
        </button>
      </div>

      <DataTable
        columns={columns}
        data={data?.content ?? []}
        keyFn={(r) => r.eventoId}
        isLoading={isLoading}
        emptyMessage="No hay eventos de auditoría para los filtros seleccionados"
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

      {selected && <DiffModal evento={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
