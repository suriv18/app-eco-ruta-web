interface Props {
  valor: number   // 0-100
  label?: string
  colorCls?: string
}

function colorPorcentaje(v: number) {
  if (v >= 85) return 'bg-green-500'
  if (v >= 60) return 'bg-yellow-400'
  return 'bg-red-400'
}

export function BarraProgreso({ valor, label, colorCls }: Props) {
  const pct = Math.min(Math.max(valor, 0), 100)
  const color = colorCls ?? colorPorcentaje(pct)
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{label}</span>
          <span className="font-medium">{pct.toFixed(1)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
