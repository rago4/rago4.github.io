import { cn } from "cn";
import dayjs from "dayjs";
import { ArrowLeft, CalendarDays } from "lucide-preact";
import { useState } from "preact/hooks";
import { usePageTitle } from "@/use-page-title.ts";
import rawData from "./activity-data.json";
import {
  calendarWeeks,
  formatDate,
  numberFormat,
  parseActivityData,
  parseDate,
} from "./activity.ts";
import type { ActivityData } from "./activity.ts";
import { activities, activityIds } from "./activities.ts";
import { Heatmap } from "./heatmap.tsx";

const focusClass =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-600 dark:focus-visible:outline-zinc-300";
function Dashboard({ data }: { data: ActivityData }) {
  const years = Object.keys(data.entriesByYear)
    .map(Number)
    .sort((a, b) => b - a);
  if (!years.length) years.push(dayjs().year());
  const [selected, setSelected] = useState(
    data.entriesByYear[years[0]]?.at(-1)?.date ?? dayjs().format("YYYY-MM-DD"),
  );
  const year = parseDate(selected).year();
  const yearEntries = data.entriesByYear[year] ?? [];
  const entries = new Map(yearEntries.map((entry) => [entry.date, entry]));
  const activeDays = yearEntries.filter((entry) => activityIds.some((id) => entry[id] > 0)).length;
  const firstDay = parseDate(`${year}-01-01`);
  const daysInYear = firstDay.add(1, "year").diff(firstDay, "day");
  const weeks = calendarWeeks(year);
  const selectedEntry = entries.get(selected);
  const activePercentage = numberFormat.format((activeDays / daysInYear) * 100);

  return (
    <>
      <header class="mt-9 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Workout tracker</h1>
          <p class="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            A record of my kettlebell workouts, gym sessions, and occasional runs.
          </p>
        </div>
        <label class="flex items-center gap-3 text-sm">
          <span class="text-zinc-600 dark:text-zinc-400">Year</span>
          <select
            value={year}
            onChange={(event) => {
              const nextYear = event.currentTarget.value;
              setSelected(data.entriesByYear[nextYear]?.at(-1)?.date ?? `${nextYear}-01-01`);
            }}
            class={cn(
              "min-h-11 rounded-xl border border-zinc-300 bg-white px-4 font-medium dark:border-zinc-700 dark:bg-zinc-900",
              focusClass,
            )}
          >
            {years.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </header>
      <section
        aria-labelledby="active-days-heading"
        class="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/50"
      >
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 id="active-days-heading" class="flex items-center gap-2 text-sm font-medium">
            <CalendarDays aria-hidden="true" class="size-4 text-zinc-500" />
            {activeDays} active days in {year}
          </h2>
          <p class="text-sm font-semibold tabular-nums">{activePercentage}%</p>
        </div>
        <progress
          value={activeDays}
          max={daysInYear}
          aria-labelledby="active-days-heading"
          aria-valuetext={`${activeDays} of ${daysInYear} calendar days (${activePercentage}%)`}
          class="mt-4 block h-2 w-full overflow-hidden rounded-full accent-teal-600 dark:accent-teal-400"
        >
          {activePercentage}%
        </progress>
        <p class="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          {activeDays} of {daysInYear} calendar days
        </p>
      </section>
      <section aria-labelledby="calendar-heading" class="mt-6">
        <h2 id="calendar-heading" class="sr-only">
          Activity overview for {year}
        </h2>
        <section
          aria-labelledby="day-heading"
          aria-live="polite"
          aria-atomic="true"
          class="mb-4 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/50"
        >
          <h3 id="day-heading" class="sr-only">
            Selected day details
          </h3>
          <dl class="grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-4 lg:gap-x-6">
            <div class="min-w-0">
              <dt class="flex h-4 items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                <CalendarDays aria-hidden="true" class="size-4 shrink-0" />
                Selected day
              </dt>
              <dd class="mt-3 text-base font-semibold leading-7 tabular-nums sm:text-lg">
                <time
                  dateTime={selected}
                  aria-label={formatDate(selected)}
                  title={formatDate(selected)}
                >
                  {formatDate(selected, "D MMM YYYY")}
                </time>
              </dd>
            </div>
            {activityIds.map((id, index) => {
              const activity = activities[id];
              const value = selectedEntry?.[id] ?? 0;
              return (
                <div
                  key={id}
                  class={cn(
                    "min-w-0 border-zinc-200 dark:border-zinc-800",
                    index === 1 ? "lg:border-l lg:pl-6" : "border-l pl-4 lg:pl-6",
                  )}
                >
                  <dt class={cn("flex h-4 items-center gap-2 text-xs font-medium", activity.text)}>
                    <activity.icon aria-hidden="true" class="size-4 shrink-0" />
                    {activity.name}
                  </dt>
                  <dd class="mt-3 text-base font-semibold leading-7 tabular-nums sm:text-lg">
                    {numberFormat.format(value)}{" "}
                    <span class="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                      {activity.unit}
                    </span>
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>
        <p id="calendar-help" class="sr-only">
          Choose a day to see details. Use arrow keys to move between days, or Home and End to jump
          to the start and end of the year. On narrow screens, scroll each calendar horizontally.
          Dashed squares fall outside the selected year.
        </p>
        <div class="space-y-4">
          {activityIds.map((id) => (
            <Heatmap
              key={`${year}-${id}`}
              id={id}
              year={year}
              weeks={weeks}
              entries={entries}
              thresholds={data.thresholds[id]}
              selected={selected}
              onSelect={setSelected}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export function WorkoutTracker() {
  usePageTitle("Workout tracker");
  let content;
  try {
    content = <Dashboard data={parseActivityData(rawData)} />;
  } catch (error) {
    content = (
      <div
        role="alert"
        class="mt-8 rounded-2xl border border-red-300 bg-red-50 p-6 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
      >
        <h1 class="font-semibold">Activity data needs attention</h1>
        <p class="mt-2 text-sm">
          {error instanceof Error ? error.message : "Check the activity JSON file."}
        </p>
      </div>
    );
  }
  return (
    <div class="min-h-screen bg-zinc-50 font-geist-mono text-zinc-950 scheme-light-dark dark:bg-zinc-950 dark:text-zinc-50">
      <main class="mx-auto max-w-5xl px-5 py-6 sm:px-8 sm:py-12">
        <nav aria-label="Site navigation">
          <a
            href="#/"
            class="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm text-zinc-600 transition-colors hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600 dark:text-zinc-400 dark:hover:text-zinc-50 dark:focus-visible:outline-orange-400"
          >
            <ArrowLeft aria-hidden="true" class="size-4" />
            Back to homepage
          </a>
        </nav>
        {content}
      </main>
    </div>
  );
}
