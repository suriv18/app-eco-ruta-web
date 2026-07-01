import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/app/layouts/components/Sidebar'
import { Topbar } from '@/app/layouts/components/Topbar'

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
