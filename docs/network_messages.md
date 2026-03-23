# Monsters & Memories — Network Message Classes

> Auto-generated from IL2CPP metadata via Frida enumeration.
> Classes extracted from `Client.dll`, `Common.dll`, `Mirror.dll`, and `Assembly-CSharp`.

## Table of Contents

- [Cmd* — Client → Server Commands](#cmd) (103)
- [*Record — Data Records (Server → Client Payloads)](#record) (44)
- [*Message — Message Types](#message) (13)
- [*Request — Requests](#request) (20)
- [*Response — Responses](#response) (27)
- [*Packet — Packets](#packet) (22)
- [*Command — Commands](#command) (50)

---

## Cmd* — Client → Server Commands

### Common.dll / (global)

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `CmdAnonType` | Client → Server | `Enum` | `value__` : `System.Int32` @ `0x10`, `On` : `Common.Packets.CmdAnon.CmdAnonType` @ `0x0`, `Off` : `Common.Packets.CmdAnon.CmdAnonType` @ `0x0`, `Toggle` : `Common.Packets.CmdAnon.CmdAnonType` @ `0x0` | _none_ |

### Common.dll / Common.Packets

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `CmdAccountInfo` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `sender` : `System.UInt32` @ `0x10`, `accountId` : `System.UInt32` @ `0x14`, `peerAddress` : `System.String` @ `0x18`, `message` : `System.String` @ `0x20`, `target... | `Serialize()` @ `0xC7C0F0`, `Deserialize()` @ `0xC7BFB0` |
| `CmdAddXp` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `value` : `System.Int32` @ `0x10` | `Serialize()` @ `0xC7C350`, `Deserialize()` @ `0xC7C270` |
| `CmdAnon` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `anonType` : `Common.Data.AnonymousType` @ `0x10`, `commandType` : `Common.Packets.CmdAnon.CmdAnonType` @ `0x14` | `Serialize()` @ `0xC7C510`, `Deserialize()` @ `0xC7C420` |
| `CmdAutosplit` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `mode` : `System.Byte` @ `0x10` | `Serialize()` @ `0xC7C6D0`, `Deserialize()` @ `0xC7C5F0` |
| `CmdBind` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC7C860`, `Deserialize()` @ `0xC7C7A0` |
| `CmdCast` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `hid` : `System.String` @ `0x10`, `clicky` : `System.Boolean` @ `0x18` | `Serialize()` @ `0xC7CA10`, `Deserialize()` @ `0xC7C910` |
| `CmdCharInfo` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC7CBB0`, `Deserialize()` @ `0xC7CAF0` |
| `CmdCharacterReset` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC7CD20`, `Deserialize()` @ `0xC7CC60` |
| `CmdCombatReport` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `targetId` : `System.UInt32` @ `0x10`, `enable` : `System.Boolean` @ `0x14` | `Serialize()` @ `0xC7CEC0`, `Deserialize()` @ `0xC7CDD0` |
| `CmdConsent` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `name` : `System.String` @ `0x10`, `remove` : `System.Boolean` @ `0x18` | `Serialize()` @ `0xC7D0A0`, `Deserialize()` @ `0xC7CFA0` |
| `CmdCorpse` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC7D280`, `Deserialize()` @ `0xC7D1C0` |
| `CmdDamage` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `damage` : `System.Int32` @ `0x10` | `Serialize()` @ `0xC7D5C0`, `Deserialize()` @ `0xC7D4E0` |
| `CmdDamageLogs` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `state` : `System.Boolean` @ `0x10` | `Serialize()` @ `0xC7D410`, `Deserialize()` @ `0xC7D330` |
| `CmdDumpGameObjects` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC7D750`, `Deserialize()` @ `0xC7D690` |
| `CmdEarthquake` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `earthquakeType` : `Common.Packets.EarthquakeType` @ `0x10`, `silent` : `System.Boolean` @ `0x14` | `Serialize()` @ `0xC7D8F0`, `Deserialize()` @ `0xC7D800` |
| `CmdEmote` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `emoteType` : `Common.Definition.EmoteType` @ `0x10`, `target` : `System.String` @ `0x18` | `Serialize()` @ `0xC7DAD0`, `Deserialize()` @ `0xC7D9D0` |
| `CmdEnterWorldAccessAdd` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `statusHID` : `System.String` @ `0x10` | `Serialize()` @ `0xC7DCA0`, `Deserialize()` @ `0xC7DBB0` |
| `CmdEnterWorldAccessList` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC7DE30`, `Deserialize()` @ `0xC7DD70` |
| `CmdEnterWorldAccessRemove` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `statusHID` : `System.String` @ `0x10` | `Serialize()` @ `0xC7DFD0`, `Deserialize()` @ `0xC7DEE0` |
| `CmdForsakeDeity` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `DeityHID` : `System.String` @ `0x10` | `Serialize()` @ `0xC7E190`, `Deserialize()` @ `0xC7E0A0` |
| `CmdGM` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `state` : `System.Boolean` @ `0x10` | `Serialize()` @ `0xC7E550`, `Deserialize()` @ `0xC7E470` |
| `CmdGMDisguiseName` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `disguiseName` : `System.String` @ `0x10` | `Serialize()` @ `0xC7E350`, `Deserialize()` @ `0xC7E260` |
| `CmdGetCondition` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `name` : `System.String` @ `0x10` | `Serialize()` @ `0xC7E710`, `Deserialize()` @ `0xC7E620` |
| `CmdGoHome` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC7E8A0`, `Deserialize()` @ `0xC7E7E0` |
| `CmdGuildCreate` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `guildCreateName` : `System.String` @ `0x10` | `Serialize()` @ `0xC7EA40`, `Deserialize()` @ `0xC7E950` |
| `CmdGuildGetMotd` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `message` : `System.String` @ `0x10` | `Serialize()` @ `0xC7EBD0`, `Deserialize()` @ `0xC7EB10` |
| `CmdGuildInvite` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `name` : `System.String` @ `0x10` | `Serialize()` @ `0xC7ED70`, `Deserialize()` @ `0xC7EC80` |
| `CmdGuildLeader` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC7EF00`, `Deserialize()` @ `0xC7EE40` |
| `CmdGuildLeave` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC7F070`, `Deserialize()` @ `0xC7EFB0` |
| `CmdGuildManage` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `clientID` : `System.UInt32` @ `0x10`, `operation` : `Common.Data.GuildManageOperationType` @ `0x14` | `Serialize()` @ `0xC7F210`, `Deserialize()` @ `0xC7F120` |
| `CmdGuildPromote` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC7F3B0`, `Deserialize()` @ `0xC7F2F0` |
| `CmdGuildSetMotd` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `message` : `System.String` @ `0x10` | `Serialize()` @ `0xC7F550`, `Deserialize()` @ `0xC7F460` |
| `CmdGuildStat` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC7F6E0`, `Deserialize()` @ `0xC7F620` |
| `CmdHeal` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC7F850`, `Deserialize()` @ `0xC7F790` |
| `CmdHideEquipment` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `id` : `System.Byte` @ `0x10`, `value` : `System.Byte` @ `0x11` | `Serialize()` @ `0xC7F9F0`, `Deserialize()` @ `0xC7F900` |
| `CmdImmortal` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `immortalEnabled` : `System.Boolean` @ `0x10`, `toggle` : `System.Boolean` @ `0x11` | `Serialize()` @ `0xC7FBC0`, `Deserialize()` @ `0xC7FAD0` |
| `CmdIncreaseDevotion` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `clientId` : `System.UInt32` @ `0x10`, `deityHID` : `System.String` @ `0x18`, `value` : `System.Int32` @ `0x20` | `Serialize()` @ `0xC7FDA0`, `Deserialize()` @ `0xC7FCA0` |
| `CmdKill` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC7FF40`, `Deserialize()` @ `0xC7FE80` |
| `CmdListConditions` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC800B0`, `Deserialize()` @ `0xC7FFF0` |
| `CmdListCorpses` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `name` : `System.String` @ `0x10` | `Serialize()` @ `0xC80250`, `Deserialize()` @ `0xC80160` |
| `CmdListInventory` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC803E0`, `Deserialize()` @ `0xC80320` |
| `CmdLootTable` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `includePossibleDrops` : `System.Boolean` @ `0x10` | `Serialize()` @ `0xC80570`, `Deserialize()` @ `0xC80490` |
| `CmdMemorySnapshot` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC80710`, `Deserialize()` @ `0xC80650` |
| `CmdModifyTrait` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `command` : `System.String` @ `0x10`, `traitHid` : `System.String` @ `0x18` | `Serialize()` @ `0xC808C0`, `Deserialize()` @ `0xC807C0` |
| `CmdNetQueueStatus` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC80A60`, `Deserialize()` @ `0xC809A0` |
| `CmdPackupHouse` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC80BD0`, `Deserialize()` @ `0xC80B10` |
| `CmdPartyDebug` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `world` : `System.Boolean` @ `0x10` | `Serialize()` @ `0xC80D60`, `Deserialize()` @ `0xC80C80` |
| `CmdPartyReset` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC80EF0`, `Deserialize()` @ `0xC80E30` |
| `CmdPlayed` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC81060`, `Deserialize()` @ `0xC80FA0` |
| `CmdPlayerCount` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `characterID` : `System.UInt32` @ `0x10` | `Serialize()` @ `0xC811F0`, `Deserialize()` @ `0xC81110` |
| `CmdProfile` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC81380`, `Deserialize()` @ `0xC812C0` |
| `CmdPvPFlag` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `id` : `System.UInt32` @ `0x10`, `flag` : `System.Boolean` @ `0x14` | `Serialize()` @ `0xC81550`, `Deserialize()` @ `0xC81430` |
| `CmdReload` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC81D60`, `Deserialize()` @ `0xC81CA0` |
| `CmdReloadInventories` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC81720`, `Deserialize()` @ `0xC81660` |
| `CmdReloadInventory` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC81890`, `Deserialize()` @ `0xC817D0` |
| `CmdReloadTarget` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `targetId` : `System.UInt32` @ `0x10` | `Serialize()` @ `0xC81A20`, `Deserialize()` @ `0xC81940` |
| `CmdReloadZone` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `all` : `System.Boolean` @ `0x10` | `Serialize()` @ `0xC81BD0`, `Deserialize()` @ `0xC81AF0` |
| `CmdRename` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `clientId` : `System.UInt32` @ `0x10`, `currentName` : `System.String` @ `0x18`, `newName` : `System.String` @ `0x20` | `Serialize()` @ `0xC81F20`, `Deserialize()` @ `0xC81E10` |
| `CmdRepop` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `repopZone` : `System.Boolean` @ `0x10`, `reloadLootTables` : `System.Boolean` @ `0x11`, `spawnId` : `System.Int32` @ `0x14` | `Serialize()` @ `0xC82110`, `Deserialize()` @ `0xC82010` |
| `CmdRerollApply` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `clientid` : `System.UInt32` @ `0x10`, `clientAttributeRecord` : `Common.Records.ClientAttributeRecord` @ `0x18`, `message` : `System.String` @ `0x20`, `traitHids` ... | `Serialize()` @ `0xC823B0`, `Deserialize()` @ `0xC82210` |
| `CmdRerollGive` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `clientid` : `System.UInt32` @ `0x10`, `rerollType` : `System.String` @ `0x18` | `Serialize()` @ `0xC826D0`, `Deserialize()` @ `0xC825E0` |
| `CmdRerollStart` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `clientid` : `System.UInt32` @ `0x10`, `rerollType` : `System.String` @ `0x18` | `Serialize()` @ `0xC828F0`, `Deserialize()` @ `0xC82800` |
| `CmdRevive` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC82AE0`, `Deserialize()` @ `0xC82A20` |
| `CmdRewind` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC82C50`, `Deserialize()` @ `0xC82B90` |
| `CmdScribeAllSpells` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `bookInventorySlot` : `System.UInt16` @ `0x10` | `Serialize()` @ `0xC82DE0`, `Deserialize()` @ `0xC82D00` |
| `CmdSearchAbility` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `search` : `System.String` @ `0x10` | `Serialize()` @ `0xC82FA0`, `Deserialize()` @ `0xC82EB0` |
| `CmdSearchFaction` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `search` : `System.String` @ `0x10` | `Serialize()` @ `0xC83160`, `Deserialize()` @ `0xC83070` |
| `CmdSearchItem` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `search` : `System.String` @ `0x10` | `Serialize()` @ `0xC83320`, `Deserialize()` @ `0xC83230` |
| `CmdSearchNpc` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `search` : `System.String` @ `0x10` | `Serialize()` @ `0xC834E0`, `Deserialize()` @ `0xC833F0` |
| `CmdSearchSkill` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `search` : `System.String` @ `0x10` | `Serialize()` @ `0xC836A0`, `Deserialize()` @ `0xC835B0` |
| `CmdServerAccessAdd` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `statusHID` : `System.String` @ `0x10` | `Serialize()` @ `0xC83860`, `Deserialize()` @ `0xC83770` |
| `CmdServerAccessList` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC839F0`, `Deserialize()` @ `0xC83930` |
| `CmdServerAccessRemove` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `statusHID` : `System.String` @ `0x10` | `Serialize()` @ `0xC83B90`, `Deserialize()` @ `0xC83AA0` |
| `CmdServerName` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC83D20`, `Deserialize()` @ `0xC83C60` |
| `CmdSetAllSkills` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `value` : `System.UInt16` @ `0x10` | `Serialize()` @ `0xC83EB0`, `Deserialize()` @ `0xC83DD0` |
| `CmdSetCondition` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `name` : `System.String` @ `0x10`, `on` : `System.Boolean` @ `0x18` | `Serialize()` @ `0xC84080`, `Deserialize()` @ `0xC83F80` |
| `CmdSetDeity` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `Command` : `System.String` @ `0x10`, `DeityHID` : `System.String` @ `0x18`, `Devotion` : `System.Int32` @ `0x20` | `Serialize()` @ `0xC84270`, `Deserialize()` @ `0xC84160` |
| `CmdSetFaction` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `hid` : `System.String` @ `0x10`, `value` : `System.Int16` @ `0x18` | `Serialize()` @ `0xC844B0`, `Deserialize()` @ `0xC843B0` |
| `CmdSetLevel` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `value` : `System.UInt16` @ `0x10` | `Serialize()` @ `0xC84670`, `Deserialize()` @ `0xC84590` |
| `CmdSetPermanentStatus` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `permanentStatusChangeType` : `Common.Packets.CmdSetPermanentStatus.PermanentStatusChangeType` @ `0x10` | `Serialize()` @ `0xC84820`, `Deserialize()` @ `0xC84740` |
| `CmdSetSkill` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `hid` : `System.String` @ `0x10`, `value` : `System.UInt16` @ `0x18` | `Serialize()` @ `0xC84BD0`, `Deserialize()` @ `0xC84AD0` |
| `CmdSetSkillTier` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `hid` : `System.String` @ `0x10`, `value` : `System.UInt16` @ `0x18` | `Serialize()` @ `0xC849F0`, `Deserialize()` @ `0xC848F0` |
| `CmdSetZoneDMG` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `value` : `System.UInt16` @ `0x10` | `Serialize()` @ `0xC84D90`, `Deserialize()` @ `0xC84CB0` |
| `CmdSetZoneHP` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `value` : `System.UInt16` @ `0x10` | `Serialize()` @ `0xC84F40`, `Deserialize()` @ `0xC84E60` |
| `CmdSetZoneLevel` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `value` : `System.Int32` @ `0x10` | `Serialize()` @ `0xC850F0`, `Deserialize()` @ `0xC85010` |
| `CmdSnoop` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `targetId` : `System.UInt32` @ `0x10`, `name` : `System.String` @ `0x18` | `Serialize()` @ `0xC852C0`, `Deserialize()` @ `0xC851C0` |
| `CmdSphereOfInfluence` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `range` : `System.Single` @ `0x10` | `Serialize()` @ `0xC85480`, `Deserialize()` @ `0xC853A0` |
| `CmdStats` | Client → Server | `Packet` | `MAX_PUT_LENGTH` : `System.Int32` @ `0x0`, `opCode` : `System.UInt16` @ `0x0`, `message` : `System.String` @ `0x10`, `windowArg` : `System.String` @ `0x18`, `targetid` : `System.UInt32` @ `0x20` | `Serialize()` @ `0xC856E0`, `Deserialize()` @ `0xC85550` |
| `CmdStopCast` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC859B0`, `Deserialize()` @ `0xC858F0` |
| `CmdStopSong` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC85B20`, `Deserialize()` @ `0xC85A60` |
| `CmdSummonCoin` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `pp` : `System.UInt32` @ `0x10`, `gp` : `System.UInt32` @ `0x14`, `sp` : `System.UInt32` @ `0x18`, `cp` : `System.UInt32` @ `0x1C` | `Serialize()` @ `0xC85CD0`, `Deserialize()` @ `0xC85BD0` |
| `CmdSummonCorpse` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `corpseID` : `System.UInt32` @ `0x10` | `Serialize()` @ `0xC85EA0`, `Deserialize()` @ `0xC85DC0` |
| `CmdSummonItem` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `hid` : `System.String` @ `0x10`, `quantity` : `System.UInt16` @ `0x18` | `Serialize()` @ `0xC86070`, `Deserialize()` @ `0xC85F70` |
| `CmdSummonNpc` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `hid` : `System.String` @ `0x10` | `Serialize()` @ `0xC86250`, `Deserialize()` @ `0xC86160` |
| `CmdSurname` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `surname` : `System.String` @ `0x10` | `Serialize()` @ `0xC86410`, `Deserialize()` @ `0xC86320` |
| `CmdTextureSwap` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `id` : `System.Byte` @ `0x10`, `textureString` : `System.String` @ `0x18` | `Serialize()` @ `0xC865D0`, `Deserialize()` @ `0xC864E0` |
| `CmdTrigger` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `name` : `System.String` @ `0x10` | `Serialize()` @ `0xC867A0`, `Deserialize()` @ `0xC866B0` |
| `CmdUnlockCorpsePacket` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC86930`, `Deserialize()` @ `0xC86870` |
| `CmdUnstuck` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC86AA0`, `Deserialize()` @ `0xC869E0` |
| `CmdWeather` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `weatherHID` : `System.String` @ `0x10`, `value` : `System.Boolean` @ `0x18` | `Serialize()` @ `0xC86C50`, `Deserialize()` @ `0xC86B50` |
| `CmdZone` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `zoneName` : `System.String` @ `0x10`, `zoneOther` : `System.Boolean` @ `0x18`, `playerName` : `System.String` @ `0x20`, `playerId` : `System.UInt32` @ `0x28` | `Serialize()` @ `0xC86FC0`, `Deserialize()` @ `0xC86EA0` |
| `CmdZoneInfo` | Client → Server | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC86DF0`, `Deserialize()` @ `0xC86D30` |

## *Record — Data Records (Server → Client Payloads)

### Client.dll / (global)

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `MaterialCacheRecord` | — | `Object` | `materials` : `UnityEngine.Material[]` @ `0x10`, `locks` : `System.UInt16` @ `0x18`, `loading` : `System.Boolean` @ `0x1A`, `deathTime` : `System.Single` @ `0x1C` | _none_ |
| `ModelCacheRecord` | — | `Object` | `asset` : `UnityEngine.AddressableAssets.AssetReferenceGameObject` @ `0x10`, `model` : `UnityEngine.GameObject` @ `0x18`, `loading` : `System.Boolean` @ `0x20`, `locks` : `System.UInt16` @ `0x22`, `de... | _none_ |
| `TextureCacheRecord` | — | `Object` | `asset` : `UnityEngine.AddressableAssets.AssetReferenceTexture` @ `0x10`, `texture` : `UnityEngine.Texture2D` @ `0x18`, `loading` : `System.Boolean` @ `0x20`, `locks` : `System.UInt16` @ `0x22`, `deat... | _none_ |

### Common.dll / (global)

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `ClientMacroRecord` | Bidirectional | `Object` | `isGlobal` : `System.Boolean` @ `0x10`, `index` : `System.Int32` @ `0x14`, `guid` : `System.Guid` @ `0x18`, `iconName` : `System.String` @ `0x28`, `name` : `System.String` @ `0x30`, `contents` : `Syst... | `Serialize()` @ `0xC61AE0`, `Deserialize()` @ `0xC619E0` |
| `GroupListingRecord` | Bidirectional | `Object` | `groupId` : `System.UInt32` @ `0x10`, `leaderName` : `System.String` @ `0x18`, `levelRangeLow` : `System.Int32` @ `0x20`, `levelRangeHigh` : `System.Int32` @ `0x24`, `location` : `System.String` @ `0x... | `Serialize()` @ `0xC98CA0`, `Deserialize()` @ `0xC989B0` |
| `HotbuttonRecord` | Bidirectional | `Object` | `clientID` : `System.UInt32` @ `0x10`, `index` : `System.Int32` @ `0x14`, `type` : `HotButtonType` @ `0x18`, `guid` : `System.Guid` @ `0x1C`, `abilitySlot` : `System.Int32` @ `0x2C`, `additionalInt` :... | `Serialize()` @ `0xC6E020`, `Deserialize()` @ `0xC6DF30` |
| `StaticObjectStateRecord` | — | `Object` | `ID` : `System.UInt32` @ `0x10`, `state` : `System.Boolean` @ `0x14` | _none_ |
| `SubsceneRecord` | — | `Object` | `loadOp` : `UnityEngine.AsyncOperation` @ `0x10`, `scene` : `UnityEngine.SceneManagement.Scene` @ `0x18` | _none_ |

### Common.dll / Common.Records

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `AbilityCollectionRecord` | Bidirectional | `Object` | `spellbooks` : `Common.Records.SpellbookCollectionRecord` @ `0x10`, `skills` : `Common.Records.IndexedAbilitySetRecord` @ `0x18`, `innates` : `Common.Records.IndexedAbilitySetRecord` @ `0x20`, `memori... | `Serialize()` @ `0xC5CD70`, `Deserialize()` @ `0xC5CCC0` |
| `AbilityRecord` | Server → Client (incoming) | `Object` | `hid` : `System.String` @ `0x10`, `name` : `System.String` @ `0x18`, `description` : `System.String` @ `0x20`, `primarySkillHid` : `System.String` @ `0x28`, `level` : `System.Int32` @ `0x30`, `gemID` ... | `Write()` @ `0xC5F070`, `Read()` @ `0xC5EAF0`, `SightHidToLosType()` @ `0xC5EF90` |
| `AttachmentDefinitionRecord` | Server → Client (incoming) | `Object` | `slot` : `System.String` @ `0x10`, `hid` : `System.String` @ `0x18`, `itemID` : `System.UInt64` @ `0x20`, `isActive` : `System.Boolean` @ `0x28`, `textureDefinitions` : `Common.Records.TextureDefiniti... | `Write()` @ `0xC5FB30`, `Read()` @ `0xC5F9A0` |
| `BuffRecord` | Server → Client (incoming) | `Object` | `entityBuffID` : `System.UInt32` @ `0x10`, `buffHID` : `System.String` @ `0x18`, `buffName` : `System.String` @ `0x20`, `type` : `System.String` @ `0x28`, `stacks` : `System.UInt16` @ `0x30`, `data` :... | `Write()` @ `0xC605B0`, `Read()` @ `0xC60440`, `GetDescriptions()` @ `0xC60060` |
| `ClientAttributeRecord` | Server → Client (incoming) | `Object` | `StrMod` : `System.Int32` @ `0x10`, `StaMod` : `System.Int32` @ `0x14`, `AgiMod` : `System.Int32` @ `0x18`, `DexMod` : `System.Int32` @ `0x1C`, `IntMod` : `System.Int32` @ `0x20`, `WisMod` : `System.I... | `Write()` @ `0xC60BE0`, `Read()` @ `0xC60B20` |
| `ClientDeityRecord` | — | `Object` | `ClientId` : `System.UInt32` @ `0x10`, `DeityHID` : `System.String` @ `0x18`, `Priority` : `System.UInt32` @ `0x20`, `Devotion` : `System.Int32` @ `0x24`, `DateCreated` : `System.DateTime` @ `0x28`, `... | `Put()` @ `0xC60DC0`, `Get()` @ `0xC60C70` |
| `ClientItemEnhancementRecord` | Server → Client (incoming) | `Object` | `itemID` : `System.UInt64` @ `0x10`, `type` : `Common.Data.ItemEnhancementType` @ `0x18`, `buffHID` : `System.String` @ `0x20`, `buffName` : `System.String` @ `0x28`, `fadeTimeMs` : `System.UInt64` @ ... | `Write()` @ `0xC61000`, `Read()` @ `0xC60ED0` |
| `ClientItemRecord` | Server → Client (incoming) | `Object` | `ItemID` : `System.UInt64` @ `0x10`, `ItemHID` : `System.String` @ `0x18`, `Owner` : `Common.Data.ItemOwnerType` @ `0x20`, `OwnerID` : `System.UInt64` @ `0x28`, `SlotID` : `System.UInt16` @ `0x30`, `Q... | `Write()` @ `0xC616B0`, `Read()` @ `0xC612F0`, `Clone()` @ `0xC61180` |
| `DevNoteRecord` | — | `Object` | `ID` : `System.UInt32` @ `0x10`, `CreatedByAccountId` : `System.UInt32` @ `0x14`, `CreatedDate` : `System.DateTime` @ `0x18`, `ModifiedByAccountId` : `System.UInt32` @ `0x20`, `ModifiedDate` : `System... | _none_ |
| `HouseOwnerRecord` | Server → Client (incoming) | `Object` | `id` : `System.UInt32` @ `0x10`, `name` : `System.String` @ `0x18`, `ownershipLevel` : `System.Byte` @ `0x20` | `Write()` @ `0xC6E160`, `Read()` @ `0xC6E0C0` |
| `IndexedAbilitySetRecord` | Bidirectional | `Object` | `abilitySlots` : `System.Collections.Generic.List<System.Collections.Generic.KeyValuePair<System.Int32,Common.Records.AbilityRecord>>` @ `0x10` | `Serialize()` @ `0xC6FE90`, `Deserialize()` @ `0xC6FCF0` |
| `ItemRecord` | Bidirectional | `Object` | `hid` : `System.String` @ `0x10`, `name` : `System.String` @ `0x18`, `itemType` : `Common.Data.ItemType` @ `0x20`, `classMask` : `System.UInt32` @ `0x24`, `raceMask` : `System.UInt32` @ `0x28`, `slotM... | `Write()` @ `0xC70BD0`, `Read()` @ `0xC70570`, `Deserialize()` @ `0xC70070`, `Serialize()` @ `0xC70730` |
| `MemberRecord` | Server → Client (incoming) | `Object` | `id` : `System.UInt32` @ `0x10`, `characterId` : `System.UInt32` @ `0x14`, `name` : `System.String` @ `0x18`, `classHID` : `System.String` @ `0x20`, `level` : `System.Int32` @ `0x28`, `zoneHID` : `Sys... | `Write()` @ `0xC88B10`, `Read()` @ `0xC88A20` |
| `MerchantItemRecord` | Server → Client (incoming) | `Object` | `itemHID` : `System.String` @ `0x10`, `itemName` : `System.String` @ `0x18`, `id` : `System.UInt16` @ `0x20`, `count` : `System.UInt16` @ `0x22`, `willSell` : `System.Boolean` @ `0x24`, `pp` : `System... | `Write()` @ `0xC88CE0`, `Read()` @ `0xC88BA0` |
| `ModelFeatureRecord` | Server → Client (incoming) | `Object` | `hid` : `System.String` @ `0x10`, `feature` : `System.UInt16` @ `0x18`, `color` : `System.UInt16` @ `0x1A`, `colorCustom` : `UnityEngine.Color` @ `0x1C`, `enableCustomColor` : `System.Boolean` @ `0x2C... | `Write()` @ `0xC892F0`, `Read()` @ `0xC88FD0`, `FromDBString()` @ `0xC88DC0`, `ToDBString()` @ `0xC890F0` |
| `MountMerchantItemRecord` | Server → Client (incoming) | `Object` | `petRecord` : `Common.Records.PetRecord` @ `0x10`, `cost` : `System.UInt32` @ `0x18`, `infoString` : `System.String` @ `0x20`, `purchaseHID` : `System.String` @ `0x28` | `Write()` @ `0xC89570`, `Read()` @ `0xC89390` |
| `PartyRecord` | Server → Client (incoming) | `Object` | `id` : `System.UInt32` @ `0x10`, `members` : `System.Collections.Generic.List<Common.Records.MemberRecord>` @ `0x18` | `Write()` @ `0xC898D0`, `Read()` @ `0xC89690` |
| `PetAbilityRecord` | Server → Client (incoming) | `Object` | `ability` : `Common.Records.AbilityRecord` @ `0x10`, `isActive` : `System.Boolean` @ `0x18`, `isOnCooldown` : `System.Boolean` @ `0x19`, `ActiveStateChangedEvent` : `System.Action<System.Boolean>` @ `... | `add_ActiveStateChangedEvent()` @ `0xC8AF20`, `remove_ActiveStateChangedEvent()` @ `0xC8B110`, `add_CooldownStateChangedEvent()` @ `0xC8AFD0`, `remove_CooldownStateChangedEvent()` @ `0xC8B1C0`, `Write... |
| `PetRecord` | Server → Client (incoming) | `Object` | `id` : `System.UInt64` @ `0x10`, `name` : `System.String` @ `0x18`, `iconHID` : `System.String` @ `0x20`, `race` : `System.String` @ `0x28`, `might` : `System.UInt16` @ `0x30`, `grace` : `System.UInt1... | `GetDescriptions()` @ `0xC8B2B0`, `Write()` @ `0xC8B460`, `Read()` @ `0xC8B310` |
| `RaceClassStartingAttributeRecord` | Bidirectional | `Object` | `RaceHID` : `System.String` @ `0x10`, `ClassHID` : `System.String` @ `0x18`, `StartingAttributePoints` : `System.Int32` @ `0x20`, `StartingStr` : `System.Int32` @ `0x24`, `StartingAgi` : `System.Int32... | `Serialize()` @ `0xC8BD40`, `Deserialize()` @ `0xC8B5B0`, `Read()` @ `0xC8BBE0`, `GetStartingValueByHid()` @ `0xC8B960`, `GetMaxValueByHid()` @ `0xC8B6E0` |
| `RecipeRecord` | Server → Client (incoming) | `Object` | `_sharedData` : `Common.Records.RecipeRecord.SharedData` @ `0x10`, `_difficulty` : `Common.Records.RecipeRecord.Difficulty` @ `0x18` | `GetDifficultyText()` @ `0xC8C7F0`, `GetDifficultyColorString()` @ `0xC8C6D0`, `Write()` @ `0xC8CD00`, `Read()` @ `0xC8C920`, `GetDescriptions()` @ `0xC8C0F0` |
| `SkillRecord` | Server → Client (incoming) | `Object` | `hid` : `System.String` @ `0x10`, `value` : `System.UInt16` @ `0x18`, `mod` : `System.Int16` @ `0x1A`, `iconHID` : `System.String` @ `0x20`, `cap` : `System.Int16` @ `0x28` | `Write()` @ `0xC8D600`, `Read()` @ `0xC8D540`, `GetDescriptions()` @ `0xC8D4C0` |
| `SkillTrainerRecord` | Server → Client (incoming) | `Object` | `skillName` : `System.String` @ `0x10`, `hid` : `System.String` @ `0x18`, `currentValue` : `System.UInt16` @ `0x20`, `maxValue` : `System.Int16` @ `0x22`, `pp` : `System.UInt16` @ `0x24`, `gp` : `Syst... | `Write()` @ `0xC8D820`, `Read()` @ `0xC8D730` |
| `SpellbookAbilitySetRecord` | Bidirectional | `IndexedAbilitySetRecord` | `itemId` : `System.UInt64` @ `0x18` | `Serialize()` @ `0xC8D920`, `Deserialize()` @ `0xC8D8D0` |
| `SpellbookCollectionRecord` | Bidirectional | `Object` | `spellbooks` : `System.Collections.Generic.List<Common.Records.SpellbookAbilitySetRecord>` @ `0x10` | `Serialize()` @ `0xC8DAF0`, `Deserialize()` @ `0xC8D970` |
| `TextureDefinitionRecord` | Server → Client (incoming) | `Object` | `id` : `System.Byte` @ `0x10`, `textureHID` : `System.String` @ `0x18`, `lerpRHID` : `System.String` @ `0x20`, `lerpGHID` : `System.String` @ `0x28`, `lerpBHID` : `System.String` @ `0x30`, `color` : `... | `Write()` @ `0xC8DE10`, `Read()` @ `0xC8DC40` |
| `TraitClassRecord` | Bidirectional | `Object` | `ClassHID` : `System.String` @ `0x10`, `TraitHID` : `System.String` @ `0x18`, `Autogrant` : `System.Boolean` @ `0x20` | `Read()` @ `0xC8DFE0`, `Serialize()` @ `0xC60AC0`, `Deserialize()` @ `0xC60A50` |
| `TraitRaceRecord` | Bidirectional | `Object` | `RaceHID` : `System.String` @ `0x10`, `TraitHID` : `System.String` @ `0x18`, `Autogrant` : `System.Boolean` @ `0x20` | `Read()` @ `0xC8E090`, `Serialize()` @ `0xC60AC0`, `Deserialize()` @ `0xC60A50` |
| `TraitRecord` | Bidirectional | `Object` | `Major` : `System.String` @ `0x0`, `Minor` : `System.String` @ `0x0`, `HID` : `System.String` @ `0x10`, `AnyRace` : `System.Boolean` @ `0x18`, `AnyClass` : `System.Boolean` @ `0x19`, `Rank` : `System.... | `Serialize()` @ `0xC8E2B0`, `Deserialize()` @ `0xC8E140`, `GetDescriptions()` @ `0xC8E230` |
| `ZoneRecord` | Bidirectional | `Object` | `zoneHid` : `System.String` @ `0x10`, `zoneName` : `System.String` @ `0x18` | `Serialize()` @ `0xC60A00`, `Deserialize()` @ `0xC609A0` |

### Common.dll / Scripts.Common.Records

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `CharacterClassRecord` | Bidirectional | `Object` | _none_ | `Serialize()` @ `0xC60A00`, `Deserialize()` @ `0xC609A0` |
| `CharacterRaceClassDefaultRecord` | Bidirectional | `Object` | _none_ | `Serialize()` @ `0xC60A00`, `Deserialize()` @ `0xC609A0` |
| `CharacterRaceRecord` | Bidirectional | `Object` | _none_ | `Serialize()` @ `0xC60AC0`, `Deserialize()` @ `0xC60A50` |
| `DeityRecord` | Bidirectional | `Object` | _none_ | `Serialize()` @ `0xC6A220`, `Deserialize()` @ `0xC6A190` |
| `RaceClassAllowedDeityRecord` | Bidirectional | `Object` | _none_ | `Read()` @ `0xC717A0`, `Allowed()` @ `0xC71760`, `Serialize()` @ `0xC6A220`, `Deserialize()` @ `0xC6A190` |
| `RaceClassAllowedLocationRecord` | Bidirectional | `Object` | _none_ | `Allowed()` @ `0xC71870`, `Serialize()` @ `0xC71950`, `Deserialize()` @ `0xC718C0` |

## *Message — Message Types

### Client.dll / Client

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `HudPopupMessage` | — | `MonoBehaviour` | `_text` : `Client.UI2024.MnmText` @ `0x20`, `_canvasGroup` : `UnityEngine.CanvasGroup` @ `0x28`, `Duration` : `System.Single` @ `0x30`, `_timeRemaining` : `System.Single` @ `0x34`, `_visibility` : `Sy... | `Update()` @ `0x9E6AA0`, `Set()` @ `0x9E6990`, `SetServerAnnouncement()` @ `0x9E6530`, `SetErrorMessage()` @ `0x9E6300`, `SetWarningMessage()` @ `0x9E6760`, `EndEarly()` @ `0x9E62F0` |

### Client.dll / Client.Chat

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `ChatMessage` | — | `Object` | `text` : `System.String` @ `0x10`, `textObject` : `TMPro.TextMeshProUGUI` @ `0x18`, `messageType` : `Client.Chat.ChatMessage.MessageType` @ `0x20` | _none_ |

### Common.dll / Common.Packets

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `AssistMessage` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `targetEntityId` : `System.UInt32` @ `0x10`, `assistPet` : `System.Boolean` @ `0x14` | `Serialize()` @ `0xC76F80`, `Deserialize()` @ `0xC76E90` |
| `AuctionMessage` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `message` : `System.String` @ `0x10` | `Serialize()` @ `0xC77150`, `Deserialize()` @ `0xC77060` |
| `ChatMessage` | Bidirectional | `Packet` | `MAX_PUT_LENGTH` : `System.Int32` @ `0x0`, `opCode` : `System.UInt16` @ `0x0`, `message` : `System.String` @ `0x10`, `channel` : `Common.Library.ChatLibrary.Channel` @ `0x18`, `language` : `System.Str... | `Serialize()` @ `0xC7AED0`, `Deserialize()` @ `0xC7AD30` |
| `EmoteMessage` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `message` : `System.String` @ `0x10` | `Serialize()` @ `0xC922B0`, `Deserialize()` @ `0xC921C0` |
| `GuildMessage` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `officer` : `System.Boolean` @ `0x10`, `message` : `System.String` @ `0x18` | `Serialize()` @ `0xC99770`, `Deserialize()` @ `0xC99680` |
| `OOCMessage` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `message` : `System.String` @ `0x10` | `Serialize()` @ `0xCA4160`, `Deserialize()` @ `0xCA4070` |
| `PartyMessage` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `message` : `System.String` @ `0x10` | `Serialize()` @ `0xCA5750`, `Deserialize()` @ `0xCA5660` |
| `ShoutMessage` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `message` : `System.String` @ `0x10` | `Serialize()` @ `0xCAF490`, `Deserialize()` @ `0xCAF3A0` |
| `TellMessage` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `name` : `System.String` @ `0x10`, `message` : `System.String` @ `0x18` | `Serialize()` @ `0xCB3190`, `Deserialize()` @ `0xCB3090` |

### Common.dll / Common.Packets.World

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `ChatMessage` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `message` : `System.String` @ `0x10`, `channel` : `Common.Library.ChatLibrary.Channel` @ `0x18` | `Serialize()` @ `0xCA8380`, `Deserialize()` @ `0xCA8280` |
| `ErrorMessage` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `title` : `System.String` @ `0x10`, `message` : `System.String` @ `0x18` | `Serialize()` @ `0xCF7A80`, `Deserialize()` @ `0xCF7980` |

## *Request — Requests

### Common.dll / (global)

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `BatchErrorRequest` | — | `Object` | `errors` : `System.Collections.Generic.List<Common.Net.ServerErrorReporter.ErrorData>` @ `0x10` | _none_ |

### Common.dll / Common.LoginPackets

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `ServerListRequest` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `token` : `System.String` @ `0x10` | `Serialize()` @ `0xD1CA90`, `Deserialize()` @ `0xD1C9A0` |

### Common.dll / Common.Net

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `AccountModerationRequest` | — | `Object` | `requester` : `System.UInt64` @ `0x10`, `ban` : `System.Nullable<System.Boolean>` @ `0x18`, `squelch` : `System.Nullable<System.Boolean>` @ `0x1A`, `freeze` : `System.Nullable<System.Boolean>` @ `0x1C... | `Reset()` @ `0xCE89B0`, `SetModeration()` @ `0xCE89C0` |
| `PlayerSnapshotRequest` | — | `Object` | `server_short_name` : `System.String` @ `0x10`, `server_name` : `System.String` @ `0x18`, `timestamp` : `System.Int64` @ `0x20`, `entities` : `Common.Net.PlayerSnapshotEntity[]` @ `0x28` | _none_ |
| `ServerRegistrationRequest` | — | `Object` | `name` : `System.String` @ `0x10`, `short_name` : `System.String` @ `0x18`, `address` : `System.String` @ `0x20`, `port` : `System.Int32` @ `0x28`, `admin_port` : `System.Int32` @ `0x2C`, `hmac_key` :... | `Reset()` @ `0xD007C0` |
| `TokenVerifyRequest` | — | `Object` | `token` : `System.String` @ `0x10`, `zone` : `System.String` @ `0x18` | `Reset()` @ `0xD01570` |
| `WorldHeartbeatRequest` | — | `Object` | `server_type` : `System.String` @ `0x10`, `server_name` : `System.String` @ `0x18`, `server_short_name` : `System.String` @ `0x20`, `timestamp` : `System.Int64` @ `0x28`, `metrics` : `Common.Net.World... | _none_ |
| `WorldQueueCheckOrJoinRequest` | — | `Object` | `server_short_name` : `System.String` @ `0x10`, `account_id` : `System.UInt64` @ `0x18`, `status_hid` : `System.String` @ `0x20`, `current_population` : `System.Int32` @ `0x28` | `Reset()` @ `0xD030C0` |

### Common.dll / Common.Packets

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `DuelConfirmationRequest` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `duelerName` : `System.String` @ `0x10`, `toDeath` : `System.Boolean` @ `0x18` | `Serialize()` @ `0xC91D80`, `Deserialize()` @ `0xC91C80` |
| `GmViewStatsRequest` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC96A00`, `Deserialize()` @ `0xC96940` |
| `GuildInviteClientConfirmationRequest` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `guildInviterName` : `System.String` @ `0x10`, `guildName` : `System.String` @ `0x18`, `guildInviteID` : `System.UInt32` @ `0x20` | `Serialize()` @ `0xC993C0`, `Deserialize()` @ `0xC992B0` |
| `InspectEquipmentRequest` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `targetCharacterID` : `System.UInt32` @ `0x10` | `Serialize()` @ `0xC9C850`, `Deserialize()` @ `0xC9C770` |
| `ItemInformationRequest` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `HIDs` : `System.String[]` @ `0x10` | `Serialize()` @ `0xC9DF90`, `Deserialize()` @ `0xC9DEA0` |
| `MerchantQuoteRequest` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `entityID` : `System.UInt32` @ `0x10`, `itemID` : `System.UInt64` @ `0x18` | `Serialize()` @ `0xCA0A90`, `Deserialize()` @ `0xCA09A0` |
| `RecipeRequest` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `craftingItemID` : `System.UInt64` @ `0x10`, `craftingItemType` : `System.String` @ `0x18`, `abilityHID` : `System.String` @ `0x20` | `Serialize()` @ `0xCAA4B0`, `Deserialize()` @ `0xCAA3A0` |
| `RezClientConfirmationRequest` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `rezzerName` : `System.String` @ `0x10`, `expPercentage` : `System.Int16` @ `0x18`, `rezID` : `System.UInt32` @ `0x1C` | `Serialize()` @ `0xCAE040`, `Deserialize()` @ `0xCADF40` |
| `SmartScribeRequest` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `scrollItemID` : `System.UInt64` @ `0x10`, `preferredDestination` : `System.String` @ `0x18` | `Serialize()` @ `0xCB0090`, `Deserialize()` @ `0xCAFF90` |
| `UpdatePetsRequest` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xCB9460`, `Deserialize()` @ `0xCB93A0` |
| `ZoneAccountChangeRequest` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `name` : `System.String` @ `0x10`, `changeSquelched` : `System.Boolean` @ `0x18`, `changeBanned` : `System.Boolean` @ `0x19`, `changeFrozen` : `System.Boolean` @ `0... | `Serialize()` @ `0xCBD7E0`, `Deserialize()` @ `0xCBD6C0` |

### Common.dll / Scripts.Common.Packets.World

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `GameDataRequest` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC6B2B0`, `Deserialize()` @ `0xC6B1F0` |

## *Response — Responses

### Common.dll / (global)

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `ErrorSubmissionResponse` | — | `Object` | `success` : `System.Boolean` @ `0x10`, `message` : `System.String` @ `0x18`, `count` : `System.Int32` @ `0x20` | _none_ |

### Common.dll / Common.Net

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `HeartbeatResponse` | — | `Object` | `success` : `System.Boolean` @ `0x10`, `server_time` : `System.Int64` @ `0x18`, `error` : `System.String` @ `0x20` | _none_ |
| `LoginResponse` | — | `Object` | `token` : `System.String` @ `0x10`, `account` : `Common.Net.AccountInfo` @ `0x18` | _none_ |
| `ModerationResponse` | — | `Object` | `success` : `System.Boolean` @ `0x10`, `message` : `System.String` @ `0x18`, `account` : `Common.Net.AccountModerationStatus` @ `0x20` | _none_ |
| `PlayerSnapshotResponse` | — | `Object` | `success` : `System.Boolean` @ `0x10` | _none_ |
| `ServerListResponse` | — | `Object` | `servers` : `System.Collections.Generic.List<Common.Net.GameServerInfo>` @ `0x10` | _none_ |
| `ServerRegistrationResponse` | — | `Object` | `success` : `System.Boolean` @ `0x10`, `server_id` : `System.String` @ `0x18`, `message` : `System.String` @ `0x20` | _none_ |
| `TokenVerifyResponse` | — | `Object` | `account_id` : `System.UInt64` @ `0x10`, `username` : `System.String` @ `0x18`, `status_hid` : `System.String` @ `0x20`, `banned` : `System.Boolean` @ `0x28`, `chat_squelched` : `System.Boolean` @ `0x... | _none_ |
| `WorldQueueCheckOrJoinResponse` | — | `Object` | `success` : `System.Boolean` @ `0x10`, `result` : `System.String` @ `0x18`, `position` : `System.Int32` @ `0x20`, `poll_after_ms` : `System.Int32` @ `0x24`, `message` : `System.String` @ `0x28`, `erro... | _none_ |

### Common.dll / Common.Packets

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `AltarHandInItemsResponse` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC76C70`, `Deserialize()` @ `0xC76BB0` |
| `ClientFactionsResponse` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `factionValues` : `System.Collections.Generic.Dictionary<System.String,System.Int16>` @ `0x10`, `factionNames` : `System.Collections.Generic.Dictionary<System.Strin... | `Serialize()` @ `0xC7B520`, `Deserialize()` @ `0xC7B2E0` |
| `DevNoteLoadResponse` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `DevNotes` : `System.Collections.Generic.List<Common.Records.DevNoteRecord>` @ `0x10` | `Serialize()` @ `0xC906D0`, `Deserialize()` @ `0xC90420` |
| `DuelConfirmationResponse` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `accepted` : `System.Boolean` @ `0x10` | `Serialize()` @ `0xC91F40`, `Deserialize()` @ `0xC91E60` |
| `GmViewStatsResponse` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `playerCount` : `System.Int32` @ `0x10`, `serverName` : `System.String` @ `0x18`, `flyEnabled` : `System.Boolean` @ `0x20`, `hideEnabled` : `System.Boolean` @ `0x21... | `Serialize()` @ `0xC96C00`, `Deserialize()` @ `0xC96AB0` |
| `GroupFinderListingsResponse` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `listings` : `System.Collections.Generic.List<Common.Packets.GroupFinderListingsResponse.GroupListingRecord>` @ `0x10` | `Serialize()` @ `0xC98280`, `Deserialize()` @ `0xC980B0` |
| `GuildInviteClientConfirmationResponse` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `guildInviteID` : `System.UInt32` @ `0x10`, `accepted` : `System.Boolean` @ `0x14` | `Serialize()` @ `0xC995A0`, `Deserialize()` @ `0xC994B0` |
| `HandInItemsResponse` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC99E00`, `Deserialize()` @ `0xC99D40` |
| `InspectEquipmentResponse` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `characterID` : `System.UInt32` @ `0x10`, `characterName` : `System.String` @ `0x18`, `equipment` : `System.Collections.Generic.List<Common.Packets.EquipmentItemDat... | `Serialize()` @ `0xC9CB90`, `Deserialize()` @ `0xC9C920` |
| `RecipeResponse` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `name` : `System.String` @ `0x10`, `craftingItemID` : `System.UInt64` @ `0x18`, `craftingItemType` : `System.String` @ `0x20`, `craftingSkill` : `System.String` @ `... | `Serialize()` @ `0xCAA7D0`, `Deserialize()` @ `0xCAA5A0` |
| `RequestNpcHidResponse` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `npcHid` : `System.String` @ `0x10` | `Serialize()` @ `0xCAC100`, `Deserialize()` @ `0xCAC010` |
| `RezClientConfirmationResponse` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `rezID` : `System.UInt32` @ `0x10`, `accepted` : `System.Boolean` @ `0x14` | `Serialize()` @ `0xCAE220`, `Deserialize()` @ `0xCAE130` |
| `SmartScribeResponse` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `success` : `System.Boolean` @ `0x10`, `errorMessage` : `System.String` @ `0x18`, `bookTypeHID` : `System.String` @ `0x20`, `bookID` : `System.UInt64` @ `0x28`, `ta... | `Serialize()` @ `0xCB02B0`, `Deserialize()` @ `0xCB0170` |

### Common.dll / Common.Packets.World

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `CreateCharacterResponse` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `id` : `System.UInt32` @ `0x10` | `Serialize()` @ `0xCF7020`, `Deserialize()` @ `0xCF6F40` |
| `DeleteCharacterResponse` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xCF71B0`, `Deserialize()` @ `0xCF70F0` |
| `EnterWorldResponse` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `status` : `System.String` @ `0x10`, `id` : `System.UInt32` @ `0x18`, `address` : `System.String` @ `0x20`, `port` : `System.Int32` @ `0x28`, `message` : `System.St... | `Serialize()` @ `0xCF7660`, `Deserialize()` @ `0xCF7500` |
| `RequestCharacterDataResponse` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xCFE860`, `Deserialize()` @ `0xCFE080` |

### Common.dll / Scripts.Common.Packets.World

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `GameDataResponse` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `gameData` : `GameData` @ `0x10` | `Serialize()` @ `0xC6B460`, `Deserialize()` @ `0xC6B360` |

## *Packet — Packets

### Common.dll / Common.Packets

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `AfkPacket` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `state` : `Common.Packets.AfkPacket.AfkState` @ `0x10`, `message` : `System.String` @ `0x18` | `Serialize()` @ `0xC76920`, `Deserialize()` @ `0xC76830` |
| `BugReportPacket` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `summary` : `System.String` @ `0x10`, `description` : `System.String` @ `0x18`, `mainCategory` : `System.String` @ `0x20`, `subCategory` : `System.String` @ `0x28`,... | `Serialize()` @ `0xC78E10`, `Deserialize()` @ `0xC78B00` |
| `ClientConfirmationPacket` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `message` : `System.String` @ `0x10`, `confirmationAnswer` : `System.Boolean` @ `0x18`, `timeout` : `System.Single` @ `0x1C`, `id` : `System.UInt32` @ `0x20` | `Serialize()` @ `0xC7B1A0`, `Deserialize()` @ `0xC7B080` |
| `DepopZonePacket` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC8F710`, `Deserialize()` @ `0xC8F650` |
| `DistanceCommandPacket` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC91820`, `Deserialize()` @ `0xC91760` |
| `EquippedItemsCommandPacket` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC94F10`, `Deserialize()` @ `0xC94E50` |
| `FriendClientPacket` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `clientName` : `System.String` @ `0x10` | `Serialize()` @ `0xC95800`, `Deserialize()` @ `0xC95710` |
| `GuildDisbandPacket` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `guildId` : `System.UInt32` @ `0x10` | `Serialize()` @ `0xC991E0`, `Deserialize()` @ `0xC99100` |
| `HotButtonsPacket` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `hotButtons` : `HotbuttonRecord[]` @ `0x10` | `Serialize()` @ `0xC9A540`, `Deserialize()` @ `0xC9A380` |
| `IgnoreClientPacket` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `clientName` : `System.String` @ `0x10`, `IgnoreAccount` : `System.Boolean` @ `0x18` | `Serialize()` @ `0xC9C290`, `Deserialize()` @ `0xC9C190` |
| `ListIgnoredClientsPacket` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC9F420`, `Deserialize()` @ `0xC9F360` |
| `LosCommandPacket` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xC9F920`, `Deserialize()` @ `0xC9F860` |
| `MacrosPacket` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `remove` : `System.Boolean` @ `0x10`, `macros` : `ClientMacroRecord[]` @ `0x18` | `Serialize()` @ `0xC9FBA0`, `Deserialize()` @ `0xC9F9D0` |
| `MotdPacket` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `fromUserCommand` : `System.Boolean` @ `0x10` | `Serialize()` @ `0xCA14E0`, `Deserialize()` @ `0xCA1400` |
| `Packet` | Bidirectional | `Object` | _none_ | `Deserialize()` @ `0x4C56C0`, `Serialize()` @ `0x4C56C0` |
| `SetMotdPacket` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `set` : `System.Boolean` @ `0x10`, `motd` : `System.String` @ `0x18` | `Serialize()` @ `0xCAEF30`, `Deserialize()` @ `0xCAEE40` |
| `SetNpcCommandPacket` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `commandId` : `System.Int32` @ `0x10` | `Serialize()` @ `0xCAF0F0`, `Deserialize()` @ `0xCAF010` |
| `SplitCoinWithGroupPacket` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `coin` : `Common.Currency` @ `0x10` | `Serialize()` @ `0xCB1D80`, `Deserialize()` @ `0xCB1C90` |
| `TimeModPacket` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `timeMod` : `System.Single` @ `0x10` | `Serialize()` @ `0xCB3350`, `Deserialize()` @ `0xCB3270` |
| `TradeTogglePacket` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `state` : `Common.Packets.TradeTogglePacket.TradeToggleState` @ `0x10` | `Serialize()` @ `0xCB4490`, `Deserialize()` @ `0xCB43B0` |
| `UpdateAbilitiesPacket` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0`, `_skills` : `Common.Records.IndexedAbilitySetRecord` @ `0x10`, `_innates` : `Common.Records.IndexedAbilitySetRecord` @ `0x18`, `_spellbooks` : `Common.Records.Spell... | `SetSkills()` @ `0xCB4EB0`, `SetInnates()` @ `0xCB4E50`, `SetSpellbooks()` @ `0xCB4ED0`, `SetMemorized()` @ `0xCB4E70`, `SetGrantedAbilities()` @ `0xCB4E30`, `Serialize()` @ `0xCB4C90`, `Deserialize()... |
| `YellPacket` | Bidirectional | `Packet` | `opCode` : `System.UInt16` @ `0x0` | `Serialize()` @ `0xCBD610`, `Deserialize()` @ `0xCBD550` |

## *Command — Commands

### Client.dll / (global)

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `BackgroundFpsChatCommand` | — | `MonoBehaviour` | `_targetFramerateUserSetting` : `Client.UI2024.PersistentInt` @ `0x20`, `_targetBackgroundFramerateUserSetting` : `Client.UI2024.PersistentInt` @ `0x28` | `Start()` @ `0x934830`, `<Start>b__2_0()` @ `0x934A10` |
| `BlitCommand` | — | `Object` | `bodyPartID` : `System.Int32` @ `0x10`, `textureHID` : `System.String` @ `0x18`, `lerpRHID` : `System.String` @ `0x20`, `lerpGHID` : `System.String` @ `0x28`, `lerpBHID` : `System.String` @ `0x30`, `c... | `ToString()` @ `0xBEB680` |
| `FpsChatCommand` | — | `MonoBehaviour` | `_targetFramerateUserSetting` : `Client.UI2024.PersistentInt` @ `0x20`, `_targetBackgroundFramerateUserSetting` : `Client.UI2024.PersistentInt` @ `0x28` | `Start()` @ `0x93A230`, `<Start>b__2_0()` @ `0x93A410` |
| `IChatCommand` | — | `—` | _none_ | `ProcessCommand()` @ `0x4CDB70` |
| `LoadItemModelCommand` | — | `LoadModelCommand` | `modelConfig` : `Client.ModelConfiguration` @ `0x48`, `slotName` : `System.String` @ `0x50` | _none_ |
| `LoadModelCommand` | — | `Object` | `owner` : `Client.Entity` @ `0x10`, `model` : `System.String` @ `0x18`, `scale` : `System.Single` @ `0x20`, `textureDefintions` : `Common.Records.TextureDefinitionRecord[]` @ `0x28`, `attachmentDefini... | _none_ |

### Client.dll / Client

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `AfkChatCommand` | — | `ChatCommandObject` | `_helpText` : `System.String` @ `0x0` | _none_ |
| `AssistCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB63C90` |
| `CharInfoChatCommand` | — | `ChatCommandObject` | `_helpText` : `System.String` @ `0x0` | _none_ |
| `ChatCommand` | — | `Object` | `lastReloadTime` : `System.Single` @ `0x0`, `reloadCooldown` : `System.Single` @ `0x4` | `GetAuthority()` @ `0x99AB50`, `GetAccountAuthority()` @ `0x99AA60`, `ParseCommand()` @ `0x99B2B0`, `GMAccountChangeHelper()` @ `0x99A680`, `OpenPetitionView()` @ `0x99B030`, `OpenBugReportView()` @ `... |
| `ClearChatCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB66AC0` |
| `DeityChatCommand` | — | `ChatCommandObject` | _none_ | `SetAgnostic()` @ `0xB67D00`, `SetDeity()` @ `0xB67ED0`, `IsAgnostic()` @ `0xB67BC0`, `IsValidDeityHid()` @ `0xB67C00`, `<.ctor>b__0_0()` @ `0xB681B0` |
| `DepopZoneCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB689B0` |
| `DevTempCommand` | — | `ChatCommandObject` | `_helpText` : `System.String` @ `0x0` | `SendUsageMessage()` @ `0xB69220`, `GetExecutor()` @ `0xB69190`, `DoTable()` @ `0xB690F0`, `UpdatePlacement()` @ `0x6AE350`, `<.ctor>b__2_0()` @ `0xB69290` |
| `DisbandPartyCommand` | — | `ChatCommandObject` | `_helpText` : `System.String` @ `0x0` | _none_ |
| `DismountChatCommand` | — | `ChatCommandObject` | `_helpText` : `System.String` @ `0x0` | _none_ |
| `DistanceCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB69990` |
| `EarthquakeCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB69B20` |
| `EmoteCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB69DA0` |
| `EquippedItemsCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB6A0A0` |
| `FilterChatCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB6A230` |
| `FriendChatCommand` | — | `ChatCommandObject` | `_helpText` : `System.String` @ `0x0` | _none_ |
| `FriendsChatCommand` | — | `ChatCommandObject` | `_helpText` : `System.String` @ `0x0` | _none_ |
| `GoToCommand` | — | `Object` | `NextPlayerArg` : `System.String` @ `0x0`, `PreviousPlayerArg` : `System.String` @ `0x0`, `RandomArg` : `System.String` @ `0x0` | `ProcessCommand()` @ `0xB6ADD0` |
| `GotoStaticCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB6B360` |
| `HideBackCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB6BB30` |
| `HideCorpseChatCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB6BD60`, `SendUsageMessage()` @ `0xB6C200`, `SendCurrentPermanentHiddenCorpseTypes()` @ `0xB6C110` |
| `HideHelmCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB6C440` |
| `IgnoreClientChatCommand` | — | `ChatCommandObject` | `_helpText` : `System.String` @ `0x0` | _none_ |
| `ListIgnoredClientsChatCommand` | — | `ChatCommandObject` | `_helpText` : `System.String` @ `0x0` | _none_ |
| `LosCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB6D460` |
| `MotdCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB6D5F0` |
| `MountChatCommand` | — | `ChatCommandObject` | `_helpText` : `System.String` @ `0x0` | _none_ |
| `ReloadInventoriesCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB6FB60` |
| `ReloadInventoryCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB6FD00` |
| `ReviveCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB70E20` |
| `RollRandomCommand` | — | `Object` | `MAX_DICE_COUNT` : `System.UInt16` @ `0x0`, `MAX_DICE_SIDES` : `System.UInt16` @ `0x0`, `DEFAULT_MAX` : `System.UInt16` @ `0x0`, `USAGE_MESSAGE` : `System.String` @ `0x0`, `NUMBER_RANGE_ERROR` : `Syst... | `ProcessCommand()` @ `0xB718F0`, `ParseArguments()` @ `0xB70FB0`, `ParseSingleArgument()` @ `0xB71640`, `ParseDiceNotation()` @ `0xB713E0`, `ParseDiceCount()` @ `0xB71340`, `ValidateDiceLimits()` @ `0... |
| `SearchChatCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB71F60`, `TryGetSearchCommand()` @ `0xB721D0`, `SendUsageError()` @ `0xB72130` |
| `SetChatCommand` | — | `ChatCommandObject` | `_helpText` : `System.String` @ `0x0` | `SendUsageMessage()` @ `0xB72AE0`, `GetExecutor()` @ `0xB726F0`, `SetFaction()` @ `0xB730E0`, `SetZoneLevel()` @ `0xB742F0`, `SetZoneDamage()` @ `0xB74050`, `SetZoneHp()` @ `0xB741A0`, `SetLevel()` @ ... |
| `SetMotdCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB748F0` |
| `ShowCorpseChatCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB757D0`, `SendUsageError()` @ `0xB75970` |
| `ShowNameChatCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB75BA0`, `ValidateArguments()` @ `0xB76260`, `UpdateSettings()` @ `0xB761D0`, `TryParseShowNameSetting()` @ `0xB75E50`, `TryParseTargetType()` @ `0xB760C0`, `SendUsageError()` ... |
| `SplitChatCommand` | — | `ChatCommandObject` | `_helpText` : `System.String` @ `0x0` | `TryParseArguments()` @ `0xB764D0`, `<.ctor>b__1_0()` @ `0xB76670` |
| `TimeModChatCommand` | — | `ChatCommandObject` | `_helpText` : `System.String` @ `0x0` | _none_ |
| `UnlockCorpseCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB79FD0` |
| `WhoTargetCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB7D940` |
| `YellCommand` | — | `Object` | _none_ | `ProcessCommand()` @ `0xB7DCC0` |

### Common.dll / (global)

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `LoadCommand` | — | `ValueType` | `scene` : `UnityEngine.AddressableAssets.AssetReference` @ `0x10`, `priority` : `System.Int32` @ `0x18` | _none_ |

### Common.dll / Common.Packets

| Class | Direction | Parent | Fields | Key Methods |
|-------|-----------|--------|--------|-------------|
| `ISearchCommand` | — | `—` | _none_ | _none_ |
| `TrackingCommand` | — | `Enum` | `value__` : `System.Int32` @ `0x10`, `Close` : `Common.Packets.TrackingCommand` @ `0x0`, `Open` : `Common.Packets.TrackingCommand` @ `0x0`, `Update` : `Common.Packets.TrackingCommand` @ `0x0`, `Track`... | _none_ |

---

## Summary Counts

| Category | Count |
|----------|-------|
| Cmd* — Client → Server Commands | 103 |
| *Record — Data Records (Server → Client Payloads) | 44 |
| *Message — Message Types | 13 |
| *Request — Requests | 20 |
| *Response — Responses | 27 |
| *Packet — Packets | 22 |
| *Command — Commands | 50 |
| **Total** | **279** |

## Assemblies Scanned

- `Client.dll` — 52 matching classes
- `Common.dll` — 227 matching classes