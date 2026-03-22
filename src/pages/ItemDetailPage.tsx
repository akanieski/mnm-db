import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchItem } from '@/api'
import type { ItemDetail } from '@/types'
import { ItemIcon } from '@/components/ItemIcon'

// ─── Class / Race decoding ────────────────────────────────────────────────────
const CLASS_BITS = ['ARC', 'BRD', 'BST', 'FTR', 'INQ', 'PAL', 'RNG', 'ROG', 'SHD', 'SPB', 'WIZ']
const RACE_BITS  = ['HUM', 'DWF', 'ELF', 'GNM', 'HLF', 'GBL', 'OGR', 'ASH', 'RAT']
const ALL_CLASS_MASK = (1 << CLASS_BITS.length) - 1
const ALL_RACE_MASK  = (1 << RACE_BITS.length) - 1

function decodeClasses(mask: number | null): string {
  if (!mask || mask === 0 || mask >= ALL_CLASS_MASK) return 'ALL'
  return CLASS_BITS.filter((_, i) => mask & (1 << i)).join(' ')
}
function decodeRaces(mask: number | null): string {
  if (!mask || mask === 0 || mask >= ALL_RACE_MASK) return 'ALL'
  return RACE_BITS.filter((_, i) => mask & (1 << i)).join(' ')
}
function fmtSkill(hid: string | null): string {
  if (!hid) return ''
  return hid.replace(/_/g, ' ').toUpperCase()
}
function fmtSize(hid: string | null): string {
  if (!hid) return ''
  return hid.replace(/_?(item|size)?_?/gi, '').toUpperCase() || hid.toUpperCase()
}

// ─── Row helpers ──────────────────────────────────────────────────────────────
function InlineStats({ pairs }: { pairs: [string, number | null][] }) {
  const active = pairs.filter(([, v]) => v)
  if (!active.length) return null
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
      {active.map(([label, value]) => (
        <span key={label}>
          <span className="text-muted-foreground">{label}: </span>
          <span className="font-mono font-medium">{(value ?? 0) > 0 ? `+${value}` : value}</span>
        </span>
      ))}
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-x-8 gap-y-0.5 items-baseline">{children}</div>
}

function Cell({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="text-sm">
      <span className="text-muted-foreground">{label}: </span>
      <span className="font-medium">{value}</span>
    </span>
  )
}

function LabelRow({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div className="text-sm">
      <span className="text-muted-foreground">{label}: </span>
      <span className="font-medium tracking-wide">{value}</span>
    </div>
  )
}

function Divider() {
  return <div className="border-t border-border/40 my-3" />
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ItemDetailPage() {
  const { hid } = useParams<{ hid: string }>()
  const [item, setItem]       = useState<ItemDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!hid) return
    setLoading(true)
    setError(null)
    fetchItem(hid)
      .then(setItem)
      .catch(() => setError('Item not found'))
      .finally(() => setLoading(false))
  }, [hid])

  if (loading) return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-4">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-8 w-64" />
      {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
    </div>
  )

  if (error || !item) return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <p className="text-sm text-muted-foreground">Item not found.</p>
    </div>
  )

  const flags = [
    item.no_drop  ? 'NO DROP'  : null,
    item.no_rent  ? 'NO RENT'  : null,
    item.magic    ? 'MAGIC'    : null,
    item.two_handed ? 'TWO-HANDED' : null,
  ].filter(Boolean) as string[]

  const hasAttribs = item.strength || item.stamina || item.dexterity || item.agility ||
    item.intelligence || item.wisdom || item.charisma || item.health || item.mana ||
    item.health_regen || item.mana_regen
  const hasHaste   = item.melee_haste || item.ranged_haste || item.spell_haste
  const hasResists = item.resist_ice || item.resist_fire || item.resist_electric ||
    item.resist_magic || item.resist_corrupt || item.resist_poison ||
    item.resist_disease || item.resist_holy
  const hasSecondary = item.might || item.grace || item.swiftness ||
    item.constitution || item.discipline
  const hasBard    = item.brass_mod || item.percussion_mod || item.singing_mod ||
    item.string_mod || item.wind_mod

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 w-fit">
        <ArrowLeft className="w-4 h-4" /> All items
      </Link>

      {/* Name + flags */}
      <div className="flex items-center gap-4 mb-1">
        <ItemIcon hid={item.hid} iconId={item.icon_id} size={64} />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{item.name}</h1>
          {flags.length > 0 && (
            <p className="text-xs text-muted-foreground tracking-widest mt-0.5">{flags.join('  ')}</p>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground/50 font-mono mb-4">{item.hid}</p>

      {!item.has_stats ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Stats not yet captured. Visit vendors or pick up this item in-game to collect data.
        </p>
      ) : (
        <div className="space-y-2.5">

          {/* Slot */}
          {item.slots.length > 0 && (
            <LabelRow label="Slot" value={item.slots.map(s => s.toUpperCase()).join(' ')} />
          )}

          {/* Weapon stats */}
          {(item.damage || item.delay) ? (
            <Row>
              {item.damage ? <Cell label="Weapon DMG" value={item.damage} /> : null}
              {item.delay  ? <Cell label="ATK Delay"  value={item.delay}  /> : null}
              {item.skill_weapon_hid ? <Cell label="Skill" value={fmtSkill(item.skill_weapon_hid)} /> : null}
            </Row>
          ) : null}

          {/* Armor */}
          {item.ac ? <Cell label="AC" value={item.ac} /> : null}

          {/* Weight / Size */}
          <Row>
            {item.weight ? <Cell label="Weight" value={item.weight.toFixed(1)} /> : null}
            {item.size_hid ? <Cell label="Size" value={fmtSize(item.size_hid)} /> : null}
          </Row>

          {/* Required level */}
          {item.required_level ? <Cell label="Required Level" value={item.required_level} /> : null}

          {(item.damage || item.delay || item.ac || item.slots.length > 0) &&
           (hasAttribs || hasHaste || hasResists || hasSecondary) && <Divider />}

          {/* Attributes */}
          {hasAttribs && (
            <InlineStats pairs={[
              ['STR', item.strength], ['STA', item.stamina], ['DEX', item.dexterity],
              ['AGI', item.agility], ['INT', item.intelligence], ['WIS', item.wisdom],
              ['CHA', item.charisma], ['HP', item.health], ['MP', item.mana],
              ['HP Regen', item.health_regen], ['MP Regen', item.mana_regen],
            ]} />
          )}

          {/* Haste */}
          <InlineStats pairs={[
            ['Melee Haste', item.melee_haste],
            ['Ranged Haste', item.ranged_haste],
            ['Spell Haste', item.spell_haste],
          ]} />

          {/* Resists */}
          {hasResists && (
            <InlineStats pairs={[
              ['SvIce', item.resist_ice], ['SvFire', item.resist_fire],
              ['SvElec', item.resist_electric], ['SvMagic', item.resist_magic],
              ['SvCorrupt', item.resist_corrupt], ['SvPoison', item.resist_poison],
              ['SvDisease', item.resist_disease], ['SvHoly', item.resist_holy],
            ]} />
          )}

          {/* Secondary stats */}
          {hasSecondary && (
            <InlineStats pairs={[
              ['Might', item.might], ['Grace', item.grace], ['Swiftness', item.swiftness],
              ['Constitution', item.constitution], ['Discipline', item.discipline],
            ]} />
          )}

          {/* Bard mods */}
          {hasBard && (
            <InlineStats pairs={[
              ['Brass', item.brass_mod], ['Percussion', item.percussion_mod],
              ['Singing', item.singing_mod], ['String', item.string_mod],
              ['Wind', item.wind_mod],
            ]} />
          )}

          <Divider />

          {/* Class / Race */}
          <LabelRow label="Class" value={decodeClasses(item.class_mask)} />
          <LabelRow label="Race"  value={decodeRaces(item.race_mask)} />

          {/* Captured timestamp */}
          {item.scanned_at && (
            <p className="text-xs text-muted-foreground/40 font-mono pt-1">
              captured {new Date(item.scanned_at).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
