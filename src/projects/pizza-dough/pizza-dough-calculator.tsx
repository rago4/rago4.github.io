import { cn } from "cn";
import { ArrowLeft, ArrowUpRight, Check, Pizza, RotateCcw } from "lucide-preact";
import { useState } from "preact/hooks";
import { usePageTitle } from "../../use-page-title.ts";
import { calculateDough, defaultPreset, formatAmount, ingredients, presets } from "./dough.ts";
import type { DoughFields } from "./dough.ts";

const portionFields = [
  { key: "count", label: "Dough balls", min: 1, max: 100, step: "1" },
  { key: "weight", label: "Ball weight", min: 1, max: 5000, step: "any" },
] as const;

const percentageFields = ingredients.map((item) => ({ ...item, step: "any" }));
const allFields = [...portionFields, ...percentageFields];

export function PizzaDoughCalculator() {
  usePageTitle("Pizza dough calculator");

  const [preset, setPreset] = useState(defaultPreset);
  const [fields, setFields] = useState<DoughFields>({ ...defaultPreset.fields });
  const errors = Object.fromEntries(
    allFields.map((field) => {
      const value = Number(fields[field.key]);
      const valid =
        fields[field.key].trim() !== "" &&
        Number.isFinite(value) &&
        value >= field.min &&
        value <= field.max &&
        (field.key !== "count" || Number.isInteger(value));
      return [
        field.key,
        valid
          ? ""
          : `Enter ${field.min}–${field.max}${field.key === "count" ? " whole dough balls" : ""}.`,
      ];
    }),
  );
  const valid = Object.values(errors).every((error) => !error);
  const dough = valid ? calculateDough(fields) : null;
  const modified = allFields.some(
    (field) => Number(fields[field.key]) !== Number(preset.fields[field.key]),
  );
  const linkClass =
    "inline-flex min-h-11 items-center gap-2 rounded-lg text-sm text-zinc-600 transition-colors hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600 dark:text-zinc-400 dark:hover:text-zinc-50 dark:focus-visible:outline-orange-400";

  function renderField(field: (typeof allFields)[number], percentage: boolean) {
    return (
      <label
        key={field.key}
        class={cn("block min-w-0 text-sm", field.key === "water" && "col-span-2")}
      >
        <span class="mb-2 block text-zinc-700 dark:text-zinc-300">{field.label}</span>
        <span
          class={cn(
            "flex min-h-12 items-center gap-2 rounded-xl border bg-white px-3 transition-colors focus-within:ring-1 dark:bg-zinc-950",
            errors[field.key]
              ? "border-red-600 focus-within:border-red-600 focus-within:ring-red-600 dark:border-red-400 dark:focus-within:border-red-400 dark:focus-within:ring-red-400"
              : "border-zinc-300 hover:border-zinc-400 focus-within:border-orange-600 focus-within:ring-orange-600 dark:border-zinc-700 dark:hover:border-zinc-600 dark:focus-within:border-orange-400 dark:focus-within:ring-orange-400",
          )}
        >
          <input
            type="number"
            inputMode={field.key === "count" ? "numeric" : "decimal"}
            min={field.min}
            max={field.max}
            step={field.step}
            required
            value={fields[field.key]}
            onInput={(event) => setFields({ ...fields, [field.key]: event.currentTarget.value })}
            aria-invalid={Boolean(errors[field.key])}
            aria-describedby={
              errors[field.key] ? `${field.key}-error` : percentage ? "percentage-help" : undefined
            }
            class="min-h-12 w-full min-w-0 rounded-lg bg-transparent text-lg tabular-nums outline-none"
          />
          {(percentage || field.key === "weight") && (
            <span aria-hidden="true" class="shrink-0 text-sm text-zinc-500 dark:text-zinc-400">
              {percentage ? "%" : "g"}
            </span>
          )}
        </span>
        <span class="sr-only">
          {percentage ? "Percent of flour weight" : field.key === "weight" ? "Grams per ball" : ""}
        </span>
        {errors[field.key] && (
          <span id={`${field.key}-error`} class="mt-2 block text-xs text-red-700 dark:text-red-400">
            {errors[field.key]}
          </span>
        )}
      </label>
    );
  }

  return (
    <div class="min-h-screen bg-white font-geist-mono text-zinc-950 scheme-light-dark dark:bg-zinc-950 dark:text-zinc-50">
      <main class="mx-auto max-w-4xl px-5 py-6 sm:px-8 sm:py-12">
        <nav aria-label="Site navigation">
          <a href="#/" class={linkClass}>
            <ArrowLeft size={16} aria-hidden="true" /> Back to homepage
          </a>
        </nav>
        <header class="my-8 sm:my-10">
          <div class="flex items-start gap-3">
            <span class="flex size-11 shrink-0 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-400">
              <Pizza class="size-5" aria-hidden="true" />
            </span>
            <h1 class="self-center text-2xl font-semibold tracking-tight sm:text-3xl">
              Pizza dough calculator
            </h1>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Pick a starting recipe and adjust your batch.
          </p>
        </header>

        <fieldset>
          <legend class="mb-3 text-sm font-medium">Starting recipe</legend>
          <div class="grid gap-3 sm:grid-cols-3">
            {presets.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={preset.id === option.id}
                onClick={() => {
                  setPreset(option);
                  setFields({ ...option.fields });
                }}
                class={cn(
                  "min-h-20 rounded-xl border px-4 py-4 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600 dark:focus-visible:outline-orange-400",
                  preset.id === option.id
                    ? "border-orange-600 bg-orange-50 dark:border-orange-400 dark:bg-orange-950/30"
                    : "border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900/40",
                )}
              >
                <span class="flex items-center justify-between gap-2 font-medium">
                  <span>{option.name}</span>
                  <Check
                    aria-hidden="true"
                    class={cn(
                      "size-4 shrink-0 text-orange-700 dark:text-orange-400",
                      preset.id !== option.id && "invisible",
                    )}
                  />
                </span>
                <span class="mt-1 block text-xs text-zinc-600 dark:text-zinc-400">
                  {option.time}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <div class="mt-6 grid items-start gap-6 md:grid-cols-2">
          <section
            aria-labelledby="batch-heading"
            class="rounded-2xl border border-zinc-200 p-5 sm:p-6 dark:border-zinc-800"
          >
            <div class="flex items-center justify-between gap-3">
              <h2 id="batch-heading" class="font-semibold">
                Your dough
              </h2>
              <button
                type="button"
                class={cn(
                  linkClass,
                  "px-2 text-xs disabled:cursor-default disabled:opacity-40 disabled:hover:text-zinc-600 dark:disabled:hover:text-zinc-400",
                )}
                disabled={!modified && valid}
                onClick={() => setFields({ ...preset.fields })}
              >
                <RotateCcw size={14} aria-hidden="true" /> Reset
              </button>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-4">
              {portionFields.map((field) => renderField(field, false))}
            </div>
            <fieldset class="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
              <legend class="sr-only">Recipe percentages</legend>
              <p id="percentage-help" class="text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                Percentages are relative to flour weight. Flour is always 100%.
              </p>
              <div class="mt-4 grid grid-cols-2 gap-4">
                {percentageFields.map((field) => renderField(field, true))}
              </div>
            </fieldset>
          </section>

          <section
            aria-labelledby="ingredients-heading"
            class="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:p-6 md:sticky md:top-6 dark:border-zinc-800 dark:bg-zinc-900/40"
          >
            <h2 id="ingredients-heading" class="flex min-h-11 items-center font-semibold">
              Weigh out
            </h2>
            <div aria-live="polite" aria-atomic="true">
              <>
                <div class="mt-4 border-b border-zinc-200 pb-5 dark:border-zinc-800">
                  <p class="flex flex-wrap items-baseline gap-2">
                    <span class="text-3xl font-semibold tracking-tight tabular-nums">
                      {dough ? formatAmount(dough.total, 1) : "—"}
                      <span class="ml-1 text-lg font-normal text-zinc-500 dark:text-zinc-400">
                        g
                      </span>
                    </span>
                    <span class="text-xs text-zinc-600 dark:text-zinc-400">total dough</span>
                  </p>
                  <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {dough
                      ? `${fields.count} ${Number(fields.count) === 1 ? "ball" : "balls"} × ${formatAmount(Number(fields.weight), 1)} g`
                      : "Complete your batch details"}
                  </p>
                </div>
                <dl class="mt-2 divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                  <div class="flex items-baseline justify-between gap-4 py-3">
                    <dt>Flour</dt>
                    <dd class="text-lg font-medium whitespace-nowrap tabular-nums">
                      {dough ? formatAmount(dough.flour, 0) : "—"}{" "}
                      <span class="text-xs font-normal text-zinc-500 dark:text-zinc-400">g</span>
                    </dd>
                  </div>
                  {ingredients.map((item) => (
                    <div
                      key={item.key}
                      class={cn(
                        "flex items-baseline justify-between gap-4 py-3",
                        Number(fields[item.key]) === 0 && "text-zinc-500 dark:text-zinc-400",
                      )}
                    >
                      <dt>{item.name}</dt>
                      <dd class="text-lg font-medium whitespace-nowrap tabular-nums">
                        {dough
                          ? formatAmount(
                              (dough.flour * Number(fields[item.key])) / 100,
                              item.decimals,
                            )
                          : "—"}{" "}
                        <span class="text-xs font-normal text-zinc-500 dark:text-zinc-400">g</span>
                      </dd>
                    </div>
                  ))}
                </dl>
                <p class="mt-4 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
                  Rounded for weighing; the amounts may not add up exactly to the target. Use a 0.01
                  g scale for small yeast amounts.
                </p>
                {!dough && (
                  <p class="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                    Check the highlighted fields to calculate your ingredients.
                  </p>
                )}
              </>
            </div>
          </section>
        </div>

        <section
          aria-labelledby="method-heading"
          class="mt-8 border-t border-zinc-200 pt-8 sm:mt-10 dark:border-zinc-800"
        >
          <h2 id="method-heading" class="font-semibold">
            Making the dough
          </h2>
          <p class="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {preset.time}. {preset.flour}.
          </p>
          <ol class="mt-4 list-decimal space-y-3 pl-6 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {preset.steps.map((step) => (
              <li key={step} class="pl-1">
                {step}
              </li>
            ))}
          </ol>
          <p class="mt-4 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
            {modified ? "You’ve adjusted the recipe. " : ""}Timing is a guide for the preset, not an
            automatic fermentation calculation. Temperature and changes to yeast or other
            ingredients affect the rise; watch the dough.
          </p>
          <div class="mt-6 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/40">
            <p class="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">Recipe source</p>
            <a
              href={preset.source.href}
              class={cn(
                linkClass,
                "items-start py-2 underline decoration-zinc-300 underline-offset-4 hover:decoration-current dark:decoration-zinc-600",
              )}
            >
              <span class="min-w-0">{preset.source.name}</span>
              <ArrowUpRight size={16} class="shrink-0" aria-hidden="true" />
            </a>
            <p class="mt-1 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
              {preset.source.note}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
