import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, Sword, Shield, Package, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchItems, fetchStats } from '@/api'
import type { ItemSummary, FilterType } from '@/types'
import { ItemIcon } from '@/components/ItemIcon'

const FILTERS: { label: string; value: FilterType; icon: React.ReactNode }[] = [
  { label: 'All', value: 'all', icon: <Package className="w-3.5 h-3.5" /> },
  { label: 'Known', value: 'stats', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { label: 'Weapons', value: 'weapon', icon: <Sword className="w-3.5 h-3.5" /> },
  { label: 'Armor', value: 'armor', icon: <Shield className="w-3.5 h-3.5" /> },
]

function useDebounce<T>(value: T, ms: number): T {
  const [dv, setDv] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDv(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return dv
}

function ItemRow({ item }: { item: ItemSummary }) {
  const ratio = (item.damage && item.delay)
    ? (item.damage / item.delay).toFixed(2)
    : null

  const primary = item.damage
    ? `${item.damage}/${item.delay}${ratio ? ` (${ratio})` : ''}`
    : item.ac ? `AC ${item.ac}`
    : item.weight ? `${item.weight.toFixed(1)} wt`
    : null

  const statBits = [
    item.strength && `STR ${item.strength}`,
    item.stamina && `STA ${item.stamina}`,
    item.dexterity && `DEX ${item.dexterity}`,
    item.agility && `AGI ${item.agility}`,
    item.intelligence && `INT ${item.intelligence}`,
    item.wisdom && `WIS ${item.wisdom}`,
    item.health && `HP ${item.health}`,
    item.mana && `MP ${item.mana}`,
  ].filter(Boolean).slice(0, 4)

  return (
    <Link
      to={`/items/${encodeURIComponent(item.hid)}`}
      className="flex items-center justify-between px-4 py-3 border-b border-border/50 hover:bg-muted/40 transition-colors group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <ItemIcon hid={item.hid} iconId={item.icon_id} size={32} />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
            {item.name}
          </span>
          <span className="text-xs text-muted-foreground truncate">{item.hid}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-4">
        {statBits.map(s => (
          <Badge key={s!} variant="secondary" className="text-xs font-mono px-1.5 py-0">
            {s}
          </Badge>
        ))}
        {primary && (
          <span className="text-xs text-muted-foreground font-mono w-28 text-right">
            {primary}
          </span>
        )}
        {!item.has_stats && (
          <span className="text-xs text-muted-foreground/40 italic">no data</span>
        )}
        {item.slots.length > 0 && (
          <span className="text-xs text-muted-foreground/60 w-16 text-right truncate">
            {item.slots[0]}
          </span>
        )}
      </div>
    </Link>
  )
}

export default function ItemListPage() {
  const [query, setQuery]   = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [items, setItems]   = useState<ItemSummary[]>([])
  const [stats, setStats]   = useState<{ total: number; withStats: number } | null>(null)
  const [loading, setLoading] = useState(true)

  const dq = useDebounce(query, 200)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchItems(dq, filter)
      setItems(data)
    } finally {
      setLoading(false)
    }
  }, [dq, filter])

  useEffect(() => { load() }, [load])
  useEffect(() => { fetchStats().then(setStats) }, [])

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight">Monsters &amp; Memories</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Item Database
          {stats && (
            <span className="ml-2 text-muted-foreground/60">
              · {stats.withStats} / {stats.total} items with stats
            </span>
          )}
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search items…"
            className="pl-9"
            autoFocus
          />
        </div>
        <div className="flex gap-1.5">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                ${filter === f.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
            >
              {f.icon}{f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground mb-2 px-1">
        {loading ? 'Loading…' : `${items.length} items`}
      </p>

      {/* List */}
      <div className="rounded-lg border border-border overflow-hidden">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24 ml-auto" />
              </div>
            ))
          : items.length === 0
          ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No items found
            </div>
          )
          : items.map(item => <ItemRow key={item.hid} item={item} />)
        }
      </div>
    </div>
  )
}
