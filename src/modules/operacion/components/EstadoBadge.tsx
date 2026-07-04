import type {
  EstadoDistrito, EstadoChofer,
  EstadoOperativoUnidad, EstadoContenedor, EstadoTurno,
} from '@/modules/operacion/types/operacionTypes'

type AnyEstado =
  | EstadoDistrito | EstadoChofer
  | EstadoOperativoUnidad | EstadoContenedor | EstadoTurno

const CONFIG: Record<string, { label: string; className: string }> = {
  // Distrito / Depósito / Zona / Horario
  ACTIVO:       { label: 'Activo',       className: 'bg-green-100 text-green-800' },
  INACTIVO:     { label: 'Inactivo',     className: 'bg-gray-100 text-gray-600' },
  // Chofer
  SUSPENDIDO:   { label: 'Suspendido',   className: 'bg-yellow-100 text-yellow-800' },
  // Unidad
  OPERATIVA:    { label: 'Operativa',    className: 'bg-green-100 text-green-800' },
  MANTENIMIENTO:{ label: 'Mantenimiento',className: 'bg-yellow-100 text-yellow-800' },
  AVERIADA:     { label: 'Averiada',     className: 'bg-red-100 text-red-800' },
  // Contenedor
  VACIO:        { label: 'Vacío',        className: 'bg-gray-100 text-gray-600' },
  PARCIAL:      { label: 'Parcial',      className: 'bg-blue-100 text-blue-800' },
  LLENO:        { label: 'Lleno',        className: 'bg-orange-100 text-orange-800' },
  DESBORDADO:   { label: 'Desbordado',   className: 'bg-red-100 text-red-800' },
  // Turno
  PROGRAMADO:   { label: 'Programado',   className: 'bg-gray-100 text-gray-700' },
  EN_CURSO:     { label: 'En curso',     className: 'bg-green-100 text-green-800' },
  FINALIZADO:   { label: 'Finalizado',   className: 'bg-green-900/20 text-green-900' },
  CANCELADO:    { label: 'Cancelado',    className: 'bg-red-100 text-red-800' },
}

interface Props {
  estado: AnyEstado | string
}

export function EstadoBadge({ estado }: Props) {
  const cfg = CONFIG[estado] ?? { label: estado, className: 'bg-gray-100 text-gray-600' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}
