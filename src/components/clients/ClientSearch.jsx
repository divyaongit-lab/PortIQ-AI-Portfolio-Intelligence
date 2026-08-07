import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export const SORT_OPTIONS = [
  { value:'clientName',  label:'Client Name' },
  { value:'revenue',     label:'Revenue'      },
  { value:'grossMargin', label:'Gross Margin' },
  { value:'grossProfit', label:'Gross Profit' },
  { value:'industry',    label:'Industry'     },
  { value:'country',     label:'Country'      },
]

export function ClientSearch({ search, onSearch, sortKey, sortDir, onSort, resultCount }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-200/40 pointer-events-none" />
        <input type="text" placeholder="Search clients…" value={search} onChange={e => onSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 rounded-lg text-sm bg-navy-900 border border-navy-700 text-surface-50 placeholder-surface-200/30 focus:outline-none focus:ring-1 focus:ring-gin-500 focus:border-gin-500/50 transition-colors" />
      </div>
      <div className="h-4 w-px bg-navy-700" />
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-surface-200/40">Sort</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {SORT_OPTIONS.map(opt => {
            const isActive = sortKey === opt.value
            const Icon = isActive ? sortDir === 'asc' ? ArrowUp : ArrowDown : ArrowUpDown
            return (
              <button key={opt.value} onClick={() => onSort(opt.value)}
                className={cn('flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors',
                  isActive ? 'bg-gin-500/15 text-gin-400 border border-gin-500/30' : 'text-surface-200/50 hover:text-surface-200 hover:bg-navy-700 border border-transparent')}>
                <Icon size={10} strokeWidth={2} />{opt.label}
              </button>
            )
          })}
        </div>
      </div>
      <div className="ml-auto text-[11px] font-mono text-surface-200/40">{resultCount} client{resultCount !== 1 ? 's' : ''}</div>
    </div>
  )
}
