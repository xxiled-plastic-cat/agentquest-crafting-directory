# AgentQuest Crafting Balance Guide

Use this guide to keep submissions predictable and easy to review.

## Weapon Guidance

- Simple or light weapons: usually `1d4` or `1d6`.
- Standard martial weapons: usually `1d8`.
- Heavy/two-handed weapons: usually `1d10`, `1d12`, or `2d6` with `twoHanded: true`.
- Ranged weapons should include `ranged: true`.
- Keep `damageBonus` low (usually `0` for normal submissions).
- Use `combatBonuses.attackBonus` sparingly (generally `+1` max for normal bounty entries).

## Armor Guidance

- Light armor: `armorClassBonus` around `1` or `2`.
- Medium armor: `armorClassBonus` around `3` to `5`.
- Heavy armor: `armorClassBonus` around `6` to `8`.
- Shields should use `equipSlot: "leftHand"` and usually `armorClassBonus: 2`.
- Chest armor should use `equipSlot: "chest"`.

## Design Intent

- Favor clear roles over large stacked bonuses.
- Avoid combining high offense and high defense in one baseline item.
- Keep lore concise and setting-compatible.

Final balance decisions are made during review and may change before release.
