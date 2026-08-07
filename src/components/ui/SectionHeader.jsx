import { cn } from '@/lib/utils'

export function SectionHeader({ title, subtitle, action, className }) {
  return (
    <div className={cn('flex items-start justify-between', className)}>
      <div>
        <h3 className="text-sm font-semibold text-surface-50">{title}</h3>
        {subtitle && <p className="text-[11px] text-surface-200/50 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
