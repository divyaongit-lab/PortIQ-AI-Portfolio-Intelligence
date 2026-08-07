import { TrendingUp, TrendingDown, Building2 } from 'lucide-react'
import { formatCurrency } from '@/data/calculations'
import { MarginBadge } from '@/components/ui/MarginBadge'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn } from '@/lib/utils'

function ClientRow({ client, rank, variant }) {
  const isTop = variant === 'top'
  return (
    <div className={cn('flex items-center gap-4 px-4 py-3 rounded-lg transition-colors hover:bg-navy-700/50 border-b border-navy-700/50 last:border-0')}>
      <div className={cn('w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-mono font-bold', isTop ? 'bg-gin-500/15 text-gin-400' : 'bg-loss-500/15 text-loss-400')}>{rank}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-surface-50 truncate">{client.clientName}</p>
        <p className="text-[10px] text-surface-200/50 mt-0.5">{client.industry} · {client.country}</p>
      </div>
      <div className="text-right hidden sm:block">
        <p className="text-xs font-mono text-surface-200/70">{formatCurrency(client.revenue)}</p>
        <p className="text-[10px] text-surface-200/40 mt-0.5">revenue</p>
      </div>
      <div className="text-right hidden md:block">
        <p className={cn('text-xs font-mono', client.grossProfit >= 0 ? 'text-gin-400' : 'text-loss-400')}>{formatCurrency(client.grossProfit)}</p>
        <p className="text-[10px] text-surface-200/40 mt-0.5">gross profit</p>
      </div>
      <MarginBadge value={client.grossMargin} showIcon />
    </div>
  )
}

export function TopBottomClients({ top, bottom }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[{ title:'Top Performers', subtitle:'Clients by gross margin', data:top, icon:TrendingUp, iconClass:'text-gin-400', variant:'top' },
        { title:'Needs Attention', subtitle:'Clients with lowest gross margin', data:bottom, icon:TrendingDown, iconClass:'text-loss-400', variant:'bottom' }
      ].map(({ title, subtitle, data, icon:Icon, iconClass, variant }) => (
        <div key={title} className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-navy-700/60 flex items-center gap-2">
            <Icon size={14} className={iconClass} strokeWidth={2} />
            <SectionHeader title={title} subtitle={subtitle} />
          </div>
          <div className="p-2">
            {data.filter(c => c.revenue > 0).length > 0
              ? data.map((c, i) => <ClientRow key={c.clientId} client={c} rank={i+1} variant={variant} />)
              : <div className="flex flex-col items-center justify-center py-10 text-center"><Building2 size={28} className="text-navy-600 mb-2" strokeWidth={1} /><p className="text-xs text-surface-200/40">No client data for this filter.</p></div>
            }
          </div>
        </div>
      ))}
    </div>
  )
}
