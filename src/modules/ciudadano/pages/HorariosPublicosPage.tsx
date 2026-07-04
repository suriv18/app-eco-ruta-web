import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/httpClient'
import type { ApiResponse, PageResult } from '@/shared/types/common'

interface DistritoPublico { id: string; nombre: string }
interface ZonaPublica { id: string; nombre: string; codigo: string; distritoId: string; tipoZona: string }
interface HorarioPublico {
  id: string
  zonaId: string
  diaSemana: number
  horaInicio: string
  horaFin: string
  observacion: string | null
  estado: string
}

const DIAS: Record<number, string> = {
  1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves',
  5: 'Viernes', 6: 'Sábado', 7: 'Domingo',
}

function fmtHora(t: string) {
  // t viene como "HH:mm:ss" desde Java LocalTime
  return t.slice(0, 5)
}

function useDistritosPublicos() {
  return useQuery({
    queryKey: ['publico', 'distritos'],
    queryFn: () =>
      httpClient
        .get<ApiResponse<PageResult<DistritoPublico>>>('/api/v1/operacion/distritos', {
          params: { page: 0, size: 100 },
        })
        .then((r) => r.data.data.content),
  })
}

function useZonasPorDistrito(distritoId: string | null) {
  return useQuery({
    queryKey: ['publico', 'zonas', distritoId],
    queryFn: () =>
      httpClient
        .get<ApiResponse<PageResult<ZonaPublica>>>('/api/v1/operacion/zonas', {
          params: { page: 0, size: 100 },
        })
        .then((r) => r.data.data.content.filter((z) => z.distritoId === distritoId)),
    enabled: !!distritoId,
  })
}

function useHorariosPorZona(zonaId: string | null) {
  return useQuery({
    queryKey: ['publico', 'horarios', zonaId],
    queryFn: () =>
      httpClient
        .get<ApiResponse<PageResult<HorarioPublico>>>('/api/v1/operacion/horarios-recoleccion', {
          params: { zonaId, page: 0, size: 50 },
        })
        .then((r) => r.data.data.content.filter((h) => h.estado === 'ACTIVO')),
    enabled: !!zonaId,
  })
}

function selectCls(error?: boolean) {
  return `w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors ${
    error
      ? 'border-red-300 focus:ring-red-300'
      : 'border-gray-300 focus:ring-green-400 focus:border-transparent'
  }`
}

export function HorariosPublicosPage() {
  const [distritoId, setDistritoId] = useState('')
  const [zonaId, setZonaId] = useState('')

  const { data: distritos = [], isLoading: cargandoDistritos } = useDistritosPublicos()
  const { data: zonas = [], isLoading: cargandoZonas } = useZonasPorDistrito(distritoId || null)
  const { data: horarios = [], isLoading: cargandoHorarios } = useHorariosPorZona(zonaId || null)

  const horariosPorDia = horarios.reduce<Record<number, HorarioPublico[]>>((acc, h) => {
    if (!acc[h.diaSemana]) acc[h.diaSemana] = []
    acc[h.diaSemana].push(h)
    return acc
  }, {})

  const zonaSeleccionada = zonas.find((z) => z.id === zonaId)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Horarios de recolección</h1>
        <p className="text-gray-500 text-sm mt-1">
          Consulta los días y horarios de recolección de residuos en tu zona.
        </p>
      </div>

      {/* Selectores */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Distrito</label>
          <select
            value={distritoId}
            onChange={(e) => { setDistritoId(e.target.value); setZonaId('') }}
            disabled={cargandoDistritos}
            className={selectCls()}
          >
            <option value="">{cargandoDistritos ? 'Cargando distritos...' : 'Selecciona tu distrito'}</option>
            {distritos.map((d) => (
              <option key={d.id} value={d.id}>{d.nombre}</option>
            ))}
          </select>
        </div>

        {distritoId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zona</label>
            <select
              value={zonaId}
              onChange={(e) => setZonaId(e.target.value)}
              disabled={cargandoZonas}
              className={selectCls()}
            >
              <option value="">
                {cargandoZonas ? 'Cargando zonas...' : zonas.length === 0 ? 'No hay zonas disponibles' : 'Selecciona tu zona'}
              </option>
              {zonas.map((z) => (
                <option key={z.id} value={z.id}>{z.nombre} ({z.codigo})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Resultados */}
      {!distritoId && (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="font-medium">Selecciona tu distrito y zona</p>
          <p className="text-sm mt-1">para ver el calendario de recolección</p>
        </div>
      )}

      {distritoId && !zonaId && !cargandoZonas && zonas.length > 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">Selecciona una zona para ver los horarios</p>
        </div>
      )}

      {cargandoHorarios && zonaId && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
        </div>
      )}

      {zonaId && !cargandoHorarios && horarios.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <p className="font-medium text-amber-800">Sin horarios registrados</p>
          <p className="text-sm text-amber-700 mt-1">
            Esta zona aún no tiene horarios de recolección publicados. Consulta a tu municipalidad.
          </p>
        </div>
      )}

      {zonaId && !cargandoHorarios && horarios.length > 0 && (
        <div>
          {zonaSeleccionada && (
            <div className="mb-4 px-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                Zona {zonaSeleccionada.codigo} · {zonaSeleccionada.nombre}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7].map((dia) => {
              const slots = horariosPorDia[dia]
              if (!slots || slots.length === 0) return null
              return (
                <div key={dia} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="bg-green-50 border-b border-green-100 px-5 py-3">
                    <p className="font-semibold text-green-800 text-sm">{DIAS[dia]}</p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {slots.map((h) => (
                      <div key={h.id} className="px-5 py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {fmtHora(h.horaInicio)} – {fmtHora(h.horaFin)}
                            </p>
                            {h.observacion && (
                              <p className="text-xs text-gray-500 mt-0.5">{h.observacion}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                          Activo
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            <p className="font-semibold mb-1">Recomendaciones</p>
            <ul className="list-disc list-inside space-y-0.5 text-xs text-blue-700">
              <li>Saca los residuos 30 minutos antes del horario indicado</li>
              <li>Usa bolsas cerradas y recipientes limpios</li>
              <li>Si el camión no pasó, reporta una alerta en esta app</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
