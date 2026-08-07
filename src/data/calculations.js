// GinMar · Calculation Engine — pure functions, single source of truth
import { CLIENTS, PROJECTS, STAFF, TIME_ENTRIES, EXPENSES, PROJECT_STAFF_RATES } from './seed'

// ── Helpers ───────────────────────────────────────────────────────────────────
const getBillingRate = (empId, projId) =>
  PROJECT_STAFF_RATES.find(r => r.empId === empId && r.projId === projId)?.billingRate ?? 0
const getCostRate = (empId) => STAFF.find(s => s.id === empId)?.costRate ?? 0
const getClient  = (clientId) => CLIENTS.find(c => c.id === clientId)
const getProject = (projId)   => PROJECTS.find(p => p.id === projId)

function round2(n) { return Math.round(n * 100) / 100 }
function round1(n) { return Math.round(n * 10)  / 10  }

function formatMonthLabel(yyyymm) {
  const [year, month] = yyyymm.split('-')
  return new Date(year, month - 1).toLocaleString('en-GB', { month: 'short', year: '2-digit' })
}

// ── Per-project ───────────────────────────────────────────────────────────────
export function calcProjectMetrics(projId) {
  const proj   = getProject(projId)
  const client = getClient(proj.clientId)

  const timeRevenue = TIME_ENTRIES.filter(t => t.projId === projId)
    .reduce((sum, t) => sum + t.billableHours * getBillingRate(t.empId, projId), 0)
  const expRevenue = EXPENSES.filter(e => e.projId === projId && e.billable)
    .reduce((sum, e) => sum + e.amount, 0)
  const revenue = timeRevenue + expRevenue

  const timeCost = TIME_ENTRIES.filter(t => t.projId === projId)
    .reduce((sum, t) => sum + t.hoursWorked * getCostRate(t.empId), 0)
  const expCost = EXPENSES.filter(e => e.projId === projId)
    .reduce((sum, e) => sum + e.amount, 0)
  const deliveryCost = timeCost + expCost
  const grossProfit  = revenue - deliveryCost
  const grossMargin  = revenue > 0 ? (grossProfit / revenue) * 100 : 0

  const totalHours    = TIME_ENTRIES.filter(t => t.projId === projId).reduce((s, t) => s + t.hoursWorked, 0)
  const billableHours = TIME_ENTRIES.filter(t => t.projId === projId).reduce((s, t) => s + t.billableHours, 0)
  const utilisation   = totalHours > 0 ? (billableHours / totalHours) * 100 : 0

  return {
    projectId: proj.id, projectName: proj.name,
    clientId: proj.clientId, clientName: client.name,
    industry: client.industry, country: client.country,
    projectType: proj.type, billingType: proj.billing,
    projectStatus: proj.status, startDate: proj.start, endDate: proj.end, manager: proj.manager,
    revenue: round2(revenue), deliveryCost: round2(deliveryCost),
    grossProfit: round2(grossProfit), grossMargin: round1(grossMargin),
    timeRevenue: round2(timeRevenue), expRevenue: round2(expRevenue),
    timeCost: round2(timeCost), expCost: round2(expCost),
    totalHours, billableHours, utilisation: round1(utilisation),
  }
}

export function getAllProjectMetrics() {
  return PROJECTS.map(p => calcProjectMetrics(p.id))
}

// ── Per-client rollup ─────────────────────────────────────────────────────────
export function getAllClientMetrics() {
  const projectMetrics = getAllProjectMetrics()
  return CLIENTS.map(client => {
    const projs   = projectMetrics.filter(p => p.clientId === client.id)
    const revenue = projs.reduce((s, p) => s + p.revenue, 0)
    const cost    = projs.reduce((s, p) => s + p.deliveryCost, 0)
    const gp      = revenue - cost
    const gm      = revenue > 0 ? (gp / revenue) * 100 : 0
    return {
      clientId: client.id, clientName: client.name,
      industry: client.industry, country: client.country,
      manager: client.manager, clientStatus: client.status,
      projectCount: projs.length,
      activeProjects: projs.filter(p => p.projectStatus === 'Active').length,
      revenue: round2(revenue), deliveryCost: round2(cost),
      grossProfit: round2(gp), grossMargin: round1(gm),
      projects: projs,
    }
  })
}

// ── Single client ─────────────────────────────────────────────────────────────
export function getClientById(clientId) {
  return getAllClientMetrics().find(c => c.clientId === clientId) ?? null
}

// ── Portfolio KPIs ────────────────────────────────────────────────────────────
export function getPortfolioKPIs() {
  const all = getAllProjectMetrics()
  const revenue      = all.reduce((s, p) => s + p.revenue, 0)
  const deliveryCost = all.reduce((s, p) => s + p.deliveryCost, 0)
  const grossProfit  = revenue - deliveryCost
  const grossMargin  = revenue > 0 ? (grossProfit / revenue) * 100 : 0
  const totalHrs     = all.reduce((s, p) => s + p.totalHours, 0)
  const billHrs      = all.reduce((s, p) => s + p.billableHours, 0)
  return {
    revenue: round2(revenue), deliveryCost: round2(deliveryCost),
    grossProfit: round2(grossProfit), grossMargin: round1(grossMargin),
    activeProjects: PROJECTS.filter(p => p.status === 'Active').length,
    activeClients:  CLIENTS.filter(c => c.status === 'Active').length,
    avgUtilisation: round1(totalHrs > 0 ? (billHrs / totalHrs) * 100 : 0),
    totalBillableHrs: billHrs,
  }
}

// ── By project type ───────────────────────────────────────────────────────────
export function getMetricsByProjectType() {
  const all   = getAllProjectMetrics()
  const types = [...new Set(PROJECTS.map(p => p.type))]
  return types.map(type => {
    const projs   = all.filter(p => p.projectType === type)
    const revenue = projs.reduce((s, p) => s + p.revenue, 0)
    const cost    = projs.reduce((s, p) => s + p.deliveryCost, 0)
    const gp      = revenue - cost
    return { type, revenue: round2(revenue), deliveryCost: round2(cost), grossProfit: round2(gp), grossMargin: round1(revenue > 0 ? (gp/revenue)*100 : 0) }
  })
}

// ── Monthly trend ─────────────────────────────────────────────────────────────
export function getMonthlyTrend() {
  const monthMap = {}
  TIME_ENTRIES.forEach(t => {
    const m = t.date.slice(0, 7)
    if (!monthMap[m]) monthMap[m] = { revenue: 0, cost: 0 }
    monthMap[m].revenue += t.billableHours * getBillingRate(t.empId, t.projId)
    monthMap[m].cost    += t.hoursWorked   * getCostRate(t.empId)
  })
  EXPENSES.forEach(e => {
    const m = e.date.slice(0, 7)
    if (!monthMap[m]) monthMap[m] = { revenue: 0, cost: 0 }
    if (e.billable) monthMap[m].revenue += e.amount
    monthMap[m].cost += e.amount
  })
  return Object.entries(monthMap).sort(([a],[b]) => a.localeCompare(b)).map(([month, vals]) => {
    const gp = vals.revenue - vals.cost
    return { month, label: formatMonthLabel(month), revenue: round2(vals.revenue), deliveryCost: round2(vals.cost), grossProfit: round2(gp), grossMargin: vals.revenue > 0 ? round1((gp/vals.revenue)*100) : 0 }
  })
}

// ── Monthly trend for one client ──────────────────────────────────────────────
export function getMonthlyTrendForClient(clientId) {
  const clientProjIds = PROJECTS.filter(p => p.clientId === clientId).map(p => p.id)
  const monthMap = {}
  TIME_ENTRIES.filter(t => clientProjIds.includes(t.projId)).forEach(t => {
    const m = t.date.slice(0, 7)
    if (!monthMap[m]) monthMap[m] = { revenue: 0, cost: 0 }
    monthMap[m].revenue += t.billableHours * getBillingRate(t.empId, t.projId)
    monthMap[m].cost    += t.hoursWorked   * getCostRate(t.empId)
  })
  EXPENSES.filter(e => clientProjIds.includes(e.projId)).forEach(e => {
    const m = e.date.slice(0, 7)
    if (!monthMap[m]) monthMap[m] = { revenue: 0, cost: 0 }
    if (e.billable) monthMap[m].revenue += e.amount
    monthMap[m].cost += e.amount
  })
  return Object.entries(monthMap).sort(([a],[b]) => a.localeCompare(b)).map(([month, vals]) => {
    const gp = vals.revenue - vals.cost
    return { month, label: formatMonthLabel(month), revenue: round2(vals.revenue), deliveryCost: round2(vals.cost), grossProfit: round2(gp), grossMargin: vals.revenue > 0 ? round1((gp/vals.revenue)*100) : 0 }
  })
}

// ── Project type breakdown for one client ─────────────────────────────────────
export function getProjectTypeBreakdownForClient(clientId) {
  const projs = getAllProjectMetrics().filter(p => p.clientId === clientId)
  const typeMap = {}
  projs.forEach(p => {
    if (!typeMap[p.projectType]) typeMap[p.projectType] = { revenue:0, grossProfit:0, deliveryCost:0 }
    typeMap[p.projectType].revenue      += p.revenue
    typeMap[p.projectType].grossProfit  += p.grossProfit
    typeMap[p.projectType].deliveryCost += p.deliveryCost
  })
  return Object.entries(typeMap).map(([type, vals]) => ({ type, ...vals }))
}

// ── Top / Bottom clients ──────────────────────────────────────────────────────
export function getTopBottomClients(n = 3) {
  const all    = getAllClientMetrics().filter(c => c.revenue > 0)
  const sorted = [...all].sort((a, b) => b.grossMargin - a.grossMargin)
  return { top: sorted.slice(0, n), bottom: sorted.slice(-n).reverse() }
}

// ── Filtered project metrics ──────────────────────────────────────────────────
export function getFilteredProjectMetrics(filters = {}) {
  let projects = getAllProjectMetrics()
  if (filters.year)        projects = projects.filter(p => p.startDate?.startsWith(filters.year) || p.endDate?.startsWith(filters.year))
  if (filters.clientId && filters.clientId !== 'all')     projects = projects.filter(p => p.clientId    === filters.clientId)
  if (filters.industry && filters.industry !== 'all')     projects = projects.filter(p => p.industry    === filters.industry)
  if (filters.country  && filters.country  !== 'all')     projects = projects.filter(p => p.country     === filters.country)
  if (filters.projectType && filters.projectType !== 'all') projects = projects.filter(p => p.projectType === filters.projectType)
  return projects
}

export function rollupMetrics(projectMetrics) {
  const revenue      = projectMetrics.reduce((s, p) => s + p.revenue, 0)
  const deliveryCost = projectMetrics.reduce((s, p) => s + p.deliveryCost, 0)
  const grossProfit  = revenue - deliveryCost
  const grossMargin  = revenue > 0 ? (grossProfit / revenue) * 100 : 0
  return { revenue: round2(revenue), deliveryCost: round2(deliveryCost), grossProfit: round2(grossProfit), grossMargin: round1(grossMargin) }
}

// ── Formatters ────────────────────────────────────────────────────────────────
export function formatCurrency(value, compact = false) {
  if (compact && Math.abs(value) >= 1000) return `€${(value/1000).toFixed(1)}k`
  return new Intl.NumberFormat('de-DE', { style:'currency', currency:'EUR', minimumFractionDigits:0, maximumFractionDigits:0 }).format(value)
}
export function formatMargin(value) { return `${value > 0 ? '+' : ''}${value.toFixed(1)}%` }
export function marginClass(value) { return value >= 30 ? 'high' : value >= 10 ? 'mid' : 'low' }

// ── Filter options ────────────────────────────────────────────────────────────
export function getFilterOptions() {
  return {
    years:        [...new Set(PROJECTS.map(p => p.start.slice(0, 4)))].sort(),
    clients:      CLIENTS.filter(c => c.status === 'Active').map(c => ({ value: c.id, label: c.name })),
    industries:   [...new Set(CLIENTS.map(c => c.industry))].sort(),
    countries:    [...new Set(CLIENTS.map(c => c.country))].sort(),
    projectTypes: [...new Set(PROJECTS.map(p => p.type))].sort(),
  }
}
