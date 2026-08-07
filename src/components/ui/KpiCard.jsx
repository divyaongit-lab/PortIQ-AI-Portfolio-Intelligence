import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export function KpiCard({ label, value, subValue, subLabel, trend, trendLabel, accent = 'neutral', size = 'md', className }) {
  const accentBorder = { teal:'border-t-gin-500', amber:'border-t-margin-500', red:'border-t-loss-500', neutral:'border-t-navy-600' }[accent]
  const accentText   = { teal:'text-gin-400', amber:'text-margin-400', red:'text-loss-400', neutral:'text-surface-50' }[accent]
  const TrendIcon    = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor   = trend === 'up' ? 'text-gin-400' : trend === 'down' ? 'text-loss-400' : 'text-surface-200/50'

  return (
    <div className={cn('bg-navy-800 border border-navy-700 rounded-xl border-t-2 px-5 py-4 transition-all duration-200 hover:border-navy-600 hover:shadow-card-hover', accentBorder, className)}>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-surface-200/60 mb-2">{label}</p>
      <p className={cn('font-mono font-bold tracking-tight leading-none', size === 'lg' ? 'text-3xl' : 'text-2xl', accentText)}>{value}</p>
      <div className="flex items-center justify-between mt-2.5">
        {subValue ? (
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-mono text-surface-200/80">{subValue}</span>
            {subLabel && <span className="text-[10px] text-surface-200/40">{subLabel}</span>}
          </div>
        ) : <div />}
        {trendLabel && (
          <div className={cn('flex items-center gap-1', trendColor)}>
            <TrendIcon size={11} strokeWidth={2} />
            <span className="text-[10px] font-mono">{trendLabel}</span>
          </div>
        )}
      </div>
    </div>
  )
}
