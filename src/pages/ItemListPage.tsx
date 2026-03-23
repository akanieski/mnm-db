import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Sword, Shield, Package, Sparkles, ArrowUpDown, Trash2, SlidersHorizontal, ChevronDown, Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Helmet } from 'react-helmet-async'
import { ThemeToggle } from '@/components/ThemeToggle'
import { fetchItems, fetchStats } from '@/api'
import type { ItemSummary, FilterType } from '@/types'
import { ItemIcon } from '@/components/ItemIcon'

const FILTERS: { label: string; value: FilterType; icon: React.ReactNode }[] = [
  { label: 'All', value: 'all', icon: <Package className="w-3.5 h-3.5" /> },
  { label: 'Known', value: 'stats', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { label: 'Weapons', value: 'weapon', icon: <Sword className="w-3.5 h-3.5" /> },
  { label: 'Armor', value: 'armor', icon: <Shield className="w-3.5 h-3.5" /> },
]

const STAT_OPTIONS: { key: keyof ItemSummary; label: string }[] = [
  { key: 'strength',     label: 'STR' },
  { key: 'stamina',      label: 'STA' },
  { key: 'dexterity',    label: 'DEX' },
  { key: 'agility',      label: 'AGI' },
  { key: 'intelligence', label: 'INT' },
  { key: 'wisdom',       label: 'WIS' },
  { key: 'charisma',     label: 'CHA' },
  { key: 'health',       label: 'HP' },
  { key: 'mana',         label: 'Mana' },
  { key: 'ac',           label: 'AC' },
  { key: 'damage',       label: 'Damage' },
  { key: 'delay',        label: 'Delay' },
  { key: 'required_level', label: 'Req Level' },
  { key: 'weight',       label: 'Weight' },
]

interface StatFilter { stat: string; min: string; max: string }

// Deserialize stat filters from URL: "str:5:,int::10"
function parseStatFilters(raw: string | null): StatFilter[] {
  if (!raw) return []
  return raw.split(',').map(s => {
    const [stat, min = '', max = ''] = s.split(':')
    return { stat, min, max }
  }).filter(f => f.stat)
}

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
          <span className="text-xs text-muted-foreground truncate hidden"></span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 shrink-0 ml-4">
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

      {/* Mobile: show only the primary stat (damage/AC/weight) */}
      <div className="flex sm:hidden items-center shrink-0 ml-3">
        {primary && (
          <span className="text-xs text-muted-foreground font-mono text-right">
            {primary}
          </span>
        )}
        {!item.has_stats && (
          <span className="text-xs text-muted-foreground/30 italic">—</span>
        )}
      </div>
    </Link>
  )
}

export default function ItemListPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // URL params: ?q=&f=all&sort=ratio|ac&skill=sla&slot=Chest&sf=str:5:,int::10
  const query       = searchParams.get('q') ?? ''
  const filter      = (searchParams.get('f') ?? 'all') as FilterType
  const sort        = searchParams.get('sort')
  const sortRatio   = sort === 'ratio'
  const sortAc      = sort === 'ac'
  const skillFilter = searchParams.get('skill')
  const slotFilter  = searchParams.get('slot')
  // Local state for stat filters — instant reactivity (no URL round-trip on each keystroke)
  const [localStatFilters, setLocalStatFilters] = useState<StatFilter[]>(() => parseStatFilters(searchParams.get('sf')))

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
      // Toggle off if clicking the already-active filter (back to 'all')
      const active = (prev.get('f') ?? 'all') as FilterType
      const newVal = (active === v && v !== 'all') ? 'all' : v
      if (newVal === 'all') { next.delete('f') } else { next.set('f', newVal) }
      // Clear sub-filters when main filter changes
      next.delete('sort'); next.delete('skill'); next.delete('slot')
      return next
    }, { replace: true })
  }
  const setSortRatio   = (on: boolean)          => setParam('sort', on ? 'ratio' : null)
  const setSortAc      = (on: boolean)          => setParam('sort', on ? 'ac' : null)
  const setSkillFilter = (v: string | null)     => setParam('skill', v)
  const setSlotFilter  = (v: string | null)     => setParam('slot', v)
  const setStatFilters = (sf: StatFilter[]) => { setLocalStatFilters(sf) }

  const activeFilterCount = (filter !== 'all' ? 1 : 0) + (skillFilter ? 1 : 0) + (slotFilter ? 1 : 0) + (sort ? 1 : 0) + localStatFilters.length
  const hasActiveFilters  = activeFilterCount > 0 || !!query
  const clearFilters      = () => { setSearchParams({}, { replace: true }); setLocalStatFilters([]) }

  // Auto-open panel when filters are present (e.g. navigating back with URL params)
  const [filtersOpen, setFiltersOpen] = useState(() => activeFilterCount > 0)
  const [learnMoreOpen, setLearnMoreOpen] = useState(false)

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
    for (const sf of localStatFilters) {
      const min = sf.min !== '' ? Number(sf.min) : null
      const max = sf.max !== '' ? Number(sf.max) : null
      list = list.filter(i => {
        const v = Number((i as unknown as Record<string, unknown>)[sf.stat] ?? 0)
        if (min !== null && v < min) return false
        if (max !== null && v > max) return false
        return true
      })
    }
    if (sortRatio) {
      list = [...list].sort((a, b) => {
        const ra = (a.damage && a.delay) ? a.damage / a.delay : 0
        const rb = (b.damage && b.delay) ? b.damage / b.delay : 0
        return rb - ra
      })
    } else if (sortAc) {
      list = [...list].sort((a, b) => (b.ac ?? 0) - (a.ac ?? 0))
    }
    return list
  }, [items, skillFilter, slotFilter, sortRatio, sortAc, localStatFilters])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Helmet>
        <title>Monsters &amp; Memories Item Database</title>
        <meta name="description" content="Community-built item database for Monsters &amp; Memories. Browse weapons, armor, and gear with stats captured live from the game client." />
        <meta property="og:title" content="Monsters &amp; Memories Item Database" />
        <meta property="og:description" content="Community-built item database for Monsters &amp; Memories. Browse weapons, armor, and gear with stats captured live from the game client." />
        <meta name="twitter:title" content="Monsters &amp; Memories Item Database" />
        <meta name="twitter:description" content="Community-built item database for Monsters &amp; Memories. Browse weapons, armor, and gear with stats captured live from the game client." />
      </Helmet>
      {/* Sticky top panel */}
      <div className="max-w-3xl w-full mx-auto px-4 pt-8 pb-3 flex-shrink-0">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1
          className="text-xl font-semibold tracking-tight bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(to bottom, #D13301, #f39d00)', fontFamily: "'Cinzel', serif" }}
        >Monsters &amp; Memories</h1>
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
            <span>
              Item Database
              {stats && (
                <span className="ml-2 text-muted-foreground/60">
                  · {stats.withStats} items
                </span>
              )}
            </span>
            <button
              onClick={() => setLearnMoreOpen(true)}
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground underline underline-offset-2 transition-colors"
            >
              Learn More
            </button>
            <Link
              to="/spells"
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground underline underline-offset-2 transition-colors"
            >
              Spells
            </Link>
            <a
              href="https://github.com/akanieski/mnm-db/blob/master/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              Contribute
            </a>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/akanieski/mnm-db"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/60 hover:text-foreground transition-colors"
            aria-label="GitHub repository"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/>
            </svg>
          </a>
          <ThemeToggle />
        </div>
      </div>

      {/* Learn More Sheet */}
      <Sheet open={learnMoreOpen} onOpenChange={setLearnMoreOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-6">
          <SheetHeader>
            <SheetTitle className="text-base">About This Database</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              This is a community-built item database for{' '}
              <span className="text-foreground font-medium">Monsters &amp; Memories</span>. We have
              enormous respect for the Monsters &amp; Memories team and everything they are building
              — this project exists purely out of love for the game.
            </p>
            <p>
              Item data shown here is collected passively while playing the game. When the game
              client receives item information from the server, we intercept and record it locally.
              Over time, as more items are encountered in-game, the database grows.
            </p>
            <p className="border-l-2 border-yellow-500/50 pl-3 text-yellow-600 dark:text-yellow-400">
              <strong>Accuracy disclaimer:</strong> The data presented here may not be 100%
              accurate. We have made reasonable assumptions about the structure and meaning of the
              data sent from Monsters &amp; Memories servers, and some values may be misinterpreted
              or incomplete. Always treat this as a best-effort community resource, not an official
              reference.
            </p>
            <p>
              Item stats, names, icons, and other details are the intellectual property of
              the Monsters &amp; Memories team. This site is a fan project and is not affiliated
              with or endorsed by the Monsters &amp; Memories team.
            </p>
            <p>
              We welcome pull requests — especially improvements that keep the data clean and
              trustworthy (data hygiene, consistency fixes, missing fields, and quality/validation
              updates). If you'd like to help, please read our{' '}
              <a
                href="https://github.com/akanieski/mnm-db/blob/master/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground font-medium underline underline-offset-2 hover:text-primary transition-colors"
              >
                contribution guidelines
              </a>
              , and feel free to open a PR on the{' '}
              <a
                href="https://github.com/akanieski/mnm-db"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground font-medium underline underline-offset-2 hover:text-primary transition-colors"
              >
                GitHub repo
              </a>
              .
            </p>
            <div className="rounded-lg border border-indigo-500/40 bg-indigo-500/10 p-4 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                <svg role="img" viewBox="0 0 24 24" className="w-5 h-5 fill-indigo-400" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
                Feedback &amp; Feature Requests
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Have a suggestion, found a bug, or want to request a feature? Reach out on Discord!
              </p>
              <p className="text-sm font-mono font-semibold text-indigo-300 tracking-wide">
                @drew6788
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Search + Filters */}
      <div className="flex flex-col gap-2 mb-4">
        {/* Search row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search items…"
              className="pl-9"
              autoFocus
            />
          </div>
          {/* Filters toggle button */}
          <button
            onClick={() => setFiltersOpen(o => !o)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium border transition-colors
              ${filtersOpen || activeFilterCount > 0
                ? 'border-primary/50 bg-primary/5 text-primary'
                : 'border-border bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className={`w-3 h-3 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Collapsible filter panel */}
        {filtersOpen && (
          <div className="flex flex-col gap-2 p-3 rounded-lg border border-border bg-muted/30">
            {/* Type row */}
            <div className="flex gap-1.5 flex-wrap items-center">
              <span className="text-xs text-muted-foreground w-8 shrink-0">Type</span>
              <div className="flex gap-1.5 flex-wrap flex-1">
                {FILTERS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                      ${filter === f.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-muted-foreground border border-border hover:bg-muted/60'
                      }`}
                  >
                    {f.icon}{f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort row — weapons */}
            {filter === 'weapon' && (
              <div className="flex gap-1.5 flex-wrap items-center">
                <span className="text-xs text-muted-foreground w-8 shrink-0">Sort</span>
                <button
                  onClick={() => setSortRatio(!sortRatio)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                    ${sortRatio
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground border border-border hover:bg-muted/60'
                    }`}
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  Ratio
                </button>
              </div>
            )}

            {/* Sort row — armor */}
            {filter === 'armor' && (
              <div className="flex gap-1.5 flex-wrap items-center">
                <span className="text-xs text-muted-foreground w-8 shrink-0">Sort</span>
                <button
                  onClick={() => setSortAc(!sortAc)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                    ${sortAc
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground border border-border hover:bg-muted/60'
                    }`}
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  AC
                </button>
              </div>
            )}

            {/* Weapon skill sub-filter */}
            {filter === 'weapon' && availableSkills.length > 0 && (
              <div className="flex gap-1.5 flex-wrap items-center">
                <span className="text-xs text-muted-foreground w-8 shrink-0">Skill</span>
                {availableSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => setSkillFilter(skillFilter === skill ? null : skill)}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-mono font-medium transition-colors
                      ${skillFilter === skill
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-muted-foreground border border-border hover:bg-muted/60'
                      }`}
                  >
                    {skill.toUpperCase()}
                  </button>
                ))}
              </div>
            )}

            {/* Armor slot sub-filter */}
            {filter === 'armor' && availableSlots.length > 0 && (
              <div className="flex gap-1.5 flex-wrap items-center">
                <span className="text-xs text-muted-foreground w-8 shrink-0">Slot</span>
                {availableSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSlotFilter(slotFilter === slot ? null : slot)}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors
                      ${slotFilter === slot
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-muted-foreground border border-border hover:bg-muted/60'
                      }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}

            {/* Stat filters */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground w-8 shrink-0">Stats</span>
                <button
                  onClick={() => setStatFilters([...localStatFilters, { stat: STAT_OPTIONS[0].key, min: '', max: '' }])}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground border border-dashed border-border hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              {localStatFilters.map((sf, idx) => (
                <div key={idx} className="flex items-center gap-1.5 ml-10">
                  <select
                    value={sf.stat}
                    onChange={e => {
                      const next = localStatFilters.map((f, i) => i === idx ? { ...f, stat: e.target.value } : f)
                      setStatFilters(next)
                    }}
                    className="h-7 rounded border border-border bg-background px-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {STAT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
                  </select>
                  <input
                    type="number"
                    placeholder="min"
                    value={sf.min}
                    onChange={e => {
                      const next = localStatFilters.map((f, i) => i === idx ? { ...f, min: e.target.value } : f)
                      setStatFilters(next)
                    }}
                    className="w-16 h-7 rounded border border-border bg-background px-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <span className="text-xs text-muted-foreground">–</span>
                  <input
                    type="number"
                    placeholder="max"
                    value={sf.max}
                    onChange={e => {
                      const next = localStatFilters.map((f, i) => i === idx ? { ...f, max: e.target.value } : f)
                      setStatFilters(next)
                    }}
                    className="w-16 h-7 rounded border border-border bg-background px-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    onClick={() => setStatFilters(localStatFilters.filter((_, i) => i !== idx))}
                    className="p-0.5 rounded text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Clear all */}
            {hasActiveFilters && (
              <div className="flex pt-1 border-t border-border/50">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* end sticky top panel */}
      </div>

      {/* Scrollable results */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-3xl w-full mx-auto px-4 pb-8">

          {/* Count */}
          <p className="text-xs text-muted-foreground mb-2 px-1">
            {loading ? 'Loading…' : `${displayItems.length} items${sortRatio ? ' · sorted by ratio' : sortAc ? ' · sorted by AC' : ''}`}
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
      </div>
    </div>
  )
}
