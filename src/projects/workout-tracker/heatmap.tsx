import { cn } from "cn";
import { clamp } from "es-toolkit";
import { useRef } from "preact/hooks";
import { activities } from "./activities.ts";
import type { ActivityId } from "./activities.ts";
import { formatDate, intensity, numberFormat } from "./activity.ts";
import type { Entry } from "./activity.ts";

export function Heatmap({
  id,
  year,
  weeks,
  entries,
  thresholds,
  selected,
  onSelect,
}: {
  id: ActivityId;
  year: number;
  weeks: (string | null)[][];
  entries: Map<string, Entry>;
  thresholds: number[];
  selected: string;
  onSelect: (date: string) => void;
}) {
  const activity = activities[id];
  const dates = weeks.flat().filter((date): date is string => date !== null);
  const calendar = useRef<HTMLDivElement>(null);

  return (
    <section
      aria-labelledby={`${id}-heading`}
      class="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/50"
    >
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <span
            class={cn(
              "flex size-10 items-center justify-center rounded-xl",
              activity.surface,
              activity.text,
            )}
          >
            <activity.icon aria-hidden="true" class="size-5" />
          </span>
          <h3 id={`${id}-heading`} class="font-semibold">
            {activity.name}
          </h3>
        </div>
        <span class="text-xs text-zinc-500 dark:text-zinc-400">
          Daily {id === "running" ? "distance" : "volume"} · {activity.unit}
        </span>
      </div>
      <div
        ref={calendar}
        onKeyDown={(event) => {
          const index = dates.indexOf(selected);
          const nextIndex = {
            ArrowRight: index + 7,
            ArrowLeft: index - 7,
            ArrowDown: index + 1,
            ArrowUp: index - 1,
            Home: 0,
            End: dates.length - 1,
          }[event.key];
          if (nextIndex === undefined) return;
          event.preventDefault();
          const next = dates[clamp(nextIndex, 0, dates.length - 1)];
          onSelect(next);
          calendar.current
            ?.querySelector<HTMLButtonElement>(`button[data-date="${next}"]`)
            ?.focus();
        }}
        class="mt-6 overflow-x-auto pb-2"
        role="group"
        aria-label={`${activity.name} calendar for ${year}`}
        aria-describedby="calendar-help"
      >
        <div class="flex w-max gap-3 px-1 pt-1">
          <div
            aria-hidden="true"
            class="grid w-7 shrink-0 grid-rows-7 gap-1 pt-7 text-xs leading-3 text-zinc-500 dark:text-zinc-400"
          >
            {["", "Mon", "", "Wed", "", "Fri", ""].map((day, index) => (
              <span key={index} class="h-3">
                {day}
              </span>
            ))}
          </div>
          <div class="flex gap-1">
            {weeks.map((week, weekIndex) => {
              const monthStart = week.find((date) => date?.endsWith("-01"));
              return (
                <div key={weekIndex} class="w-3 shrink-0">
                  <div
                    aria-hidden="true"
                    class="h-7 overflow-visible whitespace-nowrap text-xs leading-4 text-zinc-500 dark:text-zinc-400"
                  >
                    {monthStart ? formatDate(monthStart, "MMM") : ""}
                  </div>
                  <div class="grid grid-rows-7 gap-1">
                    {week.map((date, dayIndex) => {
                      if (!date)
                        return (
                          <span
                            key={dayIndex}
                            aria-hidden="true"
                            class="size-3 rounded-xs border border-dashed border-zinc-200 dark:border-zinc-800"
                          />
                        );
                      const value = entries.get(date)?.[id] ?? 0;
                      const label = `${formatDate(date)}: ${numberFormat.format(value)} ${activity.unit} ${activity.name.toLowerCase()}`;
                      return (
                        <button
                          key={date}
                          data-date={date}
                          type="button"
                          title={label}
                          aria-label={label}
                          aria-pressed={date === selected}
                          tabIndex={date === selected ? 0 : -1}
                          onClick={() => onSelect(date)}
                          class={cn(
                            "size-3 cursor-pointer rounded-xs transition-opacity hover:opacity-70 focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-white",
                            activity.levels[intensity(value, thresholds)],
                            date === selected &&
                              "ring-1 ring-zinc-950 ring-offset-1 ring-offset-white dark:ring-white dark:ring-offset-zinc-900",
                          )}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div class="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
        <span>{activity.description}</span>
        <div class="flex items-center gap-1.5" aria-label={`${activity.name} intensity scale`}>
          <span>Less</span>
          {activity.levels.map((level, index) => {
            const label =
              index === 0
                ? "No activity"
                : `${index === 1 ? "Above 0" : `At least ${numberFormat.format(thresholds[index - 2])}`} ${activity.unit}`;
            return (
              <span key={level} class={cn("size-3 rounded-xs", level)} title={label}>
                <span class="sr-only">{label}; </span>
              </span>
            );
          })}
          <span>More</span>
        </div>
      </div>
    </section>
  );
}
