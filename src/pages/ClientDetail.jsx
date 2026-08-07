import { useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Building2, MapPin, User, AlertTriangle } from 'lucide-react'
import {
  getClientById, getMonthlyTrendForClient, getProjectTypeBreakdownForClient,
  formatCurrency, formatMargin,
} from '@/data/calculations'
import { KpiCard }          from '@/components/ui/KpiCard'
import { SectionHeader }    from '@/components/ui/SectionHeader'
import { ProjectTypeChart } from '@/components/portfolio/ProjectTypeChart'
import { TrendChart }       from '@/components/portfolio/TrendChart'
import { ProjectTable }     from '@/components/portfolio/ProjectTable'

export default function ClientDetail() {
  const { clientId } = useParams()
  const navigate     = useNavigate()
  const client   = useMemo(() => getClientById(clientId), [clientId])
  const trend    = useMemo(() => getMonthlyTrendForClient(clientId), [clientId])
  const typeData = useMemo(() => getProjectTypeBreakdownForClient(clientId), [clientId])

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Building2 size={40} className="text-navy-600" strokeWidth={1} />
        <p className="text-surface-200/50 text-sm">Client not found.</p>
        <button onClick={() => navigate('/clients')} className="text-xs text-gin-400 hover:text-gin-300 underline underline-offset-2">Back to Clients</button>
      </div>
    )
  }

  const hasLoss    = client.grossMargin < 0
  const hasRevenue = client.revenue > 0
  const noProjects = client.projects.length === 0

  return (
    <div className="space-y-6 pb-8">
      {/* Breadcrumb + header */}
      <div>
        <nav className="flex items-center gap-2 text-[11px] text-surface-200/40 mb-3">
          <Link to="/clients" className="hover:text-gin-400 transition-colors">Clients</Link>
          <span>/</span>
          <span className="text-surface-200/70">{client.clientName}</span>
        </nav>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <button onClick={() => navigate('/clients')} className="mt-1 w-8 h-8 rounded-lg flex items-center justify-center text-surface-200/50 hover:bg-navy-700 hover:text-surface-50 border border-navy-700 transition-colors flex-shrink-0">
              <ArrowLeft size={14} strokeWidth={1.75} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-surface-50 tracking-tight leading-tight">{client.clientName}</h1>
              <div className="flex items-center flex-wrap gap-3 mt-2">
                <span className="flex items-center gap-1.5 text-[11px] text-surface-200/50"><Building2 size={11} strokeWidth={1.75} />{client.industry}</span>
                <span className="flex items-center gap-1.5 text-[11px] text-surface-200/50"><MapPin size={11} strokeWidth={1.75} />{client.country}</span>
                <span className="flex items-center gap-1.5 text-[11px] text-surface-200/50"><User size={11} strokeWidth={1.75} />{client.manager}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${client.clientStatus === 'Active' ? 'bg-gin-500/15 text-gin-400' : 'bg-surface-200/10 text-surface-200/40'}`}>{client.clientStatus}</span>
              </div>
            </div>
          </div>
          {hasRevenue && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border flex-shrink-0 ${hasLoss ? 'bg-loss-500/10 text-loss-400 border-loss-500/30' : client.grossMargin >= 30 ? 'bg-gin-500/10 text-gin-400 border-gin-500/30' : 'bg-margin-500/10 text-margin-400 border-margin-500/30'}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              {formatMargin(client.grossMargin)} margin
            </div>
          )}
        </div>
      </div>

      {hasLoss && (
        <div className="flex items-center gap-3 px-4 py-3 bg-loss-500/10 border border-loss-500/30 rounded-xl">
          <AlertTriangle size={16} className="text-loss-400 flex-shrink-0" />
          <p className="text-xs text-loss-400"><span className="font-semibold">Margin alert:</span> This account is currently loss-making ({formatMargin(client.grossMargin)}). Delivery costs exceed billed revenue.</p>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Revenue"       value={hasRevenue ? formatCurrency(client.revenue) : '—'}       subValue={`${client.projectCount} project${client.projectCount !== 1 ? 's' : ''}`} accent="teal" size="lg" />
        <KpiCard label="Delivery Cost" value={hasRevenue ? formatCurrency(client.deliveryCost) : '—'} subValue="Staff + expenses" accent="neutral" />
        <KpiCard label="Gross Profit"  value={hasRevenue ? formatCurrency(client.grossProfit) : '—'}  accent={!hasRevenue ? 'neutral' : client.grossProfit >= 0 ? 'amber' : 'red'} trend={!hasRevenue ? undefined : client.grossProfit >= 0 ? 'up' : 'down'} />
        <KpiCard label="Gross Margin"  value={hasRevenue ? `${client.grossMargin.toFixed(1)}%` : '—'} subValue={!hasRevenue ? 'No revenue yet' : client.grossMargin >= 30 ? 'Healthy margin' : client.grossMargin >= 10 ? 'Below target' : client.grossMargin < 0 ? 'Loss-making' : 'Low margin'} accent={!hasRevenue ? 'neutral' : client.grossMargin >= 30 ? 'teal' : client.grossMargin >= 10 ? 'amber' : 'red'} trend={!hasRevenue ? undefined : client.grossMargin >= 30 ? 'up' : client.grossMargin < 0 ? 'down' : 'neutral'} />
      </div>

      {noProjects ? (
        <div className="flex flex-col items-center justify-center py-16 bg-navy-800 border border-navy-700 rounded-xl">
          <Building2 size={32} className="text-navy-600 mb-3" strokeWidth={1} />
          <p className="text-sm text-surface-200/40">No projects on this account yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {trend.length > 0
              ? <TrendChart data={trend} title="Revenue & Profit Trend" subtitle="Monthly — based on time entry and expense dates" />
              : <PlaceholderChart title="Revenue Trend" />}
            {typeData.length > 0
              ? <ProjectTypeChart data={typeData} title="Revenue & Profit by Project Type" subtitle="Gross profit shown in amber — red indicates a loss" />
              : <PlaceholderChart title="Revenue by Project Type" />}
          </div>
          <div>
            <div className="mb-3">
              <SectionHeader title="Projects" subtitle={`${client.activeProjects} active · ${client.projectCount} total`} />
            </div>
            <ProjectTable projects={client.projects} />
          </div>
        </>
      )}
    </div>
  )
}

function PlaceholderChart({ title }) {
  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 flex flex-col h-[290px]">
      <SectionHeader title={title} />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-xs text-surface-200/30">No data available.</p>
      </div>
    </div>
  )
}
