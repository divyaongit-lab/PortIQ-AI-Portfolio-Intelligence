import { useRef } from 'react'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CopilotInput({ value, onChange, onSubmit, loading, disabled }) {
  const textareaRef = useRef(null)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!loading && value.trim()) onSubmit()
    }
  }

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a question about your portfolio… (Enter to send, Shift+Enter for new line)"
        rows={2}
        disabled={disabled || loading}
        className={cn(
          'w-full resize-none rounded-xl px-4 py-3 pr-14 text-sm',
          'bg-navy-900 border text-surface-50 placeholder-surface-200/30',
          'focus:outline-none focus:ring-1 focus:ring-gin-500 focus:border-gin-500/50',
          'transition-colors leading-relaxed',
          loading
            ? 'border-navy-700 opacity-60 cursor-not-allowed'
            : 'border-navy-700 hover:border-navy-600',
        )}
      />
      <button
        onClick={onSubmit}
        disabled={loading || !value.trim() || disabled}
        className={cn(
          'absolute right-3 bottom-3 w-8 h-8 rounded-lg flex items-center justify-center transition-all',
          loading || !value.trim()
            ? 'text-surface-200/20 cursor-not-allowed'
            : 'bg-gin-500 text-navy-950 hover:bg-gin-400 shadow-glow'
        )}
      >
        {loading ? (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
        ) : (
          <Send size={14} strokeWidth={2} />
        )}
      </button>
    </div>
  )
}
