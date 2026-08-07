import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-navy-950">
      <Sidebar />
      <Topbar />
      <main className="ml-[240px] mt-[56px] min-h-[calc(100vh-56px)] p-6">
        <Outlet />
      </main>
    </div>
  )
}
