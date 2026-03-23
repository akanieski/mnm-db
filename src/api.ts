import type { ItemSummary, ItemDetail, FilterType, SpellSummary } from './types'

const BASE = '/api'

export async function fetchItems(q: string, type: FilterType): Promise<ItemSummary[]> {
  const params = new URLSearchParams({ limit: '500' })
  if (q) params.set('q', q)
  if (type !== 'all') params.set('type', type)
  const res = await fetch(`${BASE}/items?${params}`)
  const data = await res.json()
  return data.items
}

export async function fetchItem(hid: string): Promise<ItemDetail> {
  const res = await fetch(`${BASE}/items/${encodeURIComponent(hid)}`)
  if (!res.ok) throw new Error('Not found')
  return res.json()
}

export async function fetchStats(): Promise<{
  total: number; withStats: number; weapons: number; armor: number
}> {
  const res = await fetch(`${BASE}/stats`)
  return res.json()
}

export async function fetchSpells(params: Record<string, string>): Promise<{ spells: SpellSummary[]; total: number }> {
  const p = new URLSearchParams({ limit: '200', ...params })
  const res = await fetch(`${BASE}/spells?${p}`)
  if (!res.ok) throw new Error('Failed to fetch spells')
  return res.json()
}

export async function fetchSpell(hid: string): Promise<SpellSummary> {
  const res = await fetch(`${BASE}/spells/${encodeURIComponent(hid)}`)
  if (!res.ok) throw new Error('Not found')
  return res.json()
}
