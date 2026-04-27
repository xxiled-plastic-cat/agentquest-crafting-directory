import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const CRAFTING_DIR = path.join(rootDir, "world", "crafting");
const FORBIDDEN_PROCESSED_TOKENS = [
  "ingot",
  "rivet",
  "buckle",
  "plate",
  "bar",
  "chain_links"
];
const ALLOWED_ITEM_CATEGORIES = new Set(["weapon", "armor"]);

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

async function readCatalog(fileName, rootKey) {
  const filePath = path.join(CRAFTING_DIR, fileName);
  const raw = await readFile(filePath, "utf8");
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`${fileName} is not valid JSON: ${error.message}`);
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${fileName} must be a JSON object.`);
  }

  if (!parsed[rootKey] || typeof parsed[rootKey] !== "object" || Array.isArray(parsed[rootKey])) {
    throw new Error(`${fileName} must contain an object at "${rootKey}".`);
  }

  return parsed[rootKey];
}

function hasForbiddenProcessedToken(id) {
  const lowered = id.toLowerCase();
  return FORBIDDEN_PROCESSED_TOKENS.some((token) => {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`(^|[_-])${escaped}([_-]|$)`);
    return pattern.test(lowered);
  });
}

function validateItems(items, errors) {
  for (const [key, item] of Object.entries(items)) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      errors.push(`Item "${key}" must be an object.`);
      continue;
    }

    if (item.id !== key) {
      errors.push(`Item key "${key}" must match item.id "${item.id ?? "undefined"}".`);
    }

    if (!isNonEmptyString(item.lore)) {
      errors.push(`Item "${key}" must include a non-empty lore string.`);
    }

    if (!ALLOWED_ITEM_CATEGORIES.has(item.category)) {
      errors.push(`Item "${key}" has invalid category "${item.category}". Only "weapon" or "armor" are allowed.`);
    }

    if (item.stackable !== false) {
      errors.push(`Item "${key}" must set stackable to false.`);
    }
  }
}

function validateIngredients(ingredients, errors) {
  for (const [key, ingredient] of Object.entries(ingredients)) {
    if (!ingredient || typeof ingredient !== "object" || Array.isArray(ingredient)) {
      errors.push(`Ingredient "${key}" must be an object.`);
      continue;
    }

    if (ingredient.id !== key) {
      errors.push(`Ingredient key "${key}" must match ingredient.id "${ingredient.id ?? "undefined"}".`);
    }

    if (hasForbiddenProcessedToken(key)) {
      errors.push(`Ingredient "${key}" appears to be processed. Use raw/simple materials only.`);
    }
  }
}

function validateRecipes(recipes, items, ingredients, errors) {
  for (const [key, recipe] of Object.entries(recipes)) {
    if (!recipe || typeof recipe !== "object" || Array.isArray(recipe)) {
      errors.push(`Recipe "${key}" must be an object.`);
      continue;
    }

    if (recipe.id !== key) {
      errors.push(`Recipe key "${key}" must match recipe.id "${recipe.id ?? "undefined"}".`);
    }

    if (!isNonEmptyString(recipe.creator)) {
      errors.push(`Recipe "${key}" must include a non-empty creator string.`);
    }

    if (!isNonEmptyString(recipe.outputItemId) || !items[recipe.outputItemId]) {
      errors.push(`Recipe "${key}" outputItemId "${recipe.outputItemId ?? "undefined"}" is missing in items.json.`);
    }

    if (!Array.isArray(recipe.ingredients)) {
      errors.push(`Recipe "${key}" ingredients must be an array.`);
      continue;
    }

    for (const ingredientRef of recipe.ingredients) {
      if (!ingredientRef || typeof ingredientRef !== "object") {
        errors.push(`Recipe "${key}" has an ingredient entry that is not an object.`);
        continue;
      }

      const ingredientId = ingredientRef.itemId;
      if (!isNonEmptyString(ingredientId)) {
        errors.push(`Recipe "${key}" has an ingredient missing itemId.`);
        continue;
      }

      if (!ingredients[ingredientId]) {
        errors.push(`Recipe "${key}" references unknown ingredient "${ingredientId}".`);
      }
    }
  }
}

async function main() {
  const errors = [];

  try {
    const [items, ingredients, recipes] = await Promise.all([
      readCatalog("items.json", "items"),
      readCatalog("ingredients.json", "ingredients"),
      readCatalog("recipes.json", "recipes")
    ]);

    validateItems(items, errors);
    validateIngredients(ingredients, errors);
    validateRecipes(recipes, items, ingredients, errors);
  } catch (error) {
    console.error(`Catalog validation failed: ${error.message}`);
    process.exit(1);
  }

  if (errors.length > 0) {
    console.error("Catalog validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("Catalog validation passed.");
}

main();
