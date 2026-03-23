# Monsters & Memories — Community Item & Spell Database

A community-built reference site for [Monsters & Memories](https://www.monstersandmemories.com/), the classic-style MMORPG. Browse weapons, armor, gear, and spells with full stats captured from the live game.

🌐 **Live site:** https://mnmdb.online

---

## What's in here?

- **Items** — 1,400+ weapons, armor, jewelry, and other gear with full stat sheets
- **Spells** — Spellbook entries with descriptions, mana cost, cast time, school, and more
- **Search & Filter** — Filter by name, item type, slot, weapon skill, class, race, stats, and more
- **Item detail pages** — Full stat breakdown with class/race restrictions, slot info, and linked scrolls
- **Spell detail pages** — Full ability description with school, book type, level, and linked scroll items

Data is community-sourced and updated as players explore the game world. Some items and spells may be missing or incomplete — see [CONTRIBUTING.md](CONTRIBUTING.md) if you'd like to help fill in gaps.

---

## Running locally

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

---

## Project structure

```
web/
├── data/
│   ├── items/      # One YAML file per item (keyed by HID)
│   └── spells/     # One YAML file per spell (keyed by HID)
├── src/
│   ├── pages/      # React page components
│   └── components/ # Shared UI components
└── server.ts       # Express API + Vite dev server
```

Item and spell data lives in plain YAML files under `data/`. This makes it easy to review, correct, and contribute data via pull request.

---

## License

[MIT](LICENSE) — free to use, fork, and contribute. We'd ask that you not run a competing public copy out of respect for the community, but that's up to you.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add or correct item and spell data.
