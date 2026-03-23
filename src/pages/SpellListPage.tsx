import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Helmet } from 'react-helmet-async'
import { ThemeToggle } from '@/components/ThemeToggle'
import { fetchSpells } from '@/api'
import type { SpellSummary } from '@/types'
import { ItemIcon } from '@/components/ItemIcon'

const SCHOOL_NAMES: Record<string, string> = {
  alt: 'Alteration', abj: 'Abjuration', evo: 'Evocation', div: 'Divination',
  con: 'Conjuration', enc: 'Enchantment', nec: 'Necromancy', mgt: 'Might',
  mar: 'Martial', acr: 'Acrobatics', trc: 'Tracking', nul: '—',
}

const BOOK_TYPES = [
  { label: 'All',    value: '' },
  { label: 'Spells', value: 'spl' },
  { label: 'Innate', value: 'int' },
  { label: 'Skills', value: 'skl' },
  { label: 'Active', value: 'act' },
]

const CATEGORIES = [
  { label: 'All',        value: '' },
  { label: 'Harmful',    value: 'hrm' },
  { label: 'Beneficial', value: 'ben' },
  { label: 'Utility',    value: 'na' },
]

function bookTypeBadge(bt: string | null) {
  switch (bt) {
    case 'spl': return <Badge className="text-[10px] px-1.5 py-0 bg-amber-600/20 text-amber-400 border-amber-600/30 border">Spell</Badge>
    case 'int': return <Badge className="text-[10px] px-1.5 py-0 bg-blue-600/20 text-blue-400 border-blue-600/30 border">Innate</Badge>
    case 'skl': return <Badge className="text-[10px] px-1.5 py-0 bg-purple-600/20 text-purple-400 border-purple-600/30 border">Skill</Badge>
    case 'act': return <Badge className="text-[10px] px-1.5 py-0 bg-green-600/20 text-green-400 border-green-600/30 border">Active</Badge>
    default: return null
  }
}

function categoryBadge(cat: string | null) {
  switch (cat) {
    case 'hrm': return <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Harmful</Badge>
    case 'ben': return <Badge className="text-[10px] px-1.5 py-0 bg-green-600/20 text-green-400 border-green-600/30 border">Beneficial</Badge>
    case 'na':  return <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Utility</Badge>
    default: return null
  }
}

function useDebounce<T>(value: T, ms: number): T {
  const [dv, setDv] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDv(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return dv
}

function SpellRow({ spell }: { spell: SpellSummary }) {
  const school = spell.school_name ?? (spell.school_hid ? (SCHOOL_NAMES[spell.school_hid] ?? spell.school_hid) : null)

  return (
    <Link
      to={`/spells/${encodeURIComponent(spell.hid)}`}
      className="flex items-center justify-between px-4 py-3 border-b border-border/50 hover:bg-muted/40 transition-colors group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <ItemIcon hid={spell.hid} iconId={spell.icon_hid} size={32} />
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium truncate group-hover:text-amber-400 transition-colors">
            {spell.name}
          </span>
          {school && (
            <span className="text-xs text-muted-foreground">{school}</span>
          )}
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 shrink-0 ml-4">
        {bookTypeBadge(spell.book_type_hid)}
        {categoryBadge(spell.category_hid)}
        {spell.mana_cost != null && (
          <span className="text-xs text-muted-foreground font-mono w-16 text-right">
            {spell.mana_cost} mana
          </span>
        )}
        {spell.cast_time != null && (
          <span className="text-xs text-muted-foreground font-mono w-12 text-right">
            {spell.cast_time === 0 ? 'instant' : `${spell.cast_time}s`}
          </span>
        )}
        {spell.level != null && spell.level > 0 && (
          <span className="text-xs text-muted-foreground font-mono w-10 text-right">
            Lv {spell.level}
          </span>
        )}
      </div>

      <div className="flex sm:hidden items-center shrink-0 ml-3 gap-1">
        {bookTypeBadge(spell.book_type_hid)}
      </div>
    </Link>
  )
}

export default function SpellListPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query    = searchParams.get('q') ?? ''
  const bookType = searchParams.get('bookType') ?? ''
  const school   = searchParams.get('school') ?? ''
  const category = searchParams.get('category') ?? ''

  const setParam = useCallback((key: string, value: string | null) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value)
      else next.delete(key)
      return next
    }, { replace: true })
  }, [setSearchParams])

  const [spells, setSpells] = useState<SpellSummary[]>([])
  const [total, setTotal]   = useState(0)
  const [loading, setLoading] = useState(true)

  const dq = useDebounce(query, 200)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (dq)       params.q        = dq
      if (bookType) params.bookType = bookType
      if (school)   params.school   = school
      if (category) params.skill    = category
      const data = await fetchSpells(params)
      setSpells(data.spells)
      setTotal(data.total)
    } catch {
      setSpells([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [dq, bookType, school, category])

  useEffect(() => { load() }, [load])

  // Derive available schools from results
  const availableSchools = useMemo(() => {
    const seen = new Map<string, string>()
    spells.forEach(s => {
      if (s.school_hid && s.school_hid !== 'nul') {
        const name = s.school_name ?? SCHOOL_NAMES[s.school_hid] ?? s.school_hid
        seen.set(s.school_hid, name)
      }
    })
    return Array.from(seen.entries()).sort((a, b) => a[1].localeCompare(b[1]))
  }, [spells])

  const displaySpells = useMemo(() => {
    let list = spells
    if (category) list = list.filter(s => s.category_hid === category)
    return list
  }, [spells, category])

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Helmet>
        <title>Monsters &amp; Memories Spell Database</title>
        <meta name="description" content="Community-built spell database for Monsters &amp; Memories." />
      </Helmet>

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
                Spell Database
                {total > 0 && (
                  <span className="ml-2 text-muted-foreground/60">· {total} spells</span>
                )}
              </span>
              <Link to="/" className="text-xs text-muted-foreground/50 hover:text-muted-foreground underline underline-offset-2 transition-colors">
                Items
              </Link>
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={e => setParam('q', e.target.value || null)}
              placeholder="Search spells…"
              className="pl-9"
              autoFocus
            />
          </div>

          {/* Book type tabs */}
          <div className="flex gap-1.5 flex-wrap">
            {BOOK_TYPES.map(bt => (
              <button
                key={bt.value}
                onClick={() => setParam('bookType', bt.value || null)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                  ${bookType === bt.value
                    ? 'bg-amber-600/80 text-white'
                    : 'bg-background text-muted-foreground border border-border hover:bg-muted/60'
                  }`}
              >
                {bt.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            {/* Category filter */}
            <div className="flex gap-1 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setParam('category', cat.value || null)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors
                    ${category === cat.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground border border-border hover:bg-muted/60'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* School dropdown */}
            {availableSchools.length > 0 && (
              <select
                value={school}
                onChange={e => setParam('school', e.target.value || null)}
                className="text-xs px-2 py-1.5 rounded-md border border-border bg-background text-muted-foreground hover:bg-muted/60 transition-colors"
              >
                <option value="">All Schools</option>
                {availableSchools.map(([hid, name]) => (
                  <option key={hid} value={hid}>{name}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl w-full mx-auto">
          {loading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
                <Skeleton className="w-8 h-8 rounded shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-14 hidden sm:block" />
              </div>
            ))
          ) : displaySpells.length === 0 ? (
            <div className="px-4 py-16 text-center text-sm text-muted-foreground">
              {query || bookType || school || category
                ? 'No spells match your search.'
                : 'No spell data yet. Check back soon!'}
            </div>
          ) : (
            displaySpells.map(spell => <SpellRow key={spell.hid} spell={spell} />)
          )}
        </div>
      </div>
    </div>
  )
}
