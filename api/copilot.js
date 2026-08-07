// GinMar Copilot — Vercel Serverless Function
// POST /api/copilot
// Body: { question: string, context: object }
// The Anthropic API key never leaves the server.

export default async function handler(req, res) {
  // CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(503).json({
      error: 'AI service not configured',
      fallback: true,
      message: 'The Copilot AI service is not available right now. Please contact your administrator to configure the API key.',
    })
  }

  const { question, context } = req.body ?? {}
  if (!question?.trim()) return res.status(400).json({ error: 'Question is required' })

  // Build the system prompt — injects all GinMar calculated data as ground truth
  const systemPrompt = buildSystemPrompt(context)

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: question }],
      }),
    })

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text()
      console.error('Anthropic API error:', anthropicRes.status, err)
      return res.status(502).json({ error: 'AI service error', fallback: true })
    }

    const data = await anthropicRes.json()
    const text = data.content?.[0]?.text ?? ''

    // Parse structured response
    let parsed
    try {
      // Model is instructed to respond in JSON
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || [null, text]
      parsed = JSON.parse(jsonMatch[1] ?? text)
    } catch {
      // Fallback: treat as plain text answer
      parsed = { answer: text, evidence: [], unsupported: false }
    }

    return res.status(200).json(parsed)
  } catch (err) {
    console.error('Copilot handler error:', err)
    return res.status(502).json({ error: 'AI service unavailable', fallback: true })
  }
}

// ── System prompt builder ─────────────────────────────────────────────────────
// Injects the full calculated GinMar dataset so the LLM reasons over facts,
// not raw inputs. It is explicitly forbidden from inventing numbers.

function buildSystemPrompt(context) {
  const portfolioJson  = JSON.stringify(context?.portfolio  ?? {}, null, 2)
  const clientsJson    = JSON.stringify(context?.clients    ?? [], null, 2)
  const projectsJson   = JSON.stringify(context?.projects   ?? [], null, 2)

  return `You are PortIQ Copilot, a portfolio intelligence assistant for Delivery Directors, Portfolio Managers, and Business Unit Heads.

Your role is to answer business questions about the portfolio using ONLY the data provided below. You must never invent, estimate, or extrapolate financial figures beyond what is given.

GINMAR PORTFOLIO DATA (calculated, verified, use as ground truth):

PORTFOLIO KPIs:
${portfolioJson}

CLIENT METRICS:
${clientsJson}

PROJECT METRICS:
${projectsJson}

RESPONSE RULES:
1. Answer in concise, professional management language — as if briefing a Delivery Director.
2. Always cite specific client/project names and actual figures (revenue, cost, gross profit, margin %) from the data above.
3. If the data is insufficient to answer, say so clearly — do NOT invent numbers.
4. If the question asks for something not supported (forecasting, scenario simulation, modifying data), decline clearly and explain what IS supported.
5. Keep responses focused — 3–6 sentences for simple questions, structured paragraphs for comparisons.
6. For comparisons, always use a side-by-side structure with the actual figures.
7. Currency is EUR throughout.

SUPPORTED QUESTION TYPES:
- Portfolio health / issues / attention areas
- Client profitability and margin analysis
- Project-level performance and flags
- Client comparisons
- Top/bottom performers
- Explanation of why a client/project is loss-making

UNSUPPORTED (decline gracefully):
- Future forecasting or projections
- Scenario modelling
- Staffing or rate change recommendations
- Modifying any PortIQ data
- Questions about data not in the portfolio (e.g. competitor data, market rates)

RESPONSE FORMAT:
Respond ONLY with a JSON object in this exact structure (no markdown wrapper):
{
  "answer": "Your management-language answer here.",
  "evidence": [
    {
      "type": "client" | "project" | "portfolio",
      "name": "Entity name",
      "metrics": {
        "revenue": number_or_null,
        "deliveryCost": number_or_null,
        "grossProfit": number_or_null,
        "grossMargin": number_or_null
      },
      "note": "Optional one-line context"
    }
  ],
  "unsupported": false,
  "insufficient_data": false
}

If the question is unsupported, set "unsupported": true and explain in "answer".
If there is insufficient data, set "insufficient_data": true and explain in "answer".
Always populate "evidence" with the most relevant entities from the data, even for general questions.`
}
