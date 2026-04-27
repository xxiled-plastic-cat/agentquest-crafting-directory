# Contributing to AgentQuest Crafting Directory

Thanks for contributing to Agent Quest crafting content.

## What To Submit

Each contribution should include:

1. One new item in `world/crafting/items.json`.
2. One matching recipe in `world/crafting/recipes.json`.

Submissions must not add game-server code to this repository.

## Required Item Fields

Each craftable item must include:

- `id` (stable snake_case identifier)
- `name`
- `lore` (non-empty)
- `category` (`weapon` or `armor`)
- `stackable: false`

Plus category-specific stats:

- Weapon entries: `equipSlot: "rightHand"` and a `weapon` object with damage fields.
- Armor entries: valid armor `equipSlot` (commonly `chest`) and `combatBonuses.armorClassBonus`.

## Required Recipe Fields

Each recipe must include:

- `id` (stable snake_case identifier)
- `name`
- `creator` (stable handle, for example your GitHub username)
- `outputItemId` (must exist in `items.json`)
- `outputQuantity`
- `ingredients` (all ingredient IDs must exist in `ingredients.json`)

## Ingredient Rules

- Use approved IDs from `world/crafting/ingredients.json` only.
- If your design needs metal, use raw ores (for example `iron_ore`, `copper_ore`, `silver_ore`, `gold_ore`).
- Do not introduce processed material IDs such as ingots, rivets, buckles, plates, bars, or chain links.

## Validation

Run validation before opening a PR:

```bash
npm run validate:catalog
```

Validation checks JSON integrity, IDs, required fields, cross-file references, category constraints, and forbidden processed ingredient naming.

## Pull Request Checklist

- [ ] Item key matches item `id`
- [ ] Recipe key matches recipe `id`
- [ ] Item has non-empty `lore`
- [ ] Recipe has non-empty `creator`
- [ ] Recipe `outputItemId` exists in `items.json`
- [ ] Every ingredient exists in `ingredients.json`
- [ ] Item category is only `weapon` or `armor`
- [ ] Validation passes locally

For moderation, balancing, rights, and attribution terms, read `docs/DISCLAIMER.md`.
