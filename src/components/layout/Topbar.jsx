import { useLocation } from 'react-router-dom'
import { Bell } from 'lucide-react'

const PAGE_TITLES = {
  '/':          'Dashboard',
  '/portfolio': 'Portfolio Analysis',
  '/clients':   'Clients',
  '/projects':  'Projects',
  '/reports':   'Reports',
  '/copilot':   'PortIQ Copilot',
  '/settings':  'Settings',
}

export function Topbar() {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] ?? PAGE_TITLES[`/${pathname.split('/')[1]}`] ?? 'PortIQ'

  return (
    <header className="fixed top-0 left-[240px] right-0 h-[56px] bg-navy-900/80 backdrop-blur-sm border-b border-navy-700 flex items-center justify-between px-6 z-30">
      <h1 className="text-sm font-semibold text-surface-50 leading-none">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-surface-200/50 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-gin-500 animate-pulse" />
          Prototype Mode
        </div>
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center text-surface-200 hover:bg-navy-700 hover:text-surface-50 transition-colors">
          <Bell size={15} strokeWidth={1.75} />
        </button>
        <div className="w-7 h-7 rounded-full bg-gin-500/20 border border-gin-500/40 flex items-center justify-center text-[11px] font-bold text-gin-400">
          GM
        </div>
      </div>
    </header>
  )
}
