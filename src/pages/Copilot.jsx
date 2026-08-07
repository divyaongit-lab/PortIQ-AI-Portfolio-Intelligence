import { useState } from 'react'
import {
  Sparkles, AlertTriangle, TrendingDown,
  Search, BarChart2, Briefcase, RotateCcw,
} from 'lucide-react'
import { askCopilot, SUGGESTED_QUESTIONS } from '@/lib/copilot'
import { CopilotInput }    from '@/components/copilot/CopilotInput'
import { CopilotResponse, CopilotThinking } from '@/components/copilot/CopilotResponse'
import { cn } from '@/lib/utils'

const ICON_MAP = {
  AlertTriangle, TrendingDown, Search, BarChart2, Briefcase,
}

export default function Copilot() {
  const [question, setQuestion] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [history, setHistory]   = useState([]) // {question, result}

  const handleSubmit = async () => {
    const q = question.trim()
    if (!q || loading) return
    setSubmitted(q)
    setQuestion('')
    setResult(null)
    setLoading(true)
    try {
      const res = await askCopilot(q)
      setResult(res)
      setHistory(prev => [{ question: q, result: res }, ...prev].slice(0, 10))
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestion = (label) => {
    setQuestion(label)
  }

  const handleReset = () => {
    setQuestion('')
    setSubmitted('')
    setResult(null)
  }

  const isEmpty = !loading && !result

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded-lg bg-gin-500/20 border border-gin-500/30 flex items-center justify-center">
              <Sparkles size={14} className="text-gin-400" />
            </div>
            <h1 className="text-xl font-bold text-surface-50 tracking-tight">PortIQ Copilot</h1>
          </div>
          <p className="text-xs text-surface-200/50 ml-9">
            Natural-language portfolio intelligence · Prototype Mode
          </p>
        </div>
        {(result || submitted) && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-surface-200/50 hover:text-surface-200 hover:bg-navy-700 border border-navy-700 transition-colors"
          >
            <RotateCcw size={11} />
            New question
          </button>
        )}
      </div>

      {/* Input area */}
      <div className="bg-navy-800/60 border border-navy-700 rounded-xl p-4 space-y-3">
        <CopilotInput
          value={question}
          onChange={setQuestion}
          onSubmit={handleSubmit}
          loading={loading}
          disabled={false}
        />
        <p className="text-[10px] text-surface-200/30 font-mono px-1">
          PortIQ Copilot answers using your portfolio data only. It does not modify data or make decisions.
        </p>
      </div>

      {/* Suggested questions — shown when idle */}
      {isEmpty && (
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-surface-200/40">
            Suggested questions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {SUGGESTED_QUESTIONS.map(sq => {
              const Icon = ICON_MAP[sq.icon] ?? Sparkles
              return (
                <button
                  key={sq.id}
                  onClick={() => handleSuggestion(sq.label)}
                  className={cn(
                    'flex items-start gap-3 px-4 py-3 rounded-xl text-left',
                    'bg-navy-800 border border-navy-700',
                    'hover:border-gin-500/40 hover:bg-gin-500/5',
                    'transition-all duration-150 group'
                  )}
                >
                  <Icon size={14} className="text-gin-400/60 group-hover:text-gin-400 mt-0.5 flex-shrink-0 transition-colors" strokeWidth={1.75} />
                  <span className="text-sm text-surface-200/70 group-hover:text-surface-50 transition-colors leading-snug">
                    {sq.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Capability disclaimer */}
          <div className="bg-navy-800/40 border border-navy-700/50 rounded-xl px-4 py-3">
            <p className="text-[11px] text-surface-200/40 leading-relaxed">
              <span className="text-surface-200/60 font-medium">Supported:</span> portfolio health, client profitability, project performance, comparisons, top/bottom performers, issue explanation.
              &nbsp;&nbsp;<span className="text-surface-200/60 font-medium">Not supported:</span> forecasting, scenario modelling, data modification.
            </p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && <CopilotThinking question={submitted} />}

      {/* Response */}
      {!loading && result && (
        <CopilotResponse result={result} question={submitted} />
      )}

      {/* History — previous questions in this session */}
      {!loading && !result && history.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-surface-200/40">
            Previous questions this session
          </p>
          {history.map((h, i) => (
            <div key={i} className="bg-navy-800/40 border border-navy-700/50 rounded-xl overflow-hidden">
              <button
                onClick={() => { setSubmitted(h.question); setResult(h.result) }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-navy-700/30 transition-colors"
              >
                <span className="text-xs text-surface-200/60 truncate pr-4">{h.question}</span>
                <span className="text-[10px] text-gin-400/60 flex-shrink-0">view →</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
