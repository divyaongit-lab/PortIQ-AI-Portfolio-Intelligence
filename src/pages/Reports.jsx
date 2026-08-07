import { useMemo } from 'react'
import {
  getMonthlyTrend, getMetricsByProjectType, getAllClientMetrics,
  getPortfolioKPIs, formatCurrency, formatMargin,
} from '@/data/calculations'
import { TrendChart }       from '@/components/portfolio/TrendChart'
import { ProjectTypeChart } from '@/components/portfolio/ProjectTypeChart'
import { KpiCard }          from '@/components/ui/KpiCard'
import { SectionHeader }    from '@/components/ui/SectionHeader'
import { MarginBadge }      from '@/components/ui/MarginBadge'
import { cn } from '@/lib/utils'

export default function Reports() {
  const trend    = useMemo(() => getMonthlyTrend(), [])
  const typeData = useMemo(() => getMetricsByProjectType(), [])
  const clients  = useMemo(() => getAllClientMetrics().filter(c => c.revenue > 0), [])
  const kpis     = useMemo(() => getPortfolioKPIs(), [])

  // Project type distribution for summary
  const totalRevenue = typeData.reduce((s, t) => s + t.revenue, 0)

  return (
    <div className="space-y-6 pb-8">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-surface-50 tracking-tight">Reports</h1>
        <p className="text-xs text-surface-200/50 mt-1">Portfolio analysis · EUR · Prototype Mode</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Portfolio Revenue"  value={formatCurrency(kpis.revenue)}      accent="teal" size="lg" />
        <KpiCard label="Total Cost"         value={formatCurrency(kpis.deliveryCost)} accent="neutral" />
        <KpiCard label="Gross Profit"       value={formatCurrency(kpis.grossProfit)}  accent={kpis.grossProfit >= 0 ? 'amber' : 'red'} />
        <KpiCard label="Portfolio Margin"   value={`${kpis.grossMargin.toFixed(1)}%`} accent={kpis.grossMargin >= 30 ? 'teal' : kpis.grossMargin >= 10 ? 'amber' : 'red'} trend={kpis.grossMargin >= 30 ? 'up' : kpis.grossMargin < 0 ? 'down' : 'neutral'} />
      </div>

      {/* Trend charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrendChart data={trend} title="Revenue Trend" subtitle="Monthly revenue and gross profit" />
        <ProjectTypeChart data={typeData} title="Revenue & Profit by Project Type" subtitle="Gross profit shown in amber — red indicates a loss" />
      </div>

      {/* Client profitability table */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-navy-700/60">
          <SectionHeader title="Client Profitability" subtitle={`${clients.length} clients with recorded revenue`} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-navy-700/50">
                {['Client', 'Industry', 'Revenue', 'Delivery Cost', 'Gross Profit', 'Margin', 'Projects'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest text-surface-200/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...clients].sort((a, b) => b.grossMargin - a.grossMargin).map((c, i) => (
                <tr key={c.clientId} className={cn('border-b border-navy-700/30 last:border-0 hover:bg-navy-700/30 transition-colors', i % 2 !== 0 && 'bg-navy-900/20')}>
                  <td className="px-4 py-3 font-semibold text-surface-50 whitespace-nowrap">{c.clientName}</td>
                  <td className="px-4 py-3 text-surface-200/60 whitespace-nowrap">{c.industry}</td>
                  <td className="px-4 py-3 font-mono text-surface-50 whitespace-nowrap">{formatCurrency(c.revenue)}</td>
                  <td className="px-4 py-3 font-mono text-surface-200/60 whitespace-nowrap">{formatCurrency(c.deliveryCost)}</td>
                  <td className={cn('px-4 py-3 font-mono font-semibold whitespace-nowrap', c.grossProfit >= 0 ? 'text-gin-400' : 'text-loss-400')}>{formatCurrency(c.grossProfit)}</td>
                  <td className="px-4 py-3"><MarginBadge value={c.grossMargin} showIcon /></td>
                  <td className="px-4 py-3 text-surface-200/60">{c.projectCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project type distribution */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-navy-700/60">
          <SectionHeader title="Revenue Distribution by Project Type" subtitle="Share of total portfolio revenue" />
        </div>
        <div className="p-5 space-y-3">
          {[...typeData].sort((a, b) => b.revenue - a.revenue).map(t => {
            const share = totalRevenue > 0 ? (t.revenue / totalRevenue) * 100 : 0
            const margin = t.revenue > 0 ? (t.grossProfit / t.revenue) * 100 : 0
            return (
              <div key={t.type}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-surface-50">{t.type}</span>
                    <MarginBadge value={Math.round(margin * 10) / 10} />
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-surface-200/60">{formatCurrency(t.revenue)}</span>
                    <span className="text-surface-200/40">{share.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-navy-700 overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', margin >= 30 ? 'bg-gin-500' : margin >= 10 ? 'bg-margin-500' : 'bg-loss-500')}
                    style={{ width: `${share}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
