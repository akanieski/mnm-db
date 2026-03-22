import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Sword, Shield, Package, Sparkles, ArrowUpDown } from 'lucide-react'
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
  const [searchParams, setSearchParams] = useSearchParams()

  // URL params: ?q=&f=all&sort=ratio&skill=sla&slot=Chest
  const query       = searchParams.get('q') ?? ''
  const filter      = (searchParams.get('f') ?? 'all') as FilterType
  const sortRatio   = searchParams.get('sort') === 'ratio'
  const skillFilter = searchParams.get('skill')
  const slotFilter  = searchParams.get('slot')

  // Helper: patch one param without clobbering others
  const setParam = useCallback((key: string, value: string | null) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    }, { replace: true })
  }, [setSearchParams])

  const setQuery       = (v: string)           => setParam('q', v || null)
  const setFilter      = (v: FilterType)        => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (v === 'all') { next.delete('f') } else { next.set('f', v) }
      // Clear sub-filters when main filter changes
      next.delete('sort'); next.delete('skill'); next.delete('slot')
      return next
    }, { replace: true })
  }
  const setSortRatio   = (on: boolean)          => setParam('sort', on ? 'ratio' : null)
  const setSkillFilter = (v: string | null)     => setParam('skill', v)
  const setSlotFilter  = (v: string | null)     => setParam('slot', v)

  const [items, setItems]     = useState<ItemSummary[]>([])
  const [stats, setStats]     = useState<{ total: number; withStats: number } | null>(null)
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

  // Derive available skills / slots from fetched items
  const availableSkills = useMemo(() => {
    const skills = new Set<string>()
    items.forEach(i => { if (i.skill_weapon_hid) skills.add(i.skill_weapon_hid) })
    return Array.from(skills).sort()
  }, [items])

  const availableSlots = useMemo(() => {
    const slots = new Set<string>()
    items.forEach(i => i.slots.forEach(s => slots.add(s)))
    const order = ['Head','Face','Ear','Neck','Shoulders','Chest','Back','Shirt',
                   'Hands','Wrist','Finger','Waist','Legs','Feet','Primary','Secondary','Ranged','Ammo']
    return order.filter(s => slots.has(s))
  }, [items])

  // Apply client-side sub-filters + sort
  const displayItems = useMemo(() => {
    let list = items
    if (skillFilter) list = list.filter(i => i.skill_weapon_hid === skillFilter)
    if (slotFilter)  list = list.filter(i => i.slots.includes(slotFilter))
    if (sortRatio) {
      list = [...list].sort((a, b) => {
        const ra = (a.damage && a.delay) ? a.damage / a.delay : 0
        const rb = (b.damage && b.delay) ? b.damage / b.delay : 0
        return rb - ra
      })
    }
    return list
  }, [items, skillFilter, slotFilter, sortRatio])

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
        <div className="flex gap-1.5 flex-wrap">
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
          {filter === 'weapon' && (
            <button
              onClick={() => setSortRatio(!sortRatio)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ml-auto
                ${sortRatio
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort by Ratio
            </button>
          )}
        </div>

        {/* Weapon skill sub-filter */}
        {filter === 'weapon' && availableSkills.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            <span className="text-xs text-muted-foreground self-center">Skill:</span>
            {availableSkills.map(skill => (
              <button
                key={skill}
                onClick={() => setSkillFilter(skillFilter === skill ? null : skill)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors
                  ${skillFilter === skill
                    ? 'bg-secondary text-secondary-foreground ring-1 ring-secondary-foreground/20'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
              >
                {skill.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {/* Armor slot sub-filter */}
        {filter === 'armor' && availableSlots.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            <span className="text-xs text-muted-foreground self-center">Slot:</span>
            {availableSlots.map(slot => (
              <button
                key={slot}
                onClick={() => setSlotFilter(slotFilter === slot ? null : slot)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors
                  ${slotFilter === slot
                    ? 'bg-secondary text-secondary-foreground ring-1 ring-secondary-foreground/20'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
              >
                {slot}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground mb-2 px-1">
        {loading ? 'Loading…' : `${displayItems.length} items${sortRatio ? ' · sorted by ratio' : ''}`}
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
          : displayItems.map(item => <ItemRow key={item.hid} item={item} />)
        }
      </div>
    </div>
  )
}
