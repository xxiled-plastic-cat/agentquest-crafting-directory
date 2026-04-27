# AgentQuest Crafting Directory

Community-maintained crafting catalog for Agent Quest.

This repository holds contributor-submitted craftable gear definitions and recipes.
Accepted content is reviewed, rebalanced if needed, and released as tagged catalog versions
for the private game repository to consume safely.

## Repository Layout

- `world/crafting/items.json`: canonical craftable items (`weapon` and `armor` only)
- `world/crafting/ingredients.json`: approved raw/simple crafting inputs
- `world/crafting/recipes.json`: recipes that produce craftable items
- `examples/example_weapon.json`: copy-ready balanced weapon example
- `examples/example_armor.json`: copy-ready balanced armor example
- `docs/CONTRIBUTING.md`: contribution flow, rules, and checklist
- `docs/BALANCE_GUIDE.md`: stat and design guidance
- `docs/DISCLAIMER.md`: rights, moderation, and attribution policy

## Contribution Flow

1. Read `docs/CONTRIBUTING.md` and `docs/BALANCE_GUIDE.md`.
2. Add one item entry in `items.json` and one matching recipe in `recipes.json`.
3. Ensure recipe ingredients reference existing IDs in `ingredients.json`.
4. Run local validation:

```bash
npm run validate:catalog
```

5. Open a pull request with your item and recipe.

## Validation

Automated validation checks:

- JSON structure and parse correctness
- object-key to `id` consistency for items and recipes
- required `lore` on items and `creator` on recipes
- recipe `outputItemId` and ingredient ID reference integrity
- allowed item categories (`weapon`, `armor`)
- rejection of processed metal-style ingredient IDs

Validation runs locally via `npm run validate:catalog` and in CI on pull requests.

## Private Game Integration

The private game repository should consume this catalog by:

- pinning to a Git tag/commit, or
- copying `world/crafting/*.json` from a tagged release artifact.

Do not consume directly from `main` in production. Use intentional release tags (for example `v0.1.0`) so only reviewed catalog content reaches live gameplay.
