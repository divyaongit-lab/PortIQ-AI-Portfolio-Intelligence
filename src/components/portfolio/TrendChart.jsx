import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { formatCurrency } from '@/data/calculations'
import { SectionHeader } from '@/components/ui/SectionHeader'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 shadow-xl text-xs">
      <p className="font-semibold text-surface-50 mb-2">{label}</p>
      {payload.map(entry => (
        <div key={entry.name} className="flex items-center justify-between gap-6 mb-1">
          <span className="flex items-center gap-1.5 text-surface-200/70">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />{entry.name}
          </span>
          <span className="font-mono font-semibold" style={{ color: entry.color }}>{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function TrendChart({ data, title, subtitle }) {
  const hasLoss = data.some(d => d.grossProfit < 0)
  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
      <SectionHeader title={title} subtitle={subtitle} className="mb-4" />
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top:4, right:4, left:0, bottom:4 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F6C344" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#F6C344" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1A2235" vertical={false} />
          <XAxis dataKey="label" tick={{ fill:'#94A3B8', fontSize:11 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={v => formatCurrency(v, true)} tick={{ fill:'#94A3B8', fontSize:10, fontFamily:'JetBrains Mono,monospace' }} axisLine={false} tickLine={false} width={52} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke:'#4ECDC4', strokeWidth:1, strokeDasharray:'4 4' }} />
          <Legend wrapperStyle={{ fontSize:11, color:'#94A3B8', paddingTop:12 }} iconType="circle" iconSize={7} />
          {hasLoss && <ReferenceLine y={0} stroke="#F87171" strokeDasharray="4 4" strokeOpacity={0.5} />}
          <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#4ECDC4" strokeWidth={2} fill="url(#revenueGrad)" dot={{ fill:'#4ECDC4', r:3, strokeWidth:0 }} activeDot={{ r:5, strokeWidth:0 }} />
          <Area type="monotone" dataKey="grossProfit" name="Gross Profit" stroke="#F6C344" strokeWidth={2} fill="url(#profitGrad)" dot={{ fill:'#F6C344', r:3, strokeWidth:0 }} activeDot={{ r:5, strokeWidth:0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
