export const ingredients = [
  { key: "water", label: "Hydration", name: "Water", min: 1, max: 150, decimals: 0 },
  { key: "salt", label: "Salt", name: "Salt", min: 0, max: 10, decimals: 1 },
  { key: "yeast", label: "Instant yeast", name: "Instant yeast", min: 0, max: 10, decimals: 2 },
  { key: "oliveOil", label: "Olive oil", name: "Olive oil", min: 0, max: 30, decimals: 1 },
  { key: "sugar", label: "Sugar", name: "Sugar", min: 0, max: 30, decimals: 1 },
] as const;

export type Ingredient = (typeof ingredients)[number]["key"];
export type DoughFields = Record<Ingredient | "count" | "weight", string>;

type Preset = {
  id: string;
  name: string;
  time: string;
  fields: DoughFields;
  flour: string;
  steps: string[];
  source: { name: string; href: string; note: string };
};

export const presets: Preset[] = [
  {
    id: "neapolitan",
    name: "Neapolitan",
    time: "12–24 h · room temp",
    fields: {
      count: "2",
      weight: "240",
      water: "60",
      salt: "3",
      yeast: "0.05",
      oliveOil: "0",
      sugar: "0",
    },
    flour: "Pizza flour (type 00 or 0, W 250–320)",
    steps: [
      "Mix the water, salt, flour, and instant yeast into a smooth dough. Keep covered while resting.",
      "Let the dough relax, divide into balls, then leave covered to ferment. Allow 12–24 hours in total at 18–20°C; look for relaxed, airy dough that stretches easily.",
      "Stretch by hand, keeping air in the rim. Top lightly and bake in a fully heated pizza oven according to its instructions.",
    ],
    source: {
      name: "AVPN · International regulations (2024)",
      href: "https://www.pizzanapoletana.org/public/pdf/Disciplinare-2024-ENG.pdf",
      note: "A starting formula within AVPN’s ingredient ranges. The yeast amount is a starting point, not a fixed schedule from AVPN. No olive oil or sugar in the preset dough.",
    },
  },
  {
    id: "quick-regular",
    name: "Quick regular",
    time: "2–4 h · room temp",
    fields: {
      count: "2",
      weight: "240",
      water: "63",
      salt: "2.5",
      yeast: "1.25",
      oliveOil: "3.5",
      sugar: "1.7",
    },
    flour: "All-purpose flour",
    steps: [
      "Mix all the ingredients and knead for 7–10 minutes, until smooth and elastic.",
      "Cover and let rise for 1–2 hours, until puffy. Divide into balls and let them relax while the oven heats. Stretch when the dough no longer springs back.",
      "Top and bake at 230°C for about 15–20 minutes, until golden. Preheat your stone or steel with the oven if using one.",
    ],
    source: {
      name: "King Arthur · The Easiest Pizza You’ll Ever Make",
      href: "https://www.kingarthurbaking.com/recipes/the-easiest-pizza-youll-ever-make-recipe",
      note: "Adapted with rounded baker’s percentages and the source’s optional olive oil included. Plan for the shorter end of the 2–4 hour window in a warm room.",
    },
  },
  {
    id: "quick-pan",
    name: "Quick pan",
    time: "2–4 h · room temp",
    fields: {
      count: "1",
      weight: "375",
      water: "80",
      salt: "2.5",
      yeast: "0.83",
      oliveOil: "4.17",
      sugar: "0",
    },
    flour: "Bread flour",
    steps: [
      "Mix all the ingredients thoroughly. Rest covered for 15 minutes, fold with wet hands, then repeat the rest and fold.",
      "Leave covered for 1–1½ hours, until puffy. Move into an olive-oiled pan and gently stretch. Rest if it resists, then proof for 45–60 minutes until bubbly.",
      "Preheat the oven to 260°C. Bake the base for 10–12 minutes, add toppings, then bake for another 12–14 minutes, until crisp and deeply golden. Pan size and thickness affect baking time.",
    ],
    source: {
      name: "King Arthur · Weeknight Detroit Pizza",
      href: "https://www.kingarthurbaking.com/recipes/weeknight-detroit-pizza-recipe",
      note: "Adapted from 75% to 80% hydration, with rounded percentages. The default portion uses 200 g flour. Extra olive oil for the pan is separate. Allow closer to 4 hours overall.",
    },
  },
];

export const defaultPreset = presets[1];

export function calculateDough(fields: DoughFields) {
  const total = Number(fields.count) * Number(fields.weight);
  const flour =
    total / (1 + ingredients.reduce((sum, item) => sum + Number(fields[item.key]), 0) / 100);
  return { total, flour };
}

export function formatAmount(amount: number, decimals: number) {
  if (amount > 0 && amount < 10 ** -decimals / 2) {
    return `<${(10 ** -decimals).toFixed(decimals)}`;
  }
  return new Intl.NumberFormat("en", { maximumFractionDigits: decimals }).format(amount);
}
