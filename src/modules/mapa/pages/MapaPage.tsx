import { useState, useCallback, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { PanelLateral } from '@/modules/mapa/components/PanelLateral'
import { UnidadPopup } from '@/modules/mapa/components/UnidadPopup'
import { useEstadoUnidades, usePingsPorUnidad } from '@/modules/mapa/hooks/useEstadoUnidades'
import { useMapaWebSocket } from '@/modules/mapa/hooks/useMapaWebSocket'
import { useQueryClient } from '@tanstack/react-query'
import type { EstadoUnidadDto, WsPosicionPayload } from '@/modules/mapa/types/mapaTypes'
import { env } from '@/app/config/env'

// Lima, Perú - centro por defecto
const CENTRO_LIMA: [number, number] = [-12.0464, -77.0428]
const ZOOM_INICIAL = 12

// Fix para iconos de Leaflet con Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const COLORES_ESTADO: Record<string, string> = {
  EN_RUTA:       '#22c55e',
  DETENIDA:      '#f59e0b',
  SIN_SENAL:     '#6b7280',
  DESCARGANDO:   '#3b82f6',
  FUERA_DE_RUTA: '#ef4444',
}

function crearIconoUnidad(estado: string | null, seleccionada: boolean): L.DivIcon {
  const color = COLORES_ESTADO[estado ?? 'SIN_SENAL'] ?? '#6b7280'
  const size  = seleccionada ? 36 : 28
  const ring  = seleccionada ? `box-shadow:0 0 0 3px ${color}40;` : ''
  return L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border:2.5px solid white;
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      ${ring}
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
    ">
      <svg width="${size * 0.45}" height="${size * 0.45}" viewBox="0 0 24 24" fill="white">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
      </svg>
    </div>`,
  })
}

// Componente que mueve el mapa al seleccionar unidad
function FlyTo({ pos }: { pos: [number, number] | null }) {
  const map = useMap()
  const prevPos = useRef<[number, number] | null>(null)
  useEffect(() => {
    if (pos && (pos[0] !== prevPos.current?.[0] || pos[1] !== prevPos.current?.[1])) {
      map.flyTo(pos, Math.max(map.getZoom(), 15), { duration: 0.8 })
      prevPos.current = pos
    }
  }, [pos, map])
  return null
}

export function MapaPage() {
  const qc = useQueryClient()

  // Estado local de posiciones (se actualiza por WS)
  const [posiciones, setPosiciones] = useState<Record<string, { lat: number; lng: number }>>({})
  const [alertasCriticas, setAlertasCriticas] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [wsConectado, setWsConectado] = useState(false)

  const { data: unidades = [], isLoading } = useEstadoUnidades()
  const { data: historial } = usePingsPorUnidad(selected)

  // Merge posiciones REST + WS
  const unidadesConPosicion: EstadoUnidadDto[] = unidades.map((u) => {
    const ws = posiciones[u.unidadExternoId]
    if (!ws) return u
    return { ...u, latitud: ws.lat, longitud: ws.lng }
  })

  const unidadSeleccionada = unidadesConPosicion.find((u) => u.unidadExternoId === selected) ?? null
  const flyPos: [number, number] | null =
    unidadSeleccionada?.latitud !== null && unidadSeleccionada?.longitud !== null
      ? [unidadSeleccionada!.latitud!, unidadSeleccionada!.longitud!]
      : null

  // Historial como polilínea
  const traza: [number, number][] = (historial?.content ?? [])
    .map((p) => [p.latitud, p.longitud] as [number, number])
    .reverse()

  const handlePosicion = useCallback((p: WsPosicionPayload) => {
    setWsConectado(true)
    setPosiciones((prev) => ({
      ...prev,
      [p.unidadExternoId]: { lat: p.latitud, lng: p.longitud },
    }))
    qc.invalidateQueries({ queryKey: ['mapa', 'estado-unidades'] })
  }, [qc])

  const handleAlertaCritica = useCallback((p: { alertaId: string; descripcion?: string }) => {
    const msg = p.descripcion ?? `Alerta ${p.alertaId.slice(0, 8)}`
    setAlertasCriticas((prev) => [msg, ...prev].slice(0, 20))
  }, [])

  useMapaWebSocket({
    onPosicion: handlePosicion,
    onAlertaCritica: handleAlertaCritica,
  })

  return (
    <div className="flex h-full -m-6 overflow-hidden">
      {/* Panel lateral */}
      <PanelLateral
        unidades={unidadesConPosicion}
        selected={selected}
        alertas={alertasCriticas}
        onSelect={(id) => setSelected((prev) => prev === id ? null : id)}
      />

      {/* Contenedor del mapa */}
      <div className="flex-1 relative">
        {/* Barra superior */}
        <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm pointer-events-auto">
            <p className="text-xs font-semibold text-gray-700">
              Mapa operativo en tiempo real
            </p>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium shadow-sm ${
            wsConectado
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-gray-100 text-gray-500 border border-gray-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${wsConectado ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {wsConectado ? 'Tiempo real activo' : 'Conectando…'}
          </div>
        </div>

        {/* Botón limpiar selección */}
        {selected && (
          <button
            onClick={() => setSelected(null)}
            className="absolute bottom-6 left-3 z-[1000] bg-white border border-gray-200 shadow-sm rounded-lg px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
          >
            ✕ Quitar selección
          </button>
        )}

        {isLoading && (
          <div className="absolute inset-0 z-[999] flex items-center justify-center bg-white/60">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}

        <MapContainer
          center={CENTRO_LIMA}
          zoom={ZOOM_INICIAL}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            url={env.mapTileUrl}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            maxZoom={19}
          />

          <FlyTo pos={flyPos} />

          {/* Traza del historial de la unidad seleccionada */}
          {traza.length > 1 && (
            <Polyline
              positions={traza}
              color="#3b82f6"
              weight={3}
              opacity={0.6}
              dashArray="6,4"
            />
          )}

          {/* Marcadores de unidades */}
          {unidadesConPosicion
            .filter((u) => u.latitud !== null && u.longitud !== null)
            .map((u) => (
              <Marker
                key={u.unidadExternoId}
                position={[u.latitud!, u.longitud!]}
                icon={crearIconoUnidad(u.estadoMovimiento, selected === u.unidadExternoId)}
                zIndexOffset={selected === u.unidadExternoId ? 1000 : 0}
                eventHandlers={{
                  click: () => setSelected((prev) =>
                    prev === u.unidadExternoId ? null : u.unidadExternoId
                  ),
                }}
              >
                <Popup minWidth={220}>
                  <UnidadPopup
                    unidad={u}
                    onVerHistorial={(id) => setSelected(id)}
                  />
                </Popup>
              </Marker>
            ))}
        </MapContainer>

        {/* Leyenda */}
        <div className="absolute bottom-6 right-3 z-[1000] bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-3 shadow-sm text-xs space-y-1.5">
          {Object.entries({
            EN_RUTA: 'En ruta',
            DETENIDA: 'Detenida',
            FUERA_DE_RUTA: 'Fuera de ruta',
            DESCARGANDO: 'Descargando',
            SIN_SENAL: 'Sin señal',
          }).map(([k, label]) => (
            <div key={k} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORES_ESTADO[k] }} />
              <span className="text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
