import { useState, useMemo } from 'react'
import { Search, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import {
  getAllProjectMetrics, getFilterOptions,
  formatCurrency, formatMargin,
} from '@/data/calculations'
import { MarginBadge } from '@/components/ui/MarginBadge'
import { FilterBar }   from '@/components/ui/FilterBar'
import { KpiCard }     from '@/components/ui/KpiCard'
import { rollupMetrics } from '@/data/calculations'
import { cn } from '@/lib/utils'

const EMPTY_FILTERS = { year: null, clientId: 'all', industry: 'all', country: 'all', projectType: 'all' }
const SORT_COLS = ['projectName', 'clientName', 'projectType', 'projectStatus', 'billingType', 'revenue', 'deliveryCost', 'grossProfit', 'grossMargin']

function countActive(f) {
  return Object.entries(f).filter(([, v]) => v !== null && v !== 'all').length
}

const STATUS_STYLES = {
  Active:    'bg-gin-500/15 text-gin-400',
  Completed: 'bg-surface-200/10 text-surface-200/50',
  'On Hold': 'bg-margin-500/15 text-margin-400',
}

const COL_HEADERS = [
  { key: 'projectName',   label: 'Project',       align: 'left'  },
  { key: 'clientName',    label: 'Client',         align: 'left'  },
  { key: 'projectType',   label: 'Type',           align: 'left'  },
  { key: 'billingType',   label: 'Billing',        align: 'left'  },
  { key: 'projectStatus', label: 'Status',         align: 'left'  },
  { key: 'revenue',       label: 'Revenue',        align: 'right' },
  { key: 'deliveryCost',  label: 'Cost',           align: 'right' },
  { key: 'grossProfit',   label: 'Gross Profit',   align: 'right' },
  { key: 'grossMargin',   label: 'Margin',         align: 'right' },
]

export default function Projects() {
  const [filters, setFilters]   = useState(EMPTY_FILTERS)
  const [search,  setSearch]    = useState('')
  const [sortKey, setSortKey]   = useState('grossMargin')
  const [sortDir, setSortDir]   = useState('desc')

  const allProjects = useMemo(() => getAllProjectMetrics(), [])
  const options     = useMemo(() => getFilterOptions(), [])

  const handleSort = (key) => {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir(['revenue','deliveryCost','grossProfit','grossMargin'].includes(key) ? 'desc' : 'asc') }
  }

  const filtered = useMemo(() => {
    let list = allProjects

    // Filter bar
    if (filters.year)                         list = list.filter(p => p.startDate?.startsWith(filters.year) || p.endDate?.startsWith(filters.year))
    if (filters.clientId !== 'all')           list = list.filter(p => p.clientId    === filters.clientId)
    if (filters.industry  !== 'all')          list = list.filter(p => p.industry    === filters.industry)
    if (filters.country   !== 'all')          list = list.filter(p => p.country     === filters.country)
    if (filters.projectType !== 'all')        list = list.filter(p => p.projectType === filters.projectType)

    // Search
    const q = search.toLowerCase().trim()
    if (q) list = list.filter(p =>
      p.projectName.toLowerCase().includes(q) ||
      p.clientName.toLowerCase().includes(q)  ||
      p.projectType.toLowerCase().includes(q)
    )

    // Sort
    return [...list].sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey]
      if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase() }
      if (av < bv) return sortDir === 'asc' ? -1 :  1
      if (av > bv) return sortDir === 'asc' ?  1 : -1
      return 0
    })
  }, [allProjects, filters, search, sortKey, sortDir])

  const kpis        = useMemo(() => rollupMetrics(filtered), [filtered])
  const activeCount = countActive(filters)
  const noData      = filtered.length === 0

  return (
    <div className="space-y-5 pb-8">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-surface-50 tracking-tight">Projects</h1>
        <p className="text-xs text-surface-200/50 mt-1">
          {filtered.length} of {allProjects.length} projects · EUR · Prototype Mode
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Revenue"      value={formatCurrency(kpis.revenue)}      accent="teal" />
        <KpiCard label="Delivery Cost" value={formatCurrency(kpis.deliveryCost)} accent="neutral" />
        <KpiCard label="Gross Profit" value={formatCurrency(kpis.grossProfit)}  accent={kpis.grossProfit >= 0 ? 'amber' : 'red'} />
        <KpiCard label="Gross Margin" value={filtered.length ? `${kpis.grossMargin.toFixed(1)}%` : '—'} accent={kpis.grossMargin >= 30 ? 'teal' : kpis.grossMargin >= 10 ? 'amber' : 'red'} />
      </div>

      {/* Filters + search */}
      <div className="bg-navy-800/60 border border-navy-700 rounded-xl px-4 py-3 space-y-3">
        <FilterBar filters={filters} options={options} onChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))} onReset={() => setFilters(EMPTY_FILTERS)} activeCount={activeCount} />
        <div className="relative max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-200/40 pointer-events-none" />
          <input type="text" placeholder="Search projects or clients…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-sm bg-navy-900 border border-navy-700 text-surface-50 placeholder-surface-200/30 focus:outline-none focus:ring-1 focus:ring-gin-500 transition-colors" />
        </div>
      </div>

      {/* Table */}
      {noData ? (
        <div className="flex flex-col items-center justify-center py-16 bg-navy-800 border border-navy-700 rounded-xl">
          <p className="text-sm text-surface-200/40">No projects match the current filters.</p>
          <button onClick={() => { setFilters(EMPTY_FILTERS); setSearch('') }} className="mt-3 text-xs text-gin-400 hover:text-gin-300 underline underline-offset-2">Clear filters</button>
        </div>
      ) : (
        <div className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-navy-700/60">
                  {COL_HEADERS.map(col => {
                    const isActive = sortKey === col.key
                    const Icon = isActive ? sortDir === 'asc' ? ArrowUp : ArrowDown : ArrowUpDown
                    return (
                      <th key={col.key} onClick={() => handleSort(col.key)}
                        className={cn('px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-surface-200/40 whitespace-nowrap cursor-pointer select-none hover:text-surface-200/70 transition-colors', col.align === 'right' ? 'text-right' : 'text-left')}>
                        <span className="inline-flex items-center gap-1">
                          {col.align === 'right' && <Icon size={9} strokeWidth={2} className={isActive ? 'text-gin-400' : ''} />}
                          {col.label}
                          {col.align === 'left'  && <Icon size={9} strokeWidth={2} className={isActive ? 'text-gin-400' : ''} />}
                        </span>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.projectId} className={cn('border-b border-navy-700/30 last:border-0 hover:bg-navy-700/30 transition-colors', i % 2 !== 0 && 'bg-navy-900/20')}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-surface-50 whitespace-nowrap">{p.projectName}</p>
                      <p className="text-[10px] text-surface-200/40 mt-0.5">{p.manager}</p>
                    </td>
                    <td className="px-4 py-3 text-surface-200/70 whitespace-nowrap">{p.clientName}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-navy-700 text-surface-200/60 text-[10px] font-medium whitespace-nowrap">{p.projectType}</span></td>
                    <td className="px-4 py-3 text-surface-200/60 whitespace-nowrap">{p.billingType}</td>
                    <td className="px-4 py-3"><span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', STATUS_STYLES[p.projectStatus] ?? 'bg-navy-700 text-surface-200/60')}>{p.projectStatus}</span></td>
                    <td className="px-4 py-3 text-right font-mono text-surface-50 whitespace-nowrap">{p.revenue > 0 ? formatCurrency(p.revenue) : '—'}</td>
                    <td className="px-4 py-3 text-right font-mono text-surface-200/60 whitespace-nowrap">{p.deliveryCost > 0 ? formatCurrency(p.deliveryCost) : '—'}</td>
                    <td className={cn('px-4 py-3 text-right font-mono font-semibold whitespace-nowrap', p.grossProfit > 0 ? 'text-gin-400' : p.grossProfit < 0 ? 'text-loss-400' : 'text-surface-200/40')}>{p.revenue > 0 ? formatCurrency(p.grossProfit) : '—'}</td>
                    <td className="px-4 py-3 text-right">{p.revenue > 0 ? <MarginBadge value={p.grossMargin} showIcon /> : <span className="text-surface-200/30 font-mono">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
