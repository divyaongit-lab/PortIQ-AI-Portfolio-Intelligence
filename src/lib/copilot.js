// GinMar Copilot — Client-side orchestration layer
//
// This file is the ONLY place that knows about the Copilot API.
// It pulls data from calculations.js (source of truth) and sends it
// as context to /api/copilot. No API key is ever in client code.
//
// To swap in a different AI backend or add Supabase data:
// change only this file — not the UI or calculation engine.

import {
  getPortfolioKPIs,
  getAllClientMetrics,
  getAllProjectMetrics,
} from '@/data/calculations'

// ── Context builder ───────────────────────────────────────────────────────────
// Assembles the full GinMar calculated dataset into a clean context payload.
// The serverless function receives this and injects it into the LLM prompt.

function buildContext() {
  const portfolio = getPortfolioKPIs()
  const clients   = getAllClientMetrics().map(c => ({
    clientId:      c.clientId,
    clientName:    c.clientName,
    industry:      c.industry,
    country:       c.country,
    manager:       c.manager,
    clientStatus:  c.clientStatus,
    activeProjects:c.activeProjects,
    projectCount:  c.projectCount,
    revenue:       c.revenue,
    deliveryCost:  c.deliveryCost,
    grossProfit:   c.grossProfit,
    grossMargin:   c.grossMargin,
  }))
  const projects = getAllProjectMetrics().map(p => ({
    projectId:    p.projectId,
    projectName:  p.projectName,
    clientName:   p.clientName,
    projectType:  p.projectType,
    billingType:  p.billingType,
    projectStatus:p.projectStatus,
    revenue:      p.revenue,
    deliveryCost: p.deliveryCost,
    grossProfit:  p.grossProfit,
    grossMargin:  p.grossMargin,
    utilisation:  p.utilisation,
    billableHours:p.billableHours,
    totalHours:   p.totalHours,
  }))

  return { portfolio, clients, projects }
}

// ── Main ask function ─────────────────────────────────────────────────────────

export async function askCopilot(question) {
  const context = buildContext()

  try {
    const res = await fetch('/api/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: question.trim(), context }),
    })

    const data = await res.json()

    // Server-side fallback (no API key configured)
    if (data.fallback) {
      return {
        answer: data.message ?? 'The AI service is currently unavailable. Please try again later.',
        evidence: [],
        unsupported: false,
        insufficient_data: false,
        offline: true,
      }
    }

    if (!res.ok) throw new Error(data.error ?? 'Unknown error')

    return {
      answer:            data.answer            ?? '',
      evidence:          data.evidence          ?? [],
      unsupported:       data.unsupported       ?? false,
      insufficient_data: data.insufficient_data ?? false,
      offline:           false,
    }
  } catch (err) {
    console.error('[PortIQ Copilot]', err)
    return {
      answer: 'PortIQ Copilot is temporarily unavailable. Your portfolio data is unaffected — please use the Portfolio Analysis and Clients screens.',
      evidence: [],
      unsupported: false,
      insufficient_data: false,
      offline: true,
    }
  }
}

// ── Suggested questions ───────────────────────────────────────────────────────
// These are discovery prompts shown on the empty state of the Copilot page.

export const SUGGESTED_QUESTIONS = [
  {
    id: 'q1',
    label: 'Which projects need my attention and why?',
    icon: 'AlertTriangle',
  },
  {
    id: 'q2',
    label: 'Which clients have the lowest gross margins?',
    icon: 'TrendingDown',
  },
  {
    id: 'q3',
    label: 'Why is Nova Utilities loss-making?',
    icon: 'Search',
  },
  {
    id: 'q4',
    label: 'Compare Alpha Manufacturing and Nova Utilities.',
    icon: 'BarChart2',
  },
  {
    id: 'q5',
    label: 'What are the key issues across my portfolio?',
    icon: 'Briefcase',
  },
]
