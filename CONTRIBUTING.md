# Contributing to the MnM Item & Spell Database

Thanks for helping fill out the database! The easiest way to contribute is to correct or add item/spell data by editing the YAML files directly in this repo.

---

## How data is organized

Each item and spell has its own YAML file:

```
data/items/<hid>.yaml    ← one file per item
data/spells/<hid>.yaml   ← one file per spell
```

The filename (and the `hid` field inside) is the item's internal identifier — a short human-readable slug like `bronze_lsword` or `arcane_infusion`. **Do not rename files** — the HID must stay stable or links will break.

---

## Editing an existing item

Find the file in `data/items/` and open it. Fields you might want to correct:

| Field | Description |
|---|---|
| `name` | Display name |
| `damage` / `delay` | Weapon damage and attack delay (in tenths of a second) |
| `ac` | Armor class bonus |
| `slot_mask` | Equip slot bitmask (see below) |
| `class_mask` | Classes that can use this item (bitmask) |
| `race_mask` | Races that can use this item (bitmask) |
| `required_level` | Minimum level to equip |
| `weight` | Item weight |
| `magic` / `no_drop` / `no_rent` / `two_handed` | Boolean flags (1 = true, omit or 0 = false) |
| `strength`, `stamina`, `dexterity`, `agility`, `intelligence`, `wisdom`, `charisma` | Stat bonuses |
| `health`, `mana` | HP/MP bonuses |
| `health_regen`, `mana_regen` | Regen bonuses |
| `resist_fire`, `resist_ice`, `resist_electric`, `resist_magic`, `resist_poison`, `resist_disease`, `resist_holy`, `resist_corrupt` | Resist bonuses |
| `melee_haste`, `ranged_haste` | Haste bonuses |

**Example — a weapon:**
```yaml
damage: 8
delay: 36
hid: bronze_lsword
name: Bronze Longsword
class_mask: 253507
race_mask: 4095
required_level: 0
size_hid: lg
skill_weapon_hid: sla
slot_mask: 1
weight: 3.5
```

**Example — armor with stats:**
```yaml
ac: 5
agility: 3
class_mask: 130767
hid: ac_commander_mangles_cape
icon_id: cloak:653F23:663F23:663F23:1.008:0.184:1:1
magic: 1
name: Commander's Cloak
race_mask: 4095
required_level: 0
resist_fire: 2
size_hid: md
slot_mask: 131072
weight: 0.25
```

Only include fields that have meaningful non-zero values. Fields at zero or not applicable can be omitted to keep files clean.

---

## Editing an existing spell

Find the file in `data/spells/` and open it.

| Field | Description |
|---|---|
| `name` | Display name |
| `description` | Full spell description text |
| `level` | Level the ability is available |
| `mana_cost` | Mana cost to cast |
| `cast_time` | Cast time in seconds |
| `range` | Cast range |
| `school_hid` | Magic school (e.g. `alt`, `div`, `evo`) |
| `book_type_hid` | Book type (`spl` = spell, `ski` = skill, `inn` = innate) |
| `category_hid` | Ability category (e.g. `ben` = beneficial, `dtm` = detrimental) |
| `target_hid` | Targeting type (`slf` = self, `tar` = target, `aoe` = area) |
| `primary_skill_hid` | Governing skill HID |

**Example:**
```yaml
animation: cast
area_effect_hid: tar
area_effect_target_cap: 4
book_type_hid: spl
cast_time: 4.0
category_hid: ben
cooldown: 0.0
description: "Infuse your mind with the arcane, increasing your Mana Regeneration\
  \ by 1 (L1) to 10 (L60)..."
hid: arcane_infusion
icon_hid: brain_pink
level: 1
mana_cost: 10
name: Arcane Infusion
school_hid: alt
target_hid: slf
```

---

## Adding a new item or spell

1. Choose a stable, descriptive HID slug (lowercase, underscores, no spaces) — e.g. `rusty_dagger` or `minor_heal`
2. Create `data/items/<hid>.yaml` or `data/spells/<hid>.yaml`
3. Include at minimum: `hid`, `name`, and any stats you know
4. Open a pull request with a brief description of where the item/spell comes from

---

## Slot mask reference

Slot mask values are powers-of-two that can be combined (bitwise OR):

| Value | Slot |
|---|---|
| 1 | Primary hand |
| 2 | Secondary hand |
| 4 | Ranged |
| 8 | Ammo |
| 16 / 32 | Ear (left / right) |
| 64 | Neck |
| 128 | Face |
| 256 | Head |
| 512 / 1024 | Finger (left / right) |
| 2048 / 4096 | Wrist (left / right) |
| 8192 | Shirt |
| 16384 | Chest |
| 32768 | Back |
| 65536 | Waist |
| 131072 | Cloak |
| 262144 | Legs |
| 524288 | Feet |
| 1048576 | Shoulders |
| 2097152 | Arms |
| 4194304 | Hands |
| 8388608 | Charm |

---

## Class and race mask reference

**Class mask** — bits in order:

| Bit | Class |
|---|---|
| 0 (1) | ARC |
| 1 (2) | BRD |
| 2 (4) | BST |
| 3 (8) | FTR |
| 4 (16) | INQ |
| 5 (32) | PAL |
| 6 (64) | RNG |
| 7 (128) | ROG |
| 8 (256) | SHD |
| 9 (512) | SPB |
| 10 (1024) | WIZ |

**Race mask** — bits in order:

| Bit | Race |
|---|---|
| 0 (1) | HUM |
| 1 (2) | DWF |
| 2 (4) | ELF |
| 3 (8) | GNM |
| 4 (16) | HLF |
| 5 (32) | GBL |
| 6 (64) | OGR |
| 7 (128) | ASH |
| 8 (256) | RAT |

All races = `511`. All classes = `2047`.

---

## Submitting changes

1. Fork the repo on GitHub
2. Edit or add YAML files
3. Open a pull request — briefly describe what you changed and how you know it's correct (e.g. "verified in-game on level 12 Fighter")

Questions? Open an issue.
