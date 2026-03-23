export interface ItemSummary {
  hid: string
  name: string
  item_type: number | null
  slot_mask: number | null
  required_level: number | null
  damage: number | null
  delay: number | null
  ac: number | null
  weight: number | null
  strength: number | null
  stamina: number | null
  dexterity: number | null
  agility: number | null
  intelligence: number | null
  wisdom: number | null
  charisma: number | null
  health: number | null
  mana: number | null
  has_stats: number
  icon_id: string | null
  slots: string[]
  skill_weapon_hid: string | null
}

export interface ItemDetail extends ItemSummary {
  health_regen: number | null
  mana_regen: number | null
  melee_haste: number | null
  ranged_haste: number | null
  spell_haste: number | null
  resist_ice: number | null
  resist_fire: number | null
  resist_electric: number | null
  resist_magic: number | null
  resist_corrupt: number | null
  resist_poison: number | null
  resist_disease: number | null
  resist_holy: number | null
  brass_mod: number | null
  percussion_mod: number | null
  singing_mod: number | null
  string_mod: number | null
  wind_mod: number | null
  might: number | null
  grace: number | null
  swiftness: number | null
  constitution: number | null
  discipline: number | null
  class_mask: number | null
  race_mask: number | null
  no_drop: number | null
  no_rent: number | null
  magic: number | null
  two_handed: number | null
  skill_weapon_hid: string | null
  size_hid: string | null
  description: string | null
  scanned_at: string | null
}

export type FilterType = 'all' | 'stats' | 'weapon' | 'armor'

export interface SpellSummary {
  hid: string
  name: string
  description: string | null
  level: number | null
  mana_cost: number | null
  cast_time: number | null
  cooldown: number | null
  school_hid: string | null
  category_hid: string | null
  target_hid: string | null
  book_type_hid: string | null
  type_hid: string | null
  is_toggle: number | null
  can_fizzle: number | null
  no_interrupt: number | null
  cast_while_moving: number | null
  cooldown_hid: string | null
  global_cooldown: number | null
  range: number | null
  reagent_name: string | null
  resist_element_hid: string | null
  area_effect_hid: string | null
  area_effect_target_cap: number | null
  icon_hid: string | null
  primary_skill_hid: string | null
  school_name: string | null
  scanned_at: string | null
}
