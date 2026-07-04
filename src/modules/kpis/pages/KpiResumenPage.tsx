import { useState } from 'react'
import { KpiCard } from '@/modules/kpis/components/KpiCard'
import { BarraProgreso } from '@/modules/kpis/components/BarraProgreso'
import { useResumenDiario, useCalcularResumen } from '@/modules/kpis/hooks/useKpisQuery'
import { useDistritos } from '@/modules/operacion/hooks/useOperacionQuery'
import { PermissionGuard } from '@/modules/auth/components/PermissionGuard'
import { selectCls, inputCls } from '@/modules/operacion/components/FormField'
import { extractApiError } from '@/shared/api/apiError'

function hoy() {
  return new Date().toISOString().slice(0, 10)
}

export function KpiResumenPage() {
  const [distritoId, setDistritoId] = useState('')
  const [fecha, setFecha] = useState(hoy)

  const { data: distritos } = useDistritos(0, 100)
  const params = distritoId && fecha ? { distritoId, fecha } : null
  const { data: resumen, isLoading, isError } = useResumenDiario(params)
  const calcular = useCalcularResumen()

  const cobertura = resumen ? Number(resumen.coberturaPorcentaje) : 0
  const tasaAtencion = resumen && resumen.alertasRegistradas > 0
    ? (resumen.alertasAtendidas / resumen.alertasRegistradas) * 100
    : 0

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resumen operativo diario</h1>
          <p className="text-sm text-gray-500 mt-0.5">Indicadores consolidados por distrito y fecha</p>
        </div>
        <PermissionGuard roles={['ADMIN', 'SUPERVISOR']}>
          <button
            onClick={() => params && calcular.mutate(params)}
            disabled={!params || calcular.isPending}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {calcular.isPending ? 'Calculando...' : 'Recalcular'}
          </button>
        </PermissionGuard>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Distrito</label>
          <select
            value={distritoId}
            onChange={(e) => setDistritoId(e.target.value)}
            className={`${selectCls} w-56`}
          >
            <option value="">Selecciona un distrito</option>
            {distritos?.content.map((d) => (
              <option key={d.id} value={d.id}>{d.nombre}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className={`${inputCls} w-44`}
          />
        </div>
      </div>

      {/* Estado vacío */}
      {!params && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-1">Selecciona un distrito y una fecha</p>
          <p className="text-sm">para ver el resumen operativo</p>
        </div>
      )}

      {/* Error */}
      {isError && params && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-700 text-sm">
          No hay datos para los parámetros seleccionados. Usa <strong>Recalcular</strong> para generar el resumen.
          {calcular.error && (
            <p className="mt-1 text-red-600">{extractApiError(calcular.error).message}</p>
          )}
        </div>
      )}

      {/* Contenido */}
      {resumen && (
        <div className="space-y-6">
          {/* Cards principales */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Km recorridos"
              value={`${Number(resumen.kmRecorridos).toFixed(1)} km`}
              sub={`de ${Number(resumen.kmProgramados).toFixed(1)} km programados`}
              highlight={Number(resumen.kmRecorridos) >= Number(resumen.kmProgramados) * 0.9 ? 'green' : 'yellow'}
            />
            <KpiCard
              label="Toneladas recolectadas"
              value={`${Number(resumen.toneladasRecolectadas).toFixed(2)} t`}
              highlight="blue"
            />
            <KpiCard
              label="Alertas atendidas"
              value={`${resumen.alertasAtendidas} / ${resumen.alertasRegistradas}`}
              sub="alertas del día"
              highlight={tasaAtencion >= 80 ? 'green' : tasaAtencion >= 50 ? 'yellow' : 'red'}
            />
            <KpiCard
              label="Tiempo resp. promedio"
              value={`${Number(resumen.tiempoRespuestaPromedioMin).toFixed(0)} min`}
              highlight={Number(resumen.tiempoRespuestaPromedioMin) <= 30 ? 'green' : Number(resumen.tiempoRespuestaPromedioMin) <= 60 ? 'yellow' : 'red'}
            />
          </div>

          {/* Barras de progreso */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5">
            <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Coberturas</h2>
            <BarraProgreso
              valor={cobertura}
              label="Cobertura territorial"
            />
            <BarraProgreso
              valor={tasaAtencion}
              label="Tasa de atención de alertas"
            />
            <BarraProgreso
              valor={Number(resumen.kmProgramados) > 0
                ? (Number(resumen.kmRecorridos) / Number(resumen.kmProgramados)) * 100
                : 0}
              label="Cumplimiento de recorrido"
            />
          </div>

          {/* Pie */}
          <p className="text-xs text-gray-400 text-right">
            Generado: {new Date(resumen.creadoEn).toLocaleString('es-PE')}
          </p>
        </div>
      )}

      {isLoading && params && (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
