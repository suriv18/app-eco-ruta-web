export function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500">KPIs del día</p>
          <p className="text-gray-400 text-xs mt-2">Conectando con backend...</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500">Alertas críticas</p>
          <p className="text-gray-400 text-xs mt-2">Conectando con backend...</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-500">Estado de operación</p>
          <p className="text-gray-400 text-xs mt-2">Conectando con backend...</p>
        </div>
      </div>
    </div>
  )
}
