// Combined server — Express API + Vite (dev) or static (prod)
import express from 'express'
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import type { ViteDevServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = process.env.DATABASE_PATH ?? path.join(__dirname, 'mnm_gamedata.db')
const IS_PROD = process.env.NODE_ENV === 'production'
const PORT = Number(process.env.PORT) || 5173
const DIST = path.join(__dirname, 'dist')

const db = new Database(DB_PATH, { readonly: true })
const app = express()
app.use(express.json())

// ─── Slot helpers ─────────────────────────────────────────────────────────────
const SLOT_NAMES: Record<number, string> = {
  1:       'Primary',
  2:       'Secondary',
  4:       'Ranged',
  8:       'Ammo',
  16:      'Ear',
  32:      'Ear',
  64:      'Neck',
  128:     'Face',
  256:     'Head',
  512:     'Finger',
  1024:    'Finger',
  2048:    'Wrist',
  4096:    'Wrist',
  8192:    'Shirt',
  16384:   'Hands',
  32768:   'Shoulders',
  65536:   'Chest',
  131072:  'Back',
  262144:  'Waist',
  524288:  'Legs',
  1048576: 'Feet',
}

function slotsFromMask(mask: number): string[] {
  return Object.entries(SLOT_NAMES)
    .filter(([bit]) => mask & Number(bit))
    .map(([, name]) => name)
}

// ─── Vite dev server (created before routes so all handlers can use it) ───────
let vite: ViteDevServer | undefined
if (!IS_PROD) {
  const { createServer: createViteServer } = await import('vite')
  vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom', // we handle the HTML fallthrough ourselves
  })
  app.use(vite.middlewares)
}

// ─── API ──────────────────────────────────────────────────────────────────────

// GET /api/items?q=sword&type=weapon&limit=100
app.get('/api/items', (req, res) => {
  const q = (req.query.q as string || '').trim()
  const type = req.query.type as string || ''
  const limit = Math.min(Number(req.query.limit) || 200, 500)

  // Union icons + item_stats HIDs so items captured live but not in icons are included
  let sql = `
    WITH all_hids AS (
      SELECT hid FROM icons
      UNION
      SELECT hid FROM item_stats
    )
    SELECT
      ah.hid,
      COALESCE(s.name, ah.hid) AS name,
      s.item_type,
      s.slot_mask,
      s.required_level,
      s.damage,
      s.delay,
      s.ac,
      s.weight,
      s.strength, s.stamina, s.dexterity, s.agility,
      s.intelligence, s.wisdom, s.charisma,
      s.health, s.mana, s.icon_id,
      s.skill_weapon_hid,
      CASE WHEN s.hid IS NOT NULL THEN 1 ELSE 0 END AS has_stats
    FROM all_hids ah
    LEFT JOIN item_stats s ON ah.hid = s.hid
    WHERE 1=1
  `
  const params: (string | number)[] = []

  if (q) {
    sql += ` AND (ah.hid LIKE ? OR COALESCE(s.name, ah.hid) LIKE ?)`
    params.push(`%${q}%`, `%${q}%`)
  }

  if (type === 'weapon') {
    sql += ` AND s.damage > 0`
  } else if (type === 'armor') {
    sql += ` AND s.ac > 0`
  } else if (type === 'stats') {
    sql += ` AND s.hid IS NOT NULL`
  }

  sql += ` ORDER BY has_stats DESC, COALESCE(s.name, ah.hid) LIMIT ?`
  params.push(limit)

  const rows = db.prepare(sql).all(...params) as Record<string, unknown>[]
  const items = rows.map(r => ({
    ...r,
    slots: slotsFromMask(Number(r.slot_mask) || 0),
  }))

  res.json({ items, total: items.length })
})

// GET /api/items/:hid
app.get('/api/items/:hid', (req, res) => {
  const hid = req.params.hid

  const stats = db.prepare(`SELECT * FROM item_stats WHERE hid = ?`).get(hid) as Record<string, unknown> | undefined
  const icon  = db.prepare(`SELECT * FROM icons WHERE hid = ?`).get(hid) as Record<string, unknown> | undefined

  if (!icon && !stats) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  const item = {
    hid,
    name: stats?.name ?? hid,
    has_stats: !!stats,
    slots: slotsFromMask(Number(stats?.slot_mask) || 0),
    ...(stats || {}),
    icon_data: icon,
  }

  res.json(item)
})

// GET /api/stats — summary counts
app.get('/api/stats', (_req, res) => {
  const total   = (db.prepare(`SELECT COUNT(*) as n FROM (SELECT hid FROM icons UNION SELECT hid FROM item_stats)`).get() as {n:number}).n
  const withStats = (db.prepare(`SELECT COUNT(*) as n FROM item_stats`).get() as {n:number}).n
  const weapons = (db.prepare(`SELECT COUNT(*) as n FROM item_stats WHERE damage > 0`).get() as {n:number}).n
  const armor   = (db.prepare(`SELECT COUNT(*) as n FROM item_stats WHERE ac > 0`).get() as {n:number}).n
  res.json({ total, withStats, weapons, armor })
})

// ─── SSR meta tag injection ───────────────────────────────────────────────────
// Class / race bit arrays (mirrors ItemDetailPage.tsx)
const CLASS_BITS = ['ARC', 'BRD', 'BST', 'FTR', 'INQ', 'PAL', 'RNG', 'ROG', 'SHD', 'SPB', 'WIZ']
const RACE_BITS  = ['HUM', 'DWF', 'ELF', 'GNM', 'HLF', 'GBL', 'OGR', 'ASH', 'RAT']
const ALL_CLASS_MASK = (1 << CLASS_BITS.length) - 1
const ALL_RACE_MASK  = (1 << RACE_BITS.length) - 1

function decodeClasses(mask: number | null | undefined): string {
  const n = Number(mask ?? 0)
  if (!n || n >= ALL_CLASS_MASK) return 'ALL'
  return CLASS_BITS.filter((_, i) => n & (1 << i)).join(' ')
}
function decodeRaces(mask: number | null | undefined): string {
  const n = Number(mask ?? 0)
  if (!n || n >= ALL_RACE_MASK) return 'ALL'
  return RACE_BITS.filter((_, i) => n & (1 << i)).join(' ')
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildDescription(item: Record<string, unknown>): string {
  const parts: string[] = []
  const flags = [
    item.no_drop   ? 'NO DROP'    : null,
    item.no_rent   ? 'NO RENT'    : null,
    item.magic     ? 'MAGIC'      : null,
    item.two_handed ? 'TWO-HANDED' : null,
  ].filter(Boolean) as string[]
  if (flags.length) parts.push(flags.join(', '))

  const slots = slotsFromMask(Number(item.slot_mask) || 0)
  if (slots.length) parts.push(`Slot: ${slots.map(s => s.toUpperCase()).join(' ')}`)

  if (item.damage || item.delay) {
    const d = Number(item.damage ?? 0), dl = Number(item.delay ?? 0)
    const ratio = d && dl ? ` (${(d / dl).toFixed(2)}/s)` : ''
    parts.push(`Weapon DMG: ${d}  ATK Delay: ${dl}${ratio}`)
  }
  if (item.ac)             parts.push(`AC: ${item.ac}`)
  if (item.weight)         parts.push(`Weight: ${Number(item.weight).toFixed(1)}`)
  if (item.required_level) parts.push(`Required Level: ${item.required_level}`)

  const statDefs: [string, unknown][] = [
    ['STR', item.strength], ['STA', item.stamina], ['DEX', item.dexterity],
    ['AGI', item.agility], ['INT', item.intelligence], ['WIS', item.wisdom],
    ['CHA', item.charisma], ['HP', item.health], ['MP', item.mana],
    ['HP Regen', item.health_regen], ['MP Regen', item.mana_regen],
    ['Melee Haste', item.melee_haste], ['Ranged Haste', item.ranged_haste],
    ['SvIce', item.resist_ice], ['SvFire', item.resist_fire],
    ['SvElec', item.resist_electric], ['SvMagic', item.resist_magic],
    ['SvCorrupt', item.resist_corrupt], ['SvPoison', item.resist_poison],
    ['SvDisease', item.resist_disease], ['SvHoly', item.resist_holy],
    ['Might', item.might], ['Grace', item.grace], ['Swiftness', item.swiftness],
    ['Constitution', item.constitution], ['Discipline', item.discipline],
  ]
  const activeStats = statDefs
    .filter(([, v]) => v)
    .map(([label, v]) => `${label}: ${Number(v) > 0 ? '+' : ''}${v}`)
  if (activeStats.length) parts.push(activeStats.join('  '))

  parts.push(`Class: ${decodeClasses(item.class_mask as number)}  Race: ${decodeRaces(item.race_mask as number)}`)
  return parts.join(' | ')
}

function buildMetaTags(item: Record<string, unknown> | null, hid: string): string {
  const name  = escHtml((item?.name as string) || hid)
  const title = `${name} — Monsters &amp; Memories Item Database`
  const desc  = item
    ? escHtml(buildDescription(item))
    : escHtml(`${(item as Record<string,unknown> | null)?.name as string || hid} — stats not yet captured. Visit vendors or pick up this item in-game.`)
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${desc}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${desc}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
  ].join('\n    ')
}

const HOME_META = [
  `<title>Monsters &amp; Memories Item Database</title>`,
  `<meta name="description" content="Community-built item database for Monsters &amp; Memories. Browse weapons, armor, and gear with stats captured live from the game client." />`,
  `<meta property="og:type" content="website" />`,
  `<meta property="og:title" content="Monsters &amp; Memories Item Database" />`,
  `<meta property="og:description" content="Community-built item database for Monsters &amp; Memories. Browse weapons, armor, and gear with stats captured live from the game client." />`,
  `<meta name="twitter:card" content="summary" />`,
  `<meta name="twitter:title" content="Monsters &amp; Memories Item Database" />`,
  `<meta name="twitter:description" content="Community-built item database for Monsters &amp; Memories. Browse weapons, armor, and gear with stats captured live from the game client." />`,
].join('\n    ')

async function renderHtml(url: string, metaTags: string): Promise<string> {
  let html: string
  if (IS_PROD) {
    html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8')
  } else {
    html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8')
    html = await vite!.transformIndexHtml(url, html)
  }
  html = html.replace('<!-- SSR_META -->', metaTags)
  return html
}

// HTML route for item pages — serves SSR-injected meta tags
app.get('/items/:hid', async (req, res, next) => {
  try {
    const { hid } = req.params
    const item = db.prepare(`SELECT * FROM item_stats WHERE hid = ?`).get(hid) as Record<string, unknown> | undefined
    const metaTags = buildMetaTags(item ?? null, hid)
    const html = await renderHtml(req.url, metaTags)
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    next(e)
  }
})

// ─── SPA fallthrough ──────────────────────────────────────────────────────────
if (IS_PROD) {
  app.use(express.static(DIST))
  app.use(express.static(path.join(__dirname, 'public')))
  app.use((_req, res) => {
    let html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8')
    html = html.replace('<!-- SSR_META -->', HOME_META)
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  })
} else {
  // Dev: serve all other routes through Vite's HTML transform
  app.use(async (req, res, next) => {
    try {
      let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8')
      html = await vite!.transformIndexHtml(req.url, html)
      html = html.replace('<!-- SSR_META -->', HOME_META)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      next(e)
    }
  })
}

app.listen(PORT, () => console.log(`Server → http://localhost:${PORT}`))
