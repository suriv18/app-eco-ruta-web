interface Props {
  label: string
  value: string | number
  sub?: string
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray'
  loading?: boolean
}

const COLOR: Record<NonNullable<Props['color']>, string> = {
  blue:   'border-l-blue-500  bg-blue-50  text-blue-700',
  green:  'border-l-green-500 bg-green-50 text-green-700',
  yellow: 'border-l-yellow-500 bg-yellow-50 text-yellow-700',
  red:    'border-l-red-500   bg-red-50   text-red-700',
  gray:   'border-l-gray-400  bg-gray-50  text-gray-500',
}

const VALUE_COLOR: Record<NonNullable<Props['color']>, string> = {
  blue:   'text-blue-900',
  green:  'text-green-900',
  yellow: 'text-yellow-900',
  red:    'text-red-900',
  gray:   'text-gray-700',
}

export function StatCard({ label, value, sub, color = 'blue', loading = false }: Props) {
  return (
    <div className={`border-l-4 rounded-xl p-4 ${COLOR[color]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">{label}</p>
      {loading ? (
        <div className="h-7 w-16 bg-current opacity-20 rounded animate-pulse" />
      ) : (
        <p className={`text-2xl font-bold ${VALUE_COLOR[color]}`}>{value}</p>
      )}
      {sub && !loading && <p className="text-xs opacity-60 mt-0.5">{sub}</p>}
    </div>
  )
}
