import { cn } from '@/lib/utils'
import { SlidersHorizontal, X } from 'lucide-react'

export function FilterBar({ filters, options, onChange, onReset, activeCount = 0 }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 text-surface-200/50">
        <SlidersHorizontal size={14} strokeWidth={1.75} />
        <span className="text-[11px] font-semibold uppercase tracking-widest">Filters</span>
      </div>
      <div className="h-4 w-px bg-navy-700" />
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { key:'year', label:'Year', opts: options.years.map(y => ({ value:y, label:y })) },
          { key:'clientId', label:'Client', opts: options.clients },
          { key:'industry', label:'Industry', opts: options.industries.map(i => ({ value:i, label:i })) },
          { key:'country', label:'Country', opts: options.countries.map(c => ({ value:c, label:c })) },
          { key:'projectType', label:'Project Type', opts: options.projectTypes.map(t => ({ value:t, label:t })) },
        ].map(({ key, label, opts }) => (
          <div key={key} className="relative">
            <select
              value={filters[key] ?? 'all'}
              onChange={e => onChange(key, e.target.value === 'all' ? (key === 'year' ? null : 'all') : e.target.value)}
              className={cn(
                'appearance-none pl-3 pr-7 py-1.5 rounded-lg text-xs font-medium bg-navy-900 border transition-colors cursor-pointer text-surface-50 focus:outline-none focus:ring-1 focus:ring-gin-500',
                filters[key] && filters[key] !== 'all'
                  ? 'border-gin-500/50 text-gin-400 bg-gin-500/5'
                  : 'border-navy-700 hover:border-navy-600'
              )}
            >
              <option value="all">All {label}s</option>
              {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
              <svg className="w-3 h-3 text-surface-200/40" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        ))}
      </div>
      {activeCount > 0 && (
        <button onClick={onReset} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-gin-500/10 text-gin-400 border border-gin-500/30 hover:bg-gin-500/20 transition-colors">
          <X size={11} />Clear {activeCount} filter{activeCount > 1 ? 's' : ''}
        </button>
      )}
    </div>
  )
}
