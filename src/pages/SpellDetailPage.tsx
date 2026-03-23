import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchSpell } from '@/api'
import type { SpellSummary } from '@/types'
import { ItemIcon } from '@/components/ItemIcon'

const SCHOOL_NAMES: Record<string, string> = {
  alt: 'Alteration', abj: 'Abjuration', evo: 'Evocation', div: 'Divination',
  con: 'Conjuration', enc: 'Enchantment', nec: 'Necromancy', mgt: 'Might',
  mar: 'Martial', acr: 'Acrobatics', trc: 'Tracking', nul: '—',
}

const TARGET_NAMES: Record<string, string> = {
  slf: 'Self', all: 'Area', otr: 'Single', grp: 'Group', na: 'Any',
}

const CATEGORY_NAMES: Record<string, string> = {
  hrm: 'Harmful', ben: 'Beneficial', na: 'Utility',
}

const BOOK_TYPE_NAMES: Record<string, string> = {
  spl: 'Spell (Scroll)', int: 'Innate', skl: 'Skill', act: 'Active',
}

// ─── EQ-style palette (always dark) ──────────────────────────────────────────
const C = {
  bg:       '#13100a',
  border:   '#7a5c28',
  divider:  '#3a2c14',
  nameGold: '#ffd700',
  flag:     '#ff9020',
  text:     '#d8d0a0',
  label:    '#887a54',
  dim:      '#4a4230',
  capture:  '#322a1c',
}

function EQDivider() {
  return <div style={{ borderTop: `1px solid ${C.divider}`, margin: '0' }} />
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '0.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
      {children}
    </div>
  )
}

function InfoLine({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <span style={{ color: C.label }}>{label}: </span>
      <span style={{ color: C.text }}>{value}</span>
    </div>
  )
}

function FlagLine({ label }: { label: string }) {
  return <div style={{ color: C.flag, fontStyle: 'italic' }}>{label}</div>
}

function schoolLabel(spell: SpellSummary): string | null {
  if (!spell.school_hid || spell.school_hid === 'nul') return null
  return spell.school_name ?? SCHOOL_NAMES[spell.school_hid] ?? spell.school_hid
}

function castTimeLabel(ct: number | null): string {
  if (ct == null || ct === 0) return 'Instant'
  return `${ct}s`
}

export default function SpellDetailPage() {
  const { hid } = useParams<{ hid: string }>()
  const [spell, setSpell]     = useState<SpellSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!hid) return
    setLoading(true)
    setError(null)
    fetchSpell(hid)
      .then(setSpell)
      .catch(() => setError('Spell not found'))
      .finally(() => setLoading(false))
  }, [hid])

  if (loading) return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-4">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-8 w-64" />
      {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)}
    </div>
  )

  if (error || !spell) return (
    <div className="max-w-md mx-auto px-4 py-8">
      <Link to="/spells" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> All spells
      </Link>
      <p className="text-sm text-muted-foreground">Spell not found.</p>
    </div>
  )

  const school    = schoolLabel(spell)
  const category  = spell.category_hid ? (CATEGORY_NAMES[spell.category_hid] ?? spell.category_hid) : null
  const target    = spell.target_hid ? (TARGET_NAMES[spell.target_hid] ?? spell.target_hid) : null
  const bookType  = spell.book_type_hid ? (BOOK_TYPE_NAMES[spell.book_type_hid] ?? spell.book_type_hid) : null

  const pageTitle = `${spell.name} — Monsters & Memories Spell Database`
  const pageDesc  = spell.description ?? `${spell.name} — ${school ?? 'spell'}`

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
      </Helmet>

      <Link to="/spells" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 w-fit">
        <ArrowLeft className="w-4 h-4" /> All spells
      </Link>

      {/* EQ-style spell window */}
      <div style={{
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '0.8rem',
        backgroundColor: C.bg,
        border: `1px solid ${C.border}`,
        borderRadius: '4px',
        overflow: 'hidden',
        color: C.text,
      }}>
        {/* ── Header: name + icon ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.625rem 1rem',
          borderBottom: `1px solid ${C.divider}`,
          backgroundColor: '#0e0c07',
        }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              color: C.nameGold,
              fontWeight: 'bold',
              fontSize: '0.9rem',
              lineHeight: 1.3,
            }}>
              {spell.name}
            </div>
            {(school || category) && (
              <div style={{ color: C.flag, fontSize: '0.72rem', marginTop: '0.15rem', letterSpacing: '0.03em' }}>
                {[school, category].filter(Boolean).join('  ·  ')}
              </div>
            )}
          </div>
          <div style={{ flexShrink: 0, marginLeft: '0.75rem' }}>
            <ItemIcon hid={spell.hid} iconId={spell.icon_hid} size={48} />
          </div>
        </div>

        {/* ── Core info ── */}
        <Section>
          {spell.level != null && spell.level > 0 && (
            <InfoLine label="Level" value={spell.level} />
          )}
          {spell.mana_cost != null && (
            <InfoLine label="Mana Cost" value={spell.mana_cost} />
          )}
          <InfoLine label="Cast Time" value={castTimeLabel(spell.cast_time)} />
          {!!spell.cast_while_moving && (
            <InfoLine label="Cast While Moving" value="Yes" />
          )}
          {spell.cooldown != null && spell.cooldown > 0 && (
            <InfoLine label="Cooldown" value={`${spell.cooldown}s`} />
          )}
          {spell.global_cooldown != null && spell.global_cooldown !== 2.0 && spell.global_cooldown > 0 && (
            <InfoLine label="Global Cooldown" value={`${spell.global_cooldown}s`} />
          )}
          {spell.range != null && spell.range > 0 && (
            <InfoLine label="Range" value={spell.range} />
          )}
          {target && (
            <InfoLine label="Target" value={target} />
          )}
          {spell.resist_element_hid && spell.resist_element_hid !== 'nul' && (
            <InfoLine label="Resist" value={spell.resist_element_hid.toUpperCase()} />
          )}
          {spell.reagent_name && (
            <InfoLine label="Reagent" value={spell.reagent_name} />
          )}
          {spell.primary_skill_hid && spell.primary_skill_hid !== 'nul' && (
            <InfoLine label="Primary Skill" value={spell.primary_skill_hid.replace(/_/g, ' ')} />
          )}
        </Section>

        {/* ── Flags ── */}
        {(!!spell.no_interrupt || !!spell.can_fizzle || !!spell.is_toggle) && (
          <>
            <EQDivider />
            <Section>
              {!!spell.no_interrupt && <FlagLine label="NO INTERRUPT" />}
              {!!spell.can_fizzle   && <FlagLine label="CAN FIZZLE" />}
              {!!spell.is_toggle    && <FlagLine label="TOGGLE" />}
            </Section>
          </>
        )}

        {/* ── Description ── */}
        {spell.description && spell.description.trim() && (
          <>
            <EQDivider />
            <div style={{ padding: '0.5rem 1rem', fontStyle: 'italic', color: '#b8aa78', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {spell.description}
            </div>
          </>
        )}

        {/* ── Source ── */}
        {bookType && (
          <>
            <EQDivider />
            <Section>
              <InfoLine label="Source" value={bookType} />
            </Section>
          </>
        )}
      </div>

      {/* capture timestamp */}
      <div style={{ fontFamily: '"Courier New", Courier, monospace', fontSize: '0.68rem', color: C.capture, marginTop: '0.4rem' }}>
        {spell.scanned_at && (
          <span style={{ marginLeft: '1rem' }}>
            captured {new Date(spell.scanned_at).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  )
}
