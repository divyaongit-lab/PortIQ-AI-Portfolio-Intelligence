import { cn } from '@/lib/utils'
import { marginClass, formatMargin } from '@/data/calculations'

export function MarginBadge({ value, showIcon = false }) {
  const tier = marginClass(value)
  const styles = {
    high: 'bg-gin-500/15 text-gin-400 border-gin-500/30',
    mid:  'bg-margin-500/15 text-margin-400 border-margin-500/30',
    low:  'bg-loss-500/15 text-loss-400 border-loss-500/30',
  }[tier]
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-semibold border', styles)}>
      {showIcon && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />}
      {formatMargin(value)}
    </span>
  )
}
