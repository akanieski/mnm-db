// Combined server — Express API + Vite (dev) or static (prod)
import express from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { load as yamlLoad } from 'js-yaml'
import chokidar from 'chokidar'
import type { ViteDevServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ITEMS_DIR  = path.join(__dirname, 'data', 'items')
const SPELLS_DIR = path.join(__dirname, 'data', 'spells')
const IS_PROD = process.env.NODE_ENV === 'production'
const PORT = Number(process.env.PORT) || 5173
const DIST = path.join(__dirname, 'dist')

const app = express()
app.use(express.json())

// ─── In-memory data store ─────────────────────────────────────────────────────
type ItemRow   = Record<string, unknown>
type SpellRow  = Record<string, unknown>

const itemsMap  = new Map<string, ItemRow>()
const spellsMap = new Map<string, SpellRow>()

function loadYamlFile<T extends Record<string, unknown>>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    return yamlLoad(raw) as T
  } catch {
    return null
  }
}

function loadDir(dir: string, map: Map<string, Record<string, unknown>>) {
  if (!fs.existsSync(dir)) return
  for (const fname of fs.readdirSync(dir)) {
    if (!fname.endsWith('.yaml')) continue
    const d = loadYamlFile(path.join(dir, fname))
    if (d?.hid) map.set(d.hid as string, d)
  }
}

// Initial load
loadDir(ITEMS_DIR,  itemsMap)
loadDir(SPELLS_DIR, spellsMap)
console.log(`[data] Loaded ${itemsMap.size} items, ${spellsMap.size} spells from YAML`)

// Watch for changes from daemon (skip in prod)
if (!IS_PROD) {
  chokidar.watch(ITEMS_DIR, { ignoreInitial: true }).on('add', f => {
    const d = loadYamlFile(f); if (d?.hid) itemsMap.set(d.hid as string, d)
  }).on('change', f => {
    const d = loadYamlFile(f); if (d?.hid) itemsMap.set(d.hid as string, d)
  })
  chokidar.watch(SPELLS_DIR, { ignoreInitial: true }).on('add', f => {
    const d = loadYamlFile(f); if (d?.hid) spellsMap.set(d.hid as string, d)
  }).on('change', f => {
    const d = loadYamlFile(f); if (d?.hid) spellsMap.set(d.hid as string, d)
  })
}


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
  const q        = (req.query.q as string || '').trim().toLowerCase()
  const type     = req.query.type as string || ''
  const limit    = Math.min(Number(req.query.limit) || 200, 500)

  let results = Array.from(itemsMap.values())

  if (q) results = results.filter(r =>
    ((r.hid as string) || '').toLowerCase().includes(q) ||
    ((r.name as string) || '').toLowerCase().includes(q)
  )

  if (type === 'weapon') results = results.filter(r => Number(r.damage) > 0)
  else if (type === 'armor')  results = results.filter(r => Number(r.ac) > 0)

  results.sort((a, b) => ((a.name as string) || '').localeCompare((b.name as string) || ''))
  results = results.slice(0, limit)

  const items = results.map(r => ({
    ...r,
    has_stats: true,
    slots: slotsFromMask(Number(r.slot_mask) || 0),
  }))

  res.json({ items, total: items.length })
})

// GET /api/items/:hid
app.get('/api/items/:hid', (req, res) => {
  const hid = req.params.hid
  const stats = itemsMap.get(hid)

  if (!stats) {
    res.status(404).json({ error: 'Not found' })
    return
  }

  // If this is a scroll item, find the linked spell by name
  let linked_spell: Record<string, unknown> | null = null
  const itemName = (stats.name ?? hid) as string
  if (itemName.startsWith('Scroll: ')) {
    const spellName = itemName.slice(8)
    linked_spell = Array.from(spellsMap.values()).find(s => s.name === spellName) ?? null
  }

  res.json({
    ...stats,
    hid,
    has_stats: true,
    slots: slotsFromMask(Number(stats.slot_mask) || 0),
    linked_spell,
  })
})

// GET /api/stats — summary counts
app.get('/api/stats', (_req, res) => {
  const total     = itemsMap.size
  const withStats = itemsMap.size
  const weapons   = Array.from(itemsMap.values()).filter(r => Number(r.damage) > 0).length
  const armor     = Array.from(itemsMap.values()).filter(r => Number(r.ac) > 0).length
  const spells    = spellsMap.size
  res.json({ total, withStats, weapons, armor, spells })
})

// ─── Spells API ───────────────────────────────────────────────────────────────

// GET /api/spells?q=&school=&bookType=&skill=&category=&limit=200
app.get('/api/spells', (req, res) => {
  const q        = (req.query.q as string || '').trim().toLowerCase()
  const school   = req.query.school as string || ''
  const bookType = req.query.bookType as string || ''
  const skill    = req.query.skill as string || ''
  const category = req.query.category as string || ''
  const limit    = Math.min(Number(req.query.limit) || 200, 500)

  let results = Array.from(spellsMap.values())

  if (q) results = results.filter(r =>
    ((r.hid as string) || '').toLowerCase().includes(q) ||
    ((r.name as string) || '').toLowerCase().includes(q) ||
    ((r.description as string) || '').toLowerCase().includes(q)
  )
  if (school)   results = results.filter(r => r.school_hid === school)
  if (bookType) results = results.filter(r => r.book_type_hid === bookType)
  if (skill)    results = results.filter(r => r.primary_skill_hid === skill)
  if (category) results = results.filter(r => r.category_hid === category)

  results.sort((a, b) =>
    (Number(a.level) || 0) - (Number(b.level) || 0) ||
    ((a.name as string) || '').localeCompare((b.name as string) || '')
  )
  results = results.slice(0, limit)

  res.json({ spells: results, total: results.length })
})

// GET /api/spells/:hid
app.get('/api/spells/:hid', (req, res) => {
  const spell = spellsMap.get(req.params.hid)
  if (!spell) { res.status(404).json({ error: 'Not found' }); return }

  const scrollName = `Scroll: ${spell.name as string}`
  const linked_scrolls = Array.from(itemsMap.values())
    .filter(r => r.name === scrollName)
    .map(r => ({ hid: r.hid, name: r.name, icon_id: r.icon_id, required_level: r.required_level }))
    .slice(0, 10)

  res.json({ ...spell, linked_scrolls })
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
    ['SV Ice', item.resist_ice], ['SV Fire', item.resist_fire],
    ['SV Elec', item.resist_electric], ['SV Magic', item.resist_magic],
    ['SV Corrupt', item.resist_corrupt], ['SV Poison', item.resist_poison],
    ['SV Disease', item.resist_disease], ['SV Holy', item.resist_holy],
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
    const item = itemsMap.get(hid) ?? null
    const metaTags = buildMetaTags(item, hid)
    const html = await renderHtml(req.url, metaTags)
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    next(e)
  }
})

// HTML route for spell pages
app.get('/spells/:hid', async (req, res, next) => {
  try {
    const { hid } = req.params
    const spell = spellsMap.get(hid)
    const name  = escHtml((spell?.name as string) || hid)
    const title = `${name} — Monsters &amp; Memories Spell Database`
    const desc  = spell?.description
      ? escHtml(spell.description as string)
      : `${name} — a ${spell?.book_type_hid ?? 'spell'} in Monsters &amp; Memories`
    const metaTags = [
      `<title>${title}</title>`,
      `<meta name="description" content="${desc}" />`,
      `<meta property="og:title" content="${title}" />`,
      `<meta property="og:description" content="${desc}" />`,
    ].join('\n    ')
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
