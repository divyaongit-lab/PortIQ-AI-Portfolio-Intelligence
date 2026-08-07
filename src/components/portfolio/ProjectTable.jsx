import { formatCurrency } from '@/data/calculations'
import { MarginBadge } from '@/components/ui/MarginBadge'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn } from '@/lib/utils'

const STATUS_STYLES = { Active:'bg-gin-500/15 text-gin-400', Completed:'bg-surface-200/10 text-surface-200/60' }

export function ProjectTable({ projects }) {
  if (!projects.length) return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-8 text-center">
      <p className="text-xs text-surface-200/40">No projects match the current filters.</p>
    </div>
  )
  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-navy-700/60">
        <SectionHeader title="Project Breakdown" subtitle={`${projects.length} project${projects.length !== 1 ? 's' : ''} in view`} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-navy-700/50">
              {['Project','Client','Type','Revenue','Cost','Gross Profit','Margin','Status'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest text-surface-200/40">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => (
              <tr key={p.projectId} className={cn('border-b border-navy-700/30 last:border-0 transition-colors hover:bg-navy-700/30', i%2!==0 && 'bg-navy-900/20')}>
                <td className="px-4 py-3"><p className="font-medium text-surface-50 whitespace-nowrap">{p.projectName}</p><p className="text-[10px] text-surface-200/40 mt-0.5">{p.billingType}</p></td>
                <td className="px-4 py-3 text-surface-200/70 whitespace-nowrap">{p.clientName}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-navy-700 text-surface-200/60 text-[10px] font-medium whitespace-nowrap">{p.projectType}</span></td>
                <td className="px-4 py-3 font-mono text-surface-50 whitespace-nowrap">{formatCurrency(p.revenue)}</td>
                <td className="px-4 py-3 font-mono text-surface-200/60 whitespace-nowrap">{formatCurrency(p.deliveryCost)}</td>
                <td className={cn('px-4 py-3 font-mono font-semibold whitespace-nowrap', p.grossProfit >= 0 ? 'text-gin-400' : 'text-loss-400')}>{formatCurrency(p.grossProfit)}</td>
                <td className="px-4 py-3"><MarginBadge value={p.grossMargin} /></td>
                <td className="px-4 py-3"><span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', STATUS_STYLES[p.projectStatus] ?? 'bg-navy-700 text-surface-200/60')}>{p.projectStatus}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
