import type { EstadoRuta, EstadoParada } from '@/modules/rutas/types/rutasTypes'

const RUTA_CONFIG: Record<EstadoRuta, { label: string; cls: string }> = {
  BORRADOR:     { label: 'Borrador',      cls: 'bg-gray-100 text-gray-600' },
  APROBADA:     { label: 'Aprobada',      cls: 'bg-blue-100 text-blue-700' },
  EN_EJECUCION: { label: 'En ejecución',  cls: 'bg-yellow-100 text-yellow-700' },
  FINALIZADA:   { label: 'Finalizada',    cls: 'bg-green-100 text-green-700' },
  CANCELADA:    { label: 'Cancelada',     cls: 'bg-red-100 text-red-600' },
}

const PARADA_CONFIG: Record<EstadoParada, { label: string; cls: string }> = {
  PENDIENTE:   { label: 'Pendiente',   cls: 'bg-gray-100 text-gray-500' },
  EN_ATENCION: { label: 'En atención', cls: 'bg-yellow-100 text-yellow-700' },
  ATENDIDA:    { label: 'Atendida',    cls: 'bg-green-100 text-green-700' },
  OMITIDA:     { label: 'Omitida',     cls: 'bg-red-100 text-red-500' },
}

export function EstadoRutaBadge({ estado }: { estado: EstadoRuta }) {
  const cfg = RUTA_CONFIG[estado] ?? { label: estado, cls: 'bg-gray-100 text-gray-600' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}

export function EstadoParadaBadge({ estado }: { estado: EstadoParada }) {
  const cfg = PARADA_CONFIG[estado] ?? { label: estado, cls: 'bg-gray-100 text-gray-600' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}
