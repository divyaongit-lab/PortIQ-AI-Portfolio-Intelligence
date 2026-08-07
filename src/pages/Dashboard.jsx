import { useMemo } from 'react'
import {
  getPortfolioKPIs, getMonthlyTrend, getTopBottomClients,
  getMetricsByProjectType, getAllProjectMetrics,
  formatCurrency, formatMargin,
} from '@/data/calculations'
import { KpiCard }          from '@/components/ui/KpiCard'
import { TrendChart }       from '@/components/portfolio/TrendChart'
import { ProjectTypeChart } from '@/components/portfolio/ProjectTypeChart'
import { TopBottomClients } from '@/components/portfolio/TopBottomClients'
import { SectionHeader }    from '@/components/ui/SectionHeader'
import { MarginBadge }      from '@/components/ui/MarginBadge'
import { cn } from '@/lib/utils'

export default function Dashboard() {
  const kpis       = useMemo(() => getPortfolioKPIs(), [])
  const trend      = useMemo(() => getMonthlyTrend(), [])
  const typeData   = useMemo(() => getMetricsByProjectType(), [])
  const { top, bottom } = useMemo(() => getTopBottomClients(3), [])
  const projects   = useMemo(() => getAllProjectMetrics(), [])

  const hasLoss    = kpis.grossMargin < 0

  // Portfolio health summary
  const lossProjects   = projects.filter(p => p.grossMargin < 0)
  const activeProjects = projects.filter(p => p.projectStatus === 'Active')

  return (
    <div className="space-y-6 pb-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-50 tracking-tight">Dashboard</h1>
          <p className="text-xs text-surface-200/50 mt-1">
            {kpis.activeClients} active clients · {kpis.activeProjects} active projects · EUR · Prototype Mode
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${
          hasLoss
            ? 'bg-loss-500/10 text-loss-400 border-loss-500/30'
            : kpis.grossMargin >= 30
            ? 'bg-gin-500/10 text-gin-400 border-gin-500/30'
            : 'bg-margin-500/10 text-margin-400 border-margin-500/30'
        }`}>
          <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
          Portfolio {formatMargin(kpis.grossMargin)} margin
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Revenue"        value={formatCurrency(kpis.revenue)}      subValue={`${kpis.activeProjects} active projects`} accent="teal" size="lg" />
        <KpiCard label="Delivery Cost"  value={formatCurrency(kpis.deliveryCost)} subValue="Staff + expenses" accent="neutral" />
        <KpiCard label="Gross Profit"   value={formatCurrency(kpis.grossProfit)}  accent={kpis.grossProfit >= 0 ? 'amber' : 'red'} trend={kpis.grossProfit >= 0 ? 'up' : 'down'} />
        <KpiCard label="Gross Margin"   value={`${kpis.grossMargin.toFixed(1)}%`} subValue={kpis.grossMargin >= 30 ? 'Healthy' : kpis.grossMargin >= 10 ? 'Below target' : 'Loss-making'} accent={kpis.grossMargin >= 30 ? 'teal' : kpis.grossMargin >= 10 ? 'amber' : 'red'} trend={kpis.grossMargin >= 30 ? 'up' : kpis.grossMargin < 0 ? 'down' : 'neutral'} />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <KpiCard label="Active Clients"   value={String(kpis.activeClients)}       subValue="with active accounts" accent="neutral" />
        <KpiCard label="Billable Hours"   value={String(kpis.totalBillableHrs)}    subValue={`${kpis.avgUtilisation}% avg utilisation`} accent="neutral" />
        <KpiCard label="Attention Needed" value={String(lossProjects.length)}      subValue={lossProjects.length ? lossProjects.map(p => p.projectName).join(', ') : 'No loss-making projects'} accent={lossProjects.length ? 'red' : 'teal'} trend={lossProjects.length ? 'down' : 'up'} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrendChart data={trend} title="Revenue & Profit Trend" subtitle="Monthly — based on time entry and expense dates" />
        <ProjectTypeChart data={typeData} title="Revenue & Profit by Project Type" subtitle="Gross profit shown in amber — red indicates a loss" />
      </div>

      {/* Top / bottom clients */}
      <TopBottomClients top={top} bottom={bottom} />

      {/* Portfolio overview table */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-navy-700/60">
          <SectionHeader title="Portfolio Overview" subtitle={`${activeProjects.length} active projects across ${kpis.activeClients} clients`} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-navy-700/50">
                {['Project', 'Client', 'Type', 'Status', 'Revenue', 'Gross Profit', 'Margin'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest text-surface-200/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <tr key={p.projectId} className={cn('border-b border-navy-700/30 last:border-0 hover:bg-navy-700/30 transition-colors', i % 2 !== 0 && 'bg-navy-900/20')}>
                  <td className="px-4 py-3 font-medium text-surface-50 whitespace-nowrap">{p.projectName}</td>
                  <td className="px-4 py-3 text-surface-200/70 whitespace-nowrap">{p.clientName}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-navy-700 text-surface-200/60 text-[10px] font-medium">{p.projectType}</span></td>
                  <td className="px-4 py-3"><span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', p.projectStatus === 'Active' ? 'bg-gin-500/15 text-gin-400' : 'bg-surface-200/10 text-surface-200/50')}>{p.projectStatus}</span></td>
                  <td className="px-4 py-3 font-mono text-surface-50 whitespace-nowrap">{p.revenue > 0 ? formatCurrency(p.revenue) : '—'}</td>
                  <td className={cn('px-4 py-3 font-mono font-semibold whitespace-nowrap', p.grossProfit > 0 ? 'text-gin-400' : p.grossProfit < 0 ? 'text-loss-400' : 'text-surface-200/40')}>{p.revenue > 0 ? formatCurrency(p.grossProfit) : '—'}</td>
                  <td className="px-4 py-3">{p.revenue > 0 ? <MarginBadge value={p.grossMargin} showIcon /> : <span className="text-surface-200/30 font-mono text-[10px]">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
