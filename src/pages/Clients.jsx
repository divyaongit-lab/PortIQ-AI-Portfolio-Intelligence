import { useState, useMemo } from 'react'
import { getAllClientMetrics } from '@/data/calculations'
import { ClientSearch } from '@/components/clients/ClientSearch'
import { ClientTable }  from '@/components/clients/ClientTable'

export default function Clients() {
  const [search,  setSearch]  = useState('')
  const [sortKey, setSortKey] = useState('clientName')
  const [sortDir, setSortDir] = useState('asc')

  const allClients = useMemo(() => getAllClientMetrics(), [])

  const handleSort = (key) => {
    if (key === sortKey) { setSortDir(d => d === 'asc' ? 'desc' : 'asc') }
    else { setSortKey(key); setSortDir(['revenue','deliveryCost','grossProfit','grossMargin','activeProjects'].includes(key) ? 'desc' : 'asc') }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    let list = q ? allClients.filter(c => c.clientName.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.manager.toLowerCase().includes(q)) : allClients
    return [...list].sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey]
      if (typeof av === 'string') av = av.toLowerCase()
      if (typeof bv === 'string') bv = bv.toLowerCase()
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ?  1 : -1
      return 0
    })
  }, [allClients, search, sortKey, sortDir])

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h1 className="text-xl font-bold text-surface-50 tracking-tight">Clients</h1>
        <p className="text-xs text-surface-200/50 mt-1">{allClients.length} accounts · EUR · Prototype Mode</p>
      </div>
      <div className="bg-navy-800/60 border border-navy-700 rounded-xl px-4 py-3">
        <ClientSearch search={search} onSearch={setSearch} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} resultCount={filtered.length} />
      </div>
      <ClientTable clients={filtered} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
    </div>
  )
}
