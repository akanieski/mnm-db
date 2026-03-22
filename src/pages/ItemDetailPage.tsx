import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
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

// ─── EQ-style palette (always dark, like an in-game window) ──────────────────
const C = {
  bg:       '#13100a',
  border:   '#7a5c28',
  divider:  '#3a2c14',
  nameGold: '#ffd700',
  namePlain:'#e8e0c8',
  flag:     '#ff9020',
  text:     '#d8d0a0',
  label:    '#887a54',
  dim:      '#4a4230',
  capture:  '#322a1c',
}

// ─── EQ stat helpers ──────────────────────────────────────────────────────────
type StatPair = [string, number | null | undefined]

function StatLine({ pairs, cols = 3 }: { pairs: StatPair[]; cols?: number }) {
  const active = pairs.filter(([, v]) => v != null && v !== 0)
  if (!active.length) return null
  const colW = cols === 2 ? '50%' : cols === 1 ? '100%' : '33.33%'
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {active.map(([label, value]) => (
        <span key={label} style={{ minWidth: colW, paddingRight: '0.5rem' }}>
          <span style={{ color: C.label }}>{label}: </span>
          <span style={{ color: C.text }}>
            {typeof value === 'number' && value > 0 ? `+${value}` : String(value)}
          </span>
        </span>
      ))}
    </div>
  )
}

function EQDivider() {
  return <div style={{ borderTop: `1px solid ${C.divider}`, margin: '0' }} />
}

function Section({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: '0.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>{children}</div>
}

function InfoLine({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <span style={{ color: C.label }}>{label}: </span>
      <span style={{ color: C.text }}>{value}</span>
    </div>
  )
}

// ─── EQ-style plain-text description for meta tags ────────────────────────────
function buildItemDescription(item: ItemDetail): string {
  const parts: string[] = []
  const flags = [
    item.no_drop ? 'NO DROP' : null,
    item.no_rent ? 'NO RENT' : null,
    item.magic   ? 'MAGIC'   : null,
    item.two_handed ? 'TWO-HANDED' : null,
  ].filter(Boolean) as string[]
  if (flags.length) parts.push(flags.join(', '))
  if (item.slots.length) parts.push(`Slot: ${item.slots.map(s => s.toUpperCase()).join(' ')}`)
  if (item.damage || item.delay) {
    const ratio = item.damage && item.delay ? ` (${(item.damage / item.delay).toFixed(2)}/s)` : ''
    parts.push(`Weapon DMG: ${item.damage ?? 0}  ATK Delay: ${item.delay ?? 0}${ratio}`)
    if (item.skill_weapon_hid) parts.push(`Skill: ${fmtSkill(item.skill_weapon_hid)}`)
  }
  if (item.ac) parts.push(`AC: ${item.ac}`)
  if (item.weight) parts.push(`Weight: ${item.weight.toFixed(1)}`)
  if (item.required_level) parts.push(`Required Level: ${item.required_level}`)

  const statPairs: [string, number | null][] = [
    ['STR', item.strength], ['STA', item.stamina], ['DEX', item.dexterity],
    ['AGI', item.agility], ['INT', item.intelligence], ['WIS', item.wisdom],
    ['CHA', item.charisma], ['HP', item.health], ['MP', item.mana],
    ['HP Regen', item.health_regen], ['MP Regen', item.mana_regen],
    ['Melee Haste', item.melee_haste], ['Ranged Haste', item.ranged_haste], ['Spell Haste', item.spell_haste],
    ['SV Ice', item.resist_ice], ['SV Fire', item.resist_fire], ['SV Elec', item.resist_electric],
    ['SV Magic', item.resist_magic], ['SV Corrupt', item.resist_corrupt],
    ['SV Poison', item.resist_poison], ['SV Disease', item.resist_disease], ['SV Holy', item.resist_holy],
    ['Might', item.might], ['Grace', item.grace], ['Swiftness', item.swiftness],
    ['Constitution', item.constitution], ['Discipline', item.discipline],
  ]
  const activeStats = statPairs
    .filter(([, v]) => v)
    .map(([label, v]) => `${label}: ${(v ?? 0) > 0 ? '+' : ''}${v}`)
  if (activeStats.length) parts.push(activeStats.join('  '))

  parts.push(`Class: ${decodeClasses(item.class_mask)}  Race: ${decodeRaces(item.race_mask)}`)
  return parts.join(' | ')
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
    <div className="max-w-md mx-auto px-4 py-8 space-y-4">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-8 w-64" />
      {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
    </div>
  )

  if (error || !item) return (
    <div className="max-w-md mx-auto px-4 py-8">
      <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <p className="text-sm text-muted-foreground">Item not found.</p>
    </div>
  )

  const flags = [
    item.no_drop    ? 'NO DROP'     : null,
    item.no_rent    ? 'NO RENT'     : null,
    item.magic      ? 'MAGIC ITEM'  : null,
    item.two_handed ? 'TWO-HANDED'  : null,
  ].filter(Boolean) as string[]

  const hasAttribs = !!(item.strength || item.stamina || item.dexterity || item.agility ||
    item.intelligence || item.wisdom || item.charisma || item.health || item.mana ||
    item.health_regen || item.mana_regen)
  const hasHaste    = !!(item.melee_haste || item.ranged_haste || item.spell_haste)
  const hasResists  = !!(item.resist_ice || item.resist_fire || item.resist_electric ||
    item.resist_magic || item.resist_corrupt || item.resist_poison ||
    item.resist_disease || item.resist_holy)
  const hasSecondary = !!(item.might || item.grace || item.swiftness ||
    item.constitution || item.discipline)
  const hasBard     = !!(item.brass_mod || item.percussion_mod || item.singing_mod ||
    item.string_mod || item.wind_mod)

  const description = item.has_stats
    ? buildItemDescription(item)
    : `${item.name} — stats not yet captured. Visit vendors or pick up this item in-game.`
  const pageTitle = `${item.name} — Monsters & Memories Item Database`

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
      </Helmet>

      <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 w-fit">
        <ArrowLeft className="w-4 h-4" /> All items
      </Link>

      {/* EQ-style item window */}
      <div style={{
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '0.8rem',
        backgroundColor: C.bg,
        border: `1px solid ${C.border}`,
        borderRadius: '4px',
        overflow: 'hidden',
        color: C.text,
      }}>
        {/* ── Header: icon + name ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.625rem 1rem',
          borderBottom: `1px solid ${C.divider}`,
          backgroundColor: '#0e0c07',
        }}>
          <div style={{ flexShrink: 0 }}>
            <ItemIcon hid={item.hid} iconId={item.icon_id} size={52} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              color: item.magic ? C.nameGold : C.namePlain,
              fontWeight: 'bold',
              fontSize: '0.9rem',
              lineHeight: 1.3,
            }}>
              {item.name}
            </div>
            {flags.length > 0 && (
              <div style={{ color: C.flag, fontSize: '0.72rem', marginTop: '0.15rem', letterSpacing: '0.03em' }}>
                {flags.join('  ')}
              </div>
            )}
          </div>
        </div>

        {!item.has_stats ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: C.dim }}>
            Stats not yet captured.<br />
            <span style={{ fontSize: '0.72rem' }}>Visit vendors or pick up this item in-game.</span>
          </div>
        ) : (
          <>
            {/* ── Lore / description ── */}
            {item.description && (
              <>
                <div style={{ padding: '0.5rem 1rem', fontStyle: 'italic', color: '#b8aa78', lineHeight: 1.5 }}>
                  {item.description}
                </div>
                <EQDivider />
              </>
            )}
            {/* ── Core stats ── */}
            <Section>
              {item.slots.length > 0 && (
                <InfoLine label="Slot" value={item.slots.map(s => s.toUpperCase()).join(' ')} />
              )}
              {(item.damage || item.delay) && (
                <div>
                  {item.damage != null && <><span style={{ color: C.label }}>Weapon DMG: </span><span style={{ color: C.text }}>{item.damage}</span><span style={{ color: C.dim }}>  </span></>}
                  {item.delay  != null && <><span style={{ color: C.label }}>ATK Delay: </span><span style={{ color: C.text }}>{item.delay}</span><span style={{ color: C.dim }}>  </span></>}
                  {item.damage && item.delay && (
                    <span style={{ color: C.dim }}>({(item.damage / item.delay).toFixed(2)}/s)</span>
                  )}
                </div>
              )}
              {item.skill_weapon_hid && ((item.slot_mask ?? 0) & 0b111) !== 0 && !((item.slot_mask ?? 0) & 2 && item.ac) && (
                <InfoLine label="Skill" value={fmtSkill(item.skill_weapon_hid)} />
              )}
              {(item.ac || item.weight || item.size_hid) && (
                <div>
                  {item.ac     != null && <><span style={{ color: C.label }}>AC: </span><span style={{ color: C.text }}>{item.ac}</span><span style={{ color: C.dim }}>  </span></>}
                  {item.weight != null && <><span style={{ color: C.label }}>WT: </span><span style={{ color: C.text }}>{item.weight.toFixed(1)}</span><span style={{ color: C.dim }}>  </span></>}
                  {item.size_hid && <><span style={{ color: C.label }}>Size: </span><span style={{ color: C.text }}>{fmtSize(item.size_hid)}</span></>}
                </div>
              )}
              {item.required_level != null && item.required_level > 0 && (
                <InfoLine label="Required Level" value={item.required_level} />
              )}
            </Section>

            {/* ── Attribute / stat lines ── */}
            {(hasAttribs || hasHaste || hasResists || hasSecondary || hasBard) && (
              <>
                <EQDivider />
                <Section>
                  <StatLine pairs={[
                    ['STR', item.strength], ['STA', item.stamina], ['DEX', item.dexterity],
                    ['AGI', item.agility],  ['INT', item.intelligence], ['WIS', item.wisdom],
                    ['CHA', item.charisma], ['HP',  item.health],  ['MANA', item.mana],
                  ]} />
                  <StatLine pairs={[
                    ['HP Regen', item.health_regen], ['Mana Regen', item.mana_regen],
                  ]} cols={2} />
                  <StatLine pairs={[
                    ['Melee Haste', item.melee_haste],
                    ['Ranged Haste', item.ranged_haste],
                    ['Spell Haste', item.spell_haste],
                  ]} cols={2} />
                  <StatLine pairs={[
                    ['SV Ice', item.resist_ice],    ['SV Fire', item.resist_fire],
                    ['SV Elec', item.resist_electric], ['SV Magic', item.resist_magic],
                    ['SV Corrupt', item.resist_corrupt], ['SV Poison', item.resist_poison],
                    ['SV Disease', item.resist_disease], ['SV Holy', item.resist_holy],
                  ]} />
                  <StatLine pairs={[
                    ['Might', item.might], ['Grace', item.grace], ['Swiftness', item.swiftness],
                    ['Constitution', item.constitution], ['Discipline', item.discipline],
                  ]} />
                  {hasBard && <StatLine pairs={[
                    ['Brass', item.brass_mod], ['Percussion', item.percussion_mod],
                    ['Singing', item.singing_mod], ['String', item.string_mod], ['Wind', item.wind_mod],
                  ]} />}
                </Section>
              </>
            )}

            {/* ── Class / Race ── */}
            <EQDivider />
            <Section>
              <InfoLine label="Class" value={decodeClasses(item.class_mask)} />
              <InfoLine label="Race"  value={decodeRaces(item.race_mask)} />
            </Section>
          </>
        )}
      </div>

      {/* HID + capture timestamp below the panel */}
      <div style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: '0.68rem', color: C.capture, marginTop: '0.4rem' }}>
        <span>{item.hid}</span>
        {item.scanned_at && (
          <span style={{ marginLeft: '1rem' }}>
            captured {new Date(item.scanned_at).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  )
}
