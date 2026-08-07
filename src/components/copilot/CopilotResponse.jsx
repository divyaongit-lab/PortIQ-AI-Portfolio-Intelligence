import React from 'react'
import {
  AlertTriangle, WifiOff, HelpCircle, Database, Bot
} from 'lucide-react'
import { formatCurrency, formatMargin, marginClass } from '@/data/calculations'
import { MarginBadge } from '@/components/ui/MarginBadge'
import { cn } from '@/lib/utils'

// ── Evidence card ─────────────────────────────────────────────────────────────
function EvidenceCard({ item }) {
  const { name, type, metrics, note } = item
  const hasFinancials = metrics && (metrics.revenue != null || metrics.grossMargin != null)

  return (
    <div className="bg-navy-900 border border-navy-700 rounded-lg px-4 py-3 flex flex-col gap-1.5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-surface-50 leading-tight">{name}</p>
          {type && (
            <p className="text-[10px] text-surface-200/40 capitalize mt-0.5">{type}</p>
          )}
        </div>
        {hasFinancials && metrics.grossMargin != null && (
          <MarginBadge value={metrics.grossMargin} showIcon />
        )}
      </div>

      {/* Metrics row */}
      {hasFinancials && (
        <div className="flex items-center gap-4 flex-wrap mt-1">
          {metrics.revenue != null && (
            <div>
              <p className="text-[10px] text-surface-200/40 uppercase tracking-wider">Revenue</p>
              <p className="text-xs font-mono text-surface-50">{formatCurrency(metrics.revenue)}</p>
            </div>
          )}
          {metrics.deliveryCost != null && (
            <div>
              <p className="text-[10px] text-surface-200/40 uppercase tracking-wider">Cost</p>
              <p className="text-xs font-mono text-surface-200/60">{formatCurrency(metrics.deliveryCost)}</p>
            </div>
          )}
          {metrics.grossProfit != null && (
            <div>
              <p className="text-[10px] text-surface-200/40 uppercase tracking-wider">Gross Profit</p>
              <p className={cn(
                'text-xs font-mono font-semibold',
                metrics.grossProfit >= 0 ? 'text-gin-400' : 'text-loss-400'
              )}>
                {formatCurrency(metrics.grossProfit)}
              </p>
            </div>
          )}
          {metrics.grossMargin != null && (
            <div>
              <p className="text-[10px] text-surface-200/40 uppercase tracking-wider">Margin</p>
              <p className={cn(
                'text-xs font-mono font-semibold',
                metrics.grossMargin >= 30 ? 'text-gin-400' :
                metrics.grossMargin >= 10 ? 'text-margin-400' : 'text-loss-400'
              )}>
                {formatMargin(metrics.grossMargin)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Note */}
      {note && <p className="text-[11px] text-surface-200/50 italic mt-0.5">{note}</p>}
    </div>
  )
}

// ── Evidence Used summary ─────────────────────────────────────────────────────
function EvidenceUsedSummary({ evidence }) {
  const clients  = evidence.filter(e => e.type === 'client').map(e => e.name)
  const projects = evidence.filter(e => e.type === 'project').map(e => e.name)

  // Collect which financial metrics actually appeared across all evidence items
  const metricLabels = {
    revenue:      'Revenue',
    deliveryCost: 'Delivery Cost',
    grossProfit:  'Gross Profit',
    grossMargin:  'Gross Margin %',
  }
  const metricsUsed = Object.entries(metricLabels)
    .filter(([key]) => evidence.some(e => e.metrics?.[key] != null))
    .map(([, label]) => label)

  if (!clients.length && !projects.length && !metricsUsed.length) return null

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-2 rounded-lg bg-navy-900/60 border border-navy-700/50">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-surface-200/30 flex-shrink-0">
        Evidence used
      </span>
      {clients.length > 0 && (
        <Pill label={`${clients.length} client${clients.length > 1 ? 's' : ''}`} detail={clients.join(', ')} color="teal" />
      )}
      {projects.length > 0 && (
        <Pill label={`${projects.length} project${projects.length > 1 ? 's' : ''}`} detail={projects.join(', ')} color="amber" />
      )}
      {metricsUsed.length > 0 && (
        <Pill label={`${metricsUsed.length} metric${metricsUsed.length > 1 ? 's' : ''}`} detail={metricsUsed.join(', ')} color="neutral" />
      )}
    </div>
  )
}

function Pill({ label, detail, color }) {
  const colors = {
    teal:    'bg-gin-500/10 text-gin-400 border-gin-500/20',
    amber:   'bg-margin-500/10 text-margin-400 border-margin-500/20',
    neutral: 'bg-navy-700/60 text-surface-200/50 border-navy-700',
  }[color]
  return (
    <span
      title={detail}
      className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border cursor-default', colors)}
    >
      {label}
    </span>
  )
}

// ── Main response component ───────────────────────────────────────────────────
export function CopilotResponse({ result, question }) {
  if (!result) return null

  const { answer, evidence = [], unsupported, insufficient_data, offline } = result

  // State: offline / unavailable
  if (offline) {
    return (
      <div className="rounded-xl border border-navy-700 bg-navy-800 p-5">
        <div className="flex items-start gap-3">
          <WifiOff size={16} className="text-surface-200/40 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-surface-200/70 mb-1">Copilot Unavailable</p>
            <p className="text-sm text-surface-200/60">{answer}</p>
          </div>
        </div>
      </div>
    )
  }

  // State: unsupported capability
  if (unsupported) {
    return (
      <div className="rounded-xl border border-margin-500/30 bg-margin-500/5 p-5">
        <div className="flex items-start gap-3">
          <HelpCircle size={16} className="text-margin-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-margin-400 mb-1">Not Supported in This Release</p>
            <p className="text-sm text-surface-200/70">{answer}</p>
          </div>
        </div>
      </div>
    )
  }

  // State: insufficient data
  if (insufficient_data) {
    return (
      <div className="rounded-xl border border-navy-700 bg-navy-800 p-5">
        <div className="flex items-start gap-3">
          <Database size={16} className="text-surface-200/50 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-surface-200/60 mb-1">Insufficient Data</p>
            <p className="text-sm text-surface-200/70">{answer}</p>
          </div>
        </div>
      </div>
    )
  }

  // Normal answer
  return (
    <div className="space-y-4">
      {/* Question echo */}
      <div className="flex items-start justify-end">
        <div className="max-w-[80%] bg-gin-500/10 border border-gin-500/20 rounded-xl px-4 py-2.5">
          <p className="text-sm text-surface-50">{question}</p>
        </div>
      </div>

      {/* Answer */}
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-gin-500/20 border border-gin-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot size={13} className="text-gin-400" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="bg-navy-800 border border-navy-700 rounded-xl px-4 py-3">
            <p className="text-sm text-surface-50 leading-relaxed whitespace-pre-line">{answer}</p>
          </div>

          {/* Evidence cards */}
          {evidence.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-surface-200/40 mb-2 ml-1">
                Supporting Evidence
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {evidence.map((item, i) => (
                  <EvidenceCard key={i} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Evidence Used summary */}
          {evidence.length > 0 && <EvidenceUsedSummary evidence={evidence} />}
        </div>
      </div>
    </div>
  )
}

// ── Staged progress indicator ─────────────────────────────────────────────────
const STAGES = [
  'Understanding your question\u2026',
  'Retrieving PortIQ data\u2026',
  'Analyzing portfolio\u2026',
  'Generating response\u2026',
]

export function CopilotThinking({ question }) {
  const [stageIdx, setStageIdx] = React.useState(0)

  React.useEffect(() => {
    if (stageIdx >= STAGES.length - 1) return
    const t = setTimeout(() => setStageIdx(i => i + 1), 900)
    return () => clearTimeout(t)
  }, [stageIdx])

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-end">
        <div className="max-w-[80%] bg-gin-500/10 border border-gin-500/20 rounded-xl px-4 py-2.5">
          <p className="text-sm text-surface-50">{question}</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-gin-500/20 border border-gin-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot size={13} className="text-gin-400" />
        </div>
        <div className="bg-navy-800 border border-navy-700 rounded-xl px-4 py-3 space-y-2.5 min-w-[260px]">
          {STAGES.map((label, i) => {
            const done   = i < stageIdx
            const active = i === stageIdx
            return (
              <div key={label} className="flex items-center gap-2.5">
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                  {done ? (
                    <svg className="w-3.5 h-3.5 text-gin-400" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" fill="currentColor" fillOpacity="0.2"/>
                      <path d="M4 7l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : active ? (
                    <span className="w-2 h-2 rounded-full bg-gin-400 animate-pulse" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-navy-600" />
                  )}
                </div>
                <p className={cn(
                  'text-xs transition-colors duration-300',
                  done   ? 'text-gin-400/50 line-through decoration-gin-400/20' :
                  active ? 'text-surface-50 font-medium' :
                           'text-surface-200/25'
                )}>
                  {label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
