interface Props {
  label: string
  value: string | number
  sub?: string
  highlight?: 'green' | 'yellow' | 'red' | 'blue' | 'none'
}

const HIGHLIGHT_CLS: Record<NonNullable<Props['highlight']>, string> = {
  green:  'border-l-4 border-l-green-400',
  yellow: 'border-l-4 border-l-yellow-400',
  red:    'border-l-4 border-l-red-400',
  blue:   'border-l-4 border-l-blue-400',
  none:   '',
}

export function KpiCard({ label, value, sub, highlight = 'none' }: Props) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-5 ${HIGHLIGHT_CLS[highlight]}`}>
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}
