import { Dumbbell, Footprints, Weight } from "lucide-preact";

export const activities = {
  kettlebell: {
    name: "Kettlebell",
    unit: "kg",
    description: "Weight × reps, across all sets",
    icon: Weight,
    text: "text-teal-700 dark:text-teal-300",
    surface: "bg-teal-50 dark:bg-teal-950",
    levels: [
      "bg-zinc-100 dark:bg-zinc-800",
      "bg-teal-200 dark:bg-teal-900",
      "bg-teal-400 dark:bg-teal-700",
      "bg-teal-600 dark:bg-teal-500",
      "bg-teal-800 dark:bg-teal-300",
    ],
  },
  gym: {
    name: "Gym",
    unit: "kg",
    description: "Weight × reps, across all sets",
    icon: Dumbbell,
    text: "text-violet-700 dark:text-violet-300",
    surface: "bg-violet-50 dark:bg-violet-950",
    levels: [
      "bg-zinc-100 dark:bg-zinc-800",
      "bg-violet-200 dark:bg-violet-900",
      "bg-violet-400 dark:bg-violet-700",
      "bg-violet-600 dark:bg-violet-500",
      "bg-violet-800 dark:bg-violet-300",
    ],
  },
  running: {
    name: "Running",
    unit: "km",
    description: "Total distance on your feet",
    icon: Footprints,
    text: "text-orange-700 dark:text-orange-300",
    surface: "bg-orange-50 dark:bg-orange-950",
    levels: [
      "bg-zinc-100 dark:bg-zinc-800",
      "bg-orange-200 dark:bg-orange-900",
      "bg-orange-400 dark:bg-orange-700",
      "bg-orange-600 dark:bg-orange-500",
      "bg-orange-800 dark:bg-orange-300",
    ],
  },
};

export type ActivityId = keyof typeof activities;
export const activityIds = Object.keys(activities) as ActivityId[];
