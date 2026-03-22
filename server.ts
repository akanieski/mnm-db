// Combined server — Express API + Vite (dev) or static (prod)
import express from 'express'
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = process.env.DATABASE_PATH ?? path.join(__dirname, 'mnm_gamedata.db')
const IS_PROD = process.env.NODE_ENV === 'production'
const PORT = Number(process.env.PORT) || 5173

const db = new Database(DB_PATH, { readonly: true })
const app = express()
app.use(express.json())

// Helpers
// Slot mask: bit N = slot ID (N+1), matching SlotLibrary constants
// 1=PRIMARY, 2=SECONDARY, 3=RANGED, 4=AMMO, 5=EAR_L, 6=EAR_R,
// 7=NECK, 8=FACE, 9=HEAD, 10=FINGER_L, 11=FINGER_R,
// 12=WRIST_L, 13=WRIST_R, 14=SHIRT, 15=HANDS, 16=SHOULDERS,
// 17=CHEST, 18=BACK, 19=WAIST, 20=LEGS, 21=FEET
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

// Static files (prod) or Vite dev middleware
if (IS_PROD) {
  const DIST = path.join(__dirname, 'dist')
  const PUBLIC = path.join(__dirname, 'public')
  // Serve built app assets; serve public/ separately to avoid duplicating icons in dist/
  app.use(express.static(DIST))
  app.use(express.static(PUBLIC))
  app.use((_req, res) => res.sendFile(path.join(DIST, 'index.html')))
} else {
  const { createServer: createViteServer } = await import('vite')
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  })
  app.use(vite.middlewares)
}

app.listen(PORT, () => console.log(`Server → http://localhost:${PORT}`))
