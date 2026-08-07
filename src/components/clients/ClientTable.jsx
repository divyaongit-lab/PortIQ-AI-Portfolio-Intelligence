import { useNavigate } from 'react-router-dom'
import { ArrowUp, ArrowDown, ArrowUpDown, ExternalLink } from 'lucide-react'
import { formatCurrency } from '@/data/calculations'
import { MarginBadge } from '@/components/ui/MarginBadge'
import { cn } from '@/lib/utils'

const STATUS_STYLES = { Active:'bg-gin-500/15 text-gin-400', Inactive:'bg-surface-200/10 text-surface-200/40' }

const COLUMNS = [
  { key:'clientName',    label:'Client Name',    sortable:true,  align:'left'  },
  { key:'industry',      label:'Industry',        sortable:true,  align:'left'  },
  { key:'country',       label:'Country',         sortable:true,  align:'left'  },
  { key:'manager',       label:'Account Manager', sortable:false, align:'left'  },
  { key:'revenue',       label:'Revenue',         sortable:true,  align:'right' },
  { key:'deliveryCost',  label:'Delivery Cost',   sortable:true,  align:'right' },
  { key:'grossProfit',   label:'Gross Profit',    sortable:true,  align:'right' },
  { key:'grossMargin',   label:'Gross Margin',    sortable:true,  align:'right' },
  { key:'activeProjects',label:'Active Projects', sortable:true,  align:'right' },
  { key:'clientStatus',  label:'Status',          sortable:true,  align:'left'  },
]

export function ClientTable({ clients, sortKey, sortDir, onSort }) {
  const navigate = useNavigate()
  if (!clients.length) return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl py-16 text-center">
      <p className="text-sm text-surface-200/40">No clients match your search.</p>
    </div>
  )
  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-navy-700/60">
              {COLUMNS.map(col => {
                const isActive = sortKey === col.key
                const Icon = isActive ? sortDir === 'asc' ? ArrowUp : ArrowDown : col.sortable ? ArrowUpDown : null
                return (
                  <th key={col.key} onClick={() => col.sortable && onSort(col.key)}
                    className={cn('px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-surface-200/40 whitespace-nowrap', col.align === 'right' ? 'text-right' : 'text-left', col.sortable && 'cursor-pointer select-none hover:text-surface-200/70 transition-colors')}>
                    <span className="inline-flex items-center gap-1">
                      {col.align === 'right' && Icon && <Icon size={9} strokeWidth={2} className={isActive ? 'text-gin-400' : ''} />}
                      {col.label}
                      {col.align === 'left'  && Icon && <Icon size={9} strokeWidth={2} className={isActive ? 'text-gin-400' : ''} />}
                    </span>
                  </th>
                )
              })}
              <th className="px-4 py-2.5 w-10" />
            </tr>
          </thead>
          <tbody>
            {clients.map((client, i) => (
              <tr key={client.clientId} onClick={() => navigate(`/clients/${client.clientId}`)}
                className={cn('border-b border-navy-700/30 last:border-0 cursor-pointer transition-colors group hover:bg-navy-700/40', i%2!==0 && 'bg-navy-900/20')}>
                <td className="px-4 py-3"><p className="font-semibold text-surface-50 group-hover:text-gin-400 transition-colors whitespace-nowrap">{client.clientName}</p></td>
                <td className="px-4 py-3 text-surface-200/70 whitespace-nowrap">{client.industry}</td>
                <td className="px-4 py-3 text-surface-200/70 whitespace-nowrap">{client.country}</td>
                <td className="px-4 py-3 text-surface-200/60 whitespace-nowrap">{client.manager}</td>
                <td className="px-4 py-3 text-right font-mono text-surface-50 whitespace-nowrap">{client.revenue > 0 ? formatCurrency(client.revenue) : '—'}</td>
                <td className="px-4 py-3 text-right font-mono text-surface-200/60 whitespace-nowrap">{client.deliveryCost > 0 ? formatCurrency(client.deliveryCost) : '—'}</td>
                <td className={cn('px-4 py-3 text-right font-mono font-semibold whitespace-nowrap', client.grossProfit > 0 ? 'text-gin-400' : client.grossProfit < 0 ? 'text-loss-400' : 'text-surface-200/40')}>{client.revenue > 0 ? formatCurrency(client.grossProfit) : '—'}</td>
                <td className="px-4 py-3 text-right">{client.revenue > 0 ? <MarginBadge value={client.grossMargin} showIcon /> : <span className="text-surface-200/30 font-mono">—</span>}</td>
                <td className="px-4 py-3 text-right">
                  <span className={cn('inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold', client.activeProjects > 0 ? 'bg-gin-500/15 text-gin-400' : 'bg-navy-700 text-surface-200/30')}>{client.activeProjects}</span>
                </td>
                <td className="px-4 py-3"><span className={cn('px-2 py-0.5 rounded text-[10px] font-medium', STATUS_STYLES[client.clientStatus] ?? 'bg-navy-700 text-surface-200/50')}>{client.clientStatus}</span></td>
                <td className="px-4 py-3"><ExternalLink size={12} className="text-surface-200/20 group-hover:text-gin-400 transition-colors" strokeWidth={1.75} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
