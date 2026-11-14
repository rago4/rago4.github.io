import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { chunk, groupBy, range, sortBy, uniq } from "es-toolkit";
import { activityIds } from "./activities.ts";
import type { ActivityId } from "./activities.ts";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

export type Entry = { date: string } & Record<ActivityId, number>;
export type ActivityData = {
  thresholds: Record<ActivityId, number[]>;
  entriesByYear: Record<string, Entry[]>;
};
type ActivityDataInput = {
  thresholds: ActivityData["thresholds"];
  entries: ({ date: string } & Partial<Record<ActivityId, number>>)[];
};

export const numberFormat = new Intl.NumberFormat("en", { maximumFractionDigits: 1 });

export function parseDate(date: string) {
  return dayjs.utc(date, "YYYY-MM-DD", true);
}

export function formatDate(date: string, format = "dddd, MMMM D, YYYY") {
  return parseDate(date).format(format);
}

export function parseActivityData({ thresholds, entries }: ActivityDataInput): ActivityData {
  for (const id of activityIds) {
    const values = thresholds[id];
    if (
      values.length !== 3 ||
      !values.every(
        (value, index) =>
          Number.isFinite(value) && value > 0 && (index === 0 || value > values[index - 1]),
      )
    ) {
      throw new Error(`${id}: provide three positive, increasing intensity thresholds.`);
    }
  }
  if (uniq(entries.map((entry) => entry.date)).length !== entries.length) {
    throw new Error("Combine entries that share the same date.");
  }
  const normalized = sortBy(entries, ["date"]).map((item) => {
    const date = parseDate(item.date);
    if (!date.isValid() || date.year() < 1900 || date.year() > 9999) {
      throw new Error(`Invalid activity date: ${item.date}. Use YYYY-MM-DD (1900–9999).`);
    }
    const entry = { kettlebell: 0, gym: 0, running: 0, ...item };
    for (const id of activityIds) {
      if (!Number.isFinite(entry[id]) || entry[id] < 0) {
        throw new Error(`${item.date}: ${id} must be a nonnegative number.`);
      }
    }
    return entry;
  });
  return {
    thresholds,
    entriesByYear: groupBy(normalized, (entry) => parseDate(entry.date).year()),
  };
}

export function calendarWeeks(year: number) {
  const firstDay = parseDate(`${year}-01-01`);
  const start = firstDay.startOf("week");
  const end = firstDay.endOf("year").endOf("week");
  return chunk(
    range(end.diff(start, "day") + 1).map((offset) => {
      const date = start.add(offset, "day");
      return date.year() === year ? date.format("YYYY-MM-DD") : null;
    }),
    7,
  );
}

export function intensity(value: number, thresholds: number[]) {
  return value === 0 ? 0 : 1 + thresholds.filter((threshold) => value >= threshold).length;
}
