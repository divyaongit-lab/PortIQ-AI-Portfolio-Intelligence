import { useState, useMemo } from 'react'
import { AlertTriangle } from 'lucide-react'
import { getFilterOptions, getFilteredProjectMetrics, rollupMetrics, getMonthlyTrend, formatCurrency, formatMargin } from '@/data/calculations'
import { FilterBar }        from '@/components/ui/FilterBar'
import { KpiCard }          from '@/components/ui/KpiCard'
import { ProjectTypeChart } from '@/components/portfolio/ProjectTypeChart'
import { TrendChart }       from '@/components/portfolio/TrendChart'
import { TopBottomClients } from '@/components/portfolio/TopBottomClients'
import { ProjectTable }     from '@/components/portfolio/ProjectTable'

const EMPTY_FILTERS = { year:null, clientId:'all', industry:'all', country:'all', projectType:'all' }

function countActiveFilters(f) {
  return Object.entries(f).filter(([,v]) => v !== null && v !== 'all').length
}

export default function Portfolio() {
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const options          = useMemo(() => getFilterOptions(), [])
  const filteredProjects = useMemo(() => getFilteredProjectMetrics(filters), [filters])
  const kpis             = useMemo(() => rollupMetrics(filteredProjects), [filteredProjects])
  const trendData        = useMemo(() => getMonthlyTrend(), [])

  const typeData = useMemo(() => {
    const typeMap = {}
    filteredProjects.forEach(p => {
      if (!typeMap[p.projectType]) typeMap[p.projectType] = { revenue:0, grossProfit:0, deliveryCost:0 }
      typeMap[p.projectType].revenue      += p.revenue
      typeMap[p.projectType].grossProfit  += p.grossProfit
      typeMap[p.projectType].deliveryCost += p.deliveryCost
    })
    return Object.entries(typeMap).map(([type, vals]) => ({ type, ...vals }))
  }, [filteredProjects])

  const clientMetrics = useMemo(() => {
    const m = {}
    filteredProjects.forEach(p => {
      if (!m[p.clientId]) m[p.clientId] = { clientId:p.clientId, clientName:p.clientName, industry:p.industry, country:p.country, revenue:0, deliveryCost:0, grossProfit:0 }
      m[p.clientId].revenue      += p.revenue
      m[p.clientId].deliveryCost += p.deliveryCost
      m[p.clientId].grossProfit  += p.grossProfit
    })
    return Object.values(m).map(c => ({ ...c, grossMargin: c.revenue > 0 ? Math.round((c.grossProfit/c.revenue)*1000)/10 : 0 }))
  }, [filteredProjects])

  const topClients    = useMemo(() => [...clientMetrics.filter(c=>c.revenue>0)].sort((a,b)=>b.grossMargin-a.grossMargin).slice(0,3), [clientMetrics])
  const bottomClients = useMemo(() => [...clientMetrics.filter(c=>c.revenue>0)].sort((a,b)=>a.grossMargin-b.grossMargin).slice(0,3), [clientMetrics])

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }))
  const handleReset = () => setFilters(EMPTY_FILTERS)
  const activeCount = countActiveFilters(filters)
  const hasLoss = kpis.grossMargin < 0
  const noData  = filteredProjects.length === 0

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-50 tracking-tight">Portfolio Analysis</h1>
          <p className="text-xs text-surface-200/50 mt-1">
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} · {activeCount > 0 ? `${activeCount} filter${activeCount>1?'s':''} active` : 'all data'} · EUR · Prototype Mode
          </p>
        </div>
        {!noData && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${hasLoss ? 'bg-loss-500/10 text-loss-400 border-loss-500/30' : kpis.grossMargin>=30 ? 'bg-gin-500/10 text-gin-400 border-gin-500/30' : 'bg-margin-500/10 text-margin-400 border-margin-500/30'}`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            Portfolio margin {formatMargin(kpis.grossMargin)}
          </div>
        )}
      </div>

      <div className="bg-navy-800/60 border border-navy-700 rounded-xl px-4 py-3">
        <FilterBar filters={filters} options={options} onChange={handleFilterChange} onReset={handleReset} activeCount={activeCount} />
      </div>

      {hasLoss && !noData && (
        <div className="flex items-center gap-3 px-4 py-3 bg-loss-500/10 border border-loss-500/30 rounded-xl">
          <AlertTriangle size={16} className="text-loss-400 flex-shrink-0" />
          <p className="text-xs text-loss-400"><span className="font-semibold">Margin alert:</span> This portfolio view is loss-making ({formatMargin(kpis.grossMargin)}). Delivery costs exceed revenue.</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Revenue"       value={formatCurrency(kpis.revenue)}      subValue={`${filteredProjects.filter(p=>p.revenue>0).length} billable projects`} accent="teal" size="lg" />
        <KpiCard label="Delivery Cost" value={formatCurrency(kpis.deliveryCost)} subValue="Staff + expenses" accent="neutral" />
        <KpiCard label="Gross Profit"  value={formatCurrency(kpis.grossProfit)}  accent={kpis.grossProfit>=0?'amber':'red'} trend={kpis.grossProfit>=0?'up':'down'} />
        <KpiCard label="Gross Margin"  value={noData?'—':`${kpis.grossMargin.toFixed(1)}%`} subValue={kpis.grossMargin>=30?'Healthy margin':kpis.grossMargin>=10?'Below target':kpis.grossMargin<0?'Loss-making':'Low margin'} accent={kpis.grossMargin>=30?'teal':kpis.grossMargin>=10?'amber':'red'} trend={kpis.grossMargin>=30?'up':kpis.grossMargin<0?'down':'neutral'} />
      </div>

      {noData ? (
        <div className="flex flex-col items-center justify-center py-20 bg-navy-800 border border-navy-700 rounded-xl">
          <p className="text-surface-200/40 text-sm">No projects match the current filters.</p>
          <button onClick={handleReset} className="mt-3 text-xs text-gin-400 hover:text-gin-300 underline underline-offset-2">Clear all filters</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ProjectTypeChart data={typeData} title="Revenue & Profit by Project Type" subtitle="Gross profit shown in amber — red indicates a loss" />
            <TrendChart data={trendData} title="Revenue & Profit Trend" subtitle="Monthly — based on time entry and expense dates" />
          </div>
          <TopBottomClients top={topClients} bottom={bottomClients} />
          <ProjectTable projects={filteredProjects} />
        </>
      )}
    </div>
  )
}
