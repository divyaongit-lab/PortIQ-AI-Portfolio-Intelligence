import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { formatCurrency } from '@/data/calculations'
import { SectionHeader } from '@/components/ui/SectionHeader'

const COLORS = { revenue:'#4ECDC4', grossProfit:'#F6C344', loss:'#F87171' }

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-900 border border-navy-600 rounded-xl px-4 py-3 shadow-xl text-xs">
      <p className="font-semibold text-surface-50 mb-2">{label}</p>
      {payload.map(entry => (
        <div key={entry.name} className="flex items-center justify-between gap-6 mb-1">
          <span className="flex items-center gap-1.5 text-surface-200/70">
            <span className="w-2 h-2 rounded-sm" style={{ background: entry.color }} />{entry.name}
          </span>
          <span className="font-mono font-semibold" style={{ color: entry.color }}>{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function ProjectTypeChart({ data, title, subtitle }) {
  const enriched = data.map(d => ({ ...d, profitColor: d.grossProfit < 0 ? COLORS.loss : COLORS.grossProfit }))
  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
      <SectionHeader title={title} subtitle={subtitle} className="mb-4" />
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={enriched} margin={{ top:4, right:4, left:0, bottom:4 }} barCategoryGap="30%" barGap={3}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1A2235" vertical={false} />
          <XAxis dataKey="type" tick={{ fill:'#94A3B8', fontSize:11 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={v => formatCurrency(v, true)} tick={{ fill:'#94A3B8', fontSize:10, fontFamily:'JetBrains Mono,monospace' }} axisLine={false} tickLine={false} width={52} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(78,205,196,0.05)' }} />
          <Legend wrapperStyle={{ fontSize:11, color:'#94A3B8', paddingTop:12 }} iconType="square" iconSize={8} />
          <Bar dataKey="revenue" name="Revenue" fill={COLORS.revenue} radius={[3,3,0,0]} />
          <Bar dataKey="grossProfit" name="Gross Profit" radius={[3,3,0,0]}>
            {enriched.map((entry, i) => <Cell key={i} fill={entry.profitColor} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
