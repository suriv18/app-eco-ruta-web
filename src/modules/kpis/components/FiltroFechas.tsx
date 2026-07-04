import { inputCls } from '@/modules/operacion/components/FormField'

interface Props {
  fechaDesde: string
  fechaHasta: string
  onChange: (desde: string, hasta: string) => void
}

export function FiltroFechas({ fechaDesde, fechaHasta, onChange }: Props) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm text-gray-600">Período:</span>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={fechaDesde}
          onChange={(e) => onChange(e.target.value, fechaHasta)}
          className={`${inputCls} w-38 py-1.5 text-sm`}
        />
        <span className="text-gray-400 text-sm">—</span>
        <input
          type="date"
          value={fechaHasta}
          onChange={(e) => onChange(fechaDesde, e.target.value)}
          className={`${inputCls} w-38 py-1.5 text-sm`}
        />
      </div>
    </div>
  )
}
