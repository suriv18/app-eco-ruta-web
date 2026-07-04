import type { EstadoAlerta, NivelCriticidad } from '@/modules/alertas/types/alertasTypes'

const ESTADO_CONFIG: Record<EstadoAlerta, { label: string; cls: string }> = {
  REGISTRADA:  { label: 'Registrada',   cls: 'bg-gray-100 text-gray-700' },
  VALIDADA:    { label: 'Validada',     cls: 'bg-blue-100 text-blue-700' },
  EN_ATENCION: { label: 'En atención',  cls: 'bg-yellow-100 text-yellow-700' },
  ATENDIDA:    { label: 'Atendida',     cls: 'bg-green-100 text-green-700' },
  DESCARTADA:  { label: 'Descartada',   cls: 'bg-red-100 text-red-600' },
  DUPLICADA:   { label: 'Duplicada',    cls: 'bg-purple-100 text-purple-700' },
}

const CRITICIDAD_CONFIG: Record<NivelCriticidad, { label: string; cls: string }> = {
  NORMAL:  { label: 'Normal',   cls: 'bg-gray-100 text-gray-600' },
  CRITICA: { label: 'Crítica',  cls: 'bg-red-100 text-red-700 font-semibold' },
}

export function EstadoAlertaBadge({ estado }: { estado: EstadoAlerta }) {
  const cfg = ESTADO_CONFIG[estado] ?? { label: estado, cls: 'bg-gray-100 text-gray-600' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}

export function CriticidadBadge({ nivel }: { nivel: NivelCriticidad }) {
  const cfg = CRITICIDAD_CONFIG[nivel] ?? { label: nivel, cls: 'bg-gray-100 text-gray-600' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}
