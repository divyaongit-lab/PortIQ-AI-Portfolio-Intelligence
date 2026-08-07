import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, Users, FolderKanban,
  BarChart3, Settings, Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/',          label: 'Dashboard',          icon: LayoutDashboard },
  { to: '/portfolio', label: 'Portfolio Analysis',  icon: TrendingUp      },
  { to: '/clients',   label: 'Clients',             icon: Users           },
  { to: '/projects',  label: 'Projects',            icon: FolderKanban    },
  { to: '/reports',   label: 'Reports',             icon: BarChart3       },
]

const COPILOT_ITEM = { to: '/copilot', label: 'PortIQ Copilot', icon: Sparkles }
const BOTTOM_ITEMS = [{ to: '/settings', label: 'Settings', icon: Settings }]

function NavItem({ to, label, icon: Icon, end: endProp }) {
  return (
    <NavLink
      to={to}
      end={endProp}
      className={({ isActive }) => cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
        isActive
          ? 'bg-gin-500/10 text-gin-400 border-l-2 border-gin-400 pl-[10px]'
          : 'text-surface-200 hover:bg-navy-700 hover:text-surface-50'
      )}
    >
      <Icon size={16} strokeWidth={1.75} />
      {label}
    </NavLink>
  )
}

export function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-[240px] bg-navy-900 border-r border-navy-700 flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-navy-700">
        <div className="w-8 h-8 rounded-lg bg-gin-500/20 border border-gin-500/40 flex items-center justify-center">
          <ProductIcon />
        </div>
        <div>
          <p className="text-sm font-bold text-surface-50 tracking-wide">PortIQ</p>
          <p className="text-[10px] text-gin-400 font-mono tracking-widest uppercase">AI-Powered Portfolio Intelligence</p>
        </div>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-surface-200/50">
          Navigation
        </p>
        {NAV_ITEMS.map(item => (
          <NavItem key={item.to} {...item} end={item.to === '/'} />
        ))}

        {/* Copilot — visually distinct */}
        <div className="pt-3 pb-1">
          <div className="gin-divider mb-3" />
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-surface-200/50">
            Intelligence
          </p>
          <NavLink
            to={COPILOT_ITEM.to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-gin-500/10 text-gin-400 border-l-2 border-gin-400 pl-[10px]'
                : 'text-gin-400/70 hover:bg-gin-500/10 hover:text-gin-400'
            )}
          >
            <Sparkles size={16} strokeWidth={1.75} />
            {COPILOT_ITEM.label}
          </NavLink>
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 border-t border-navy-700 pt-3 space-y-0.5">
        {BOTTOM_ITEMS.map(item => <NavItem key={item.to} {...item} />)}
        <div className="px-3 pt-3">
          <span className="text-[10px] font-mono text-navy-600">v0.4.0</span>
        </div>
      </div>
    </aside>
  )
}

function ProductIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
      <path d="M4 3 L8 8.5 L12 3 Z" fill="#4ECDC4" opacity="0.9" />
      <path d="M6.5 8.5 L6.5 12 L9.5 12 L9.5 8.5" fill="#4ECDC4" opacity="0.7" />
      <line x1="4.5" y1="13" x2="11.5" y2="13" stroke="#4ECDC4" strokeWidth="1" strokeLinecap="round" />
      <circle cx="11.5" cy="5" r="1.5" fill="#F6C344" />
    </svg>
  )
}
