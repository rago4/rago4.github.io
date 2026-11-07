import { cn } from "cn";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  Square,
  Timer,
  Volume2,
  VolumeX,
} from "lucide-preact";
import { useState } from "preact/hooks";
import { usePageTitle } from "../../use-page-title.ts";
import { useWorkout } from "./use-workout.ts";

function formatTime(seconds: number) {
  const rounded = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(rounded / 60)
    .toString()
    .padStart(2, "0")}:${(rounded % 60).toString().padStart(2, "0")}`;
}

export function IntervalTimer() {
  usePageTitle("Interval timer");

  const [minutes, setMinutes] = useState("30");
  const [rounds, setRounds] = useState("10");
  const duration = Number(minutes) * 60;
  const count = Number(rounds);
  const validMinutes =
    Number.isInteger(Number(minutes)) && Number(minutes) >= 1 && Number(minutes) <= 1440;
  const validRounds = Number.isInteger(count) && count >= 1 && count <= 1000;
  const valid = validMinutes && validRounds;
  const fractionalRounds = valid && duration % count !== 0;
  const roundMilliseconds = valid ? Math.round((duration / count) * 1000) : 0;
  const roundTime = fractionalRounds
    ? `≈${formatTime(Math.floor(roundMilliseconds / 1000))}.${(roundMilliseconds % 1000).toString().padStart(3, "0")}`
    : formatTime(valid ? duration / count : 0);
  const workout = useWorkout(valid ? duration : 1800, valid ? count : 10);
  const ready = workout.status === "ready";
  const ended = workout.status === "stopped" || workout.status === "complete";
  const completed = workout.status === "complete";
  const primaryButton =
    "inline-flex min-h-16 items-center justify-center gap-2 rounded-2xl bg-orange-400 px-3 text-base font-semibold text-zinc-950 transition hover:bg-orange-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400 disabled:cursor-not-allowed disabled:opacity-40 sm:gap-3 sm:px-6 sm:text-lg";
  const secondaryButton =
    "inline-flex min-h-16 items-center justify-center gap-2 rounded-2xl border border-zinc-700 px-3 text-base font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400 sm:gap-3 sm:px-6";

  return (
    <div class="min-h-screen bg-zinc-950 font-geist-mono text-zinc-100 scheme-dark">
      <div class="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-6 sm:px-10 sm:py-12">
        <nav aria-label="Site navigation" class="mx-auto mb-6 w-full max-w-xl">
          <a
            href="#/"
            class="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm text-zinc-400 transition hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
          >
            <ArrowLeft size={16} /> Back to homepage
          </a>
        </nav>
        <header class="mx-auto mb-8 flex w-full max-w-xl items-center justify-between gap-3">
          <div>
            <h1 class="flex items-center gap-3 text-xl font-semibold tracking-tight sm:text-3xl">
              <Timer size={24} aria-hidden="true" class="shrink-0 text-orange-400" />
              Interval timer
            </h1>
          </div>
          <button
            type="button"
            onClick={workout.toggleMute}
            aria-label={workout.muted ? "Unmute sounds" : "Mute sounds"}
            aria-pressed={workout.muted}
            title={workout.muted ? "Unmute sounds" : "Mute sounds"}
            class="shrink-0 rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
          >
            {workout.muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </header>

        <main>
          {ready ? (
            <div class="mx-auto w-full max-w-xl">
              <form
                class="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/30 p-5 sm:p-8"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (valid) workout.start();
                }}
              >
                <div>
                  <h2 class="text-lg font-medium">Your workout</h2>
                  <p class="mt-1 text-sm leading-6 text-zinc-400">
                    Split your time into equal rounds.
                  </p>
                </div>
                <fieldset>
                  <legend class="mb-3 text-sm text-zinc-300">Quick duration</legend>
                  <div class="grid grid-cols-4 gap-2 sm:gap-3">
                    {[15, 20, 25, 30].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        aria-pressed={minutes === String(preset)}
                        onClick={() => setMinutes(String(preset))}
                        class={cn(
                          "min-h-16 rounded-xl border text-lg font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400",
                          minutes === String(preset)
                            ? "border-orange-400 bg-orange-400/10 text-orange-400"
                            : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600",
                        )}
                      >
                        {preset}
                        <span class="mt-1 block text-xs font-normal">min</span>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div class="grid grid-cols-2 gap-4">
                  <label class="min-w-0 space-y-2 text-sm text-zinc-300">
                    <span class="block">Minutes</span>
                    <input
                      type="number"
                      min="1"
                      max="1440"
                      step="1"
                      required
                      value={minutes}
                      onInput={(event) => setMinutes(event.currentTarget.value)}
                      aria-invalid={!validMinutes}
                      aria-describedby="workout-detail"
                      class="min-h-16 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-xl text-zinc-100 outline-none focus:border-orange-400"
                    />
                  </label>
                  <label class="min-w-0 space-y-2 text-sm text-zinc-300">
                    <span class="block">Rounds</span>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      step="1"
                      required
                      value={rounds}
                      onInput={(event) => setRounds(event.currentTarget.value)}
                      aria-invalid={!validRounds}
                      aria-describedby="workout-detail"
                      class="min-h-16 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-xl text-zinc-100 outline-none focus:border-orange-400"
                    />
                  </label>
                </div>

                <div
                  id="workout-detail"
                  aria-live="polite"
                  class={cn(
                    "rounded-2xl border bg-zinc-950 p-4 text-sm sm:p-5",
                    valid && !fractionalRounds
                      ? "border-zinc-800 text-zinc-400"
                      : "border-orange-400/40 text-orange-300",
                  )}
                >
                  {valid ? (
                    <div class="space-y-3">
                      <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                        <span>Time per round</span>
                        <strong class="text-2xl font-medium tracking-tight text-zinc-100 tabular-nums">
                          {roundTime}
                        </strong>
                      </div>
                      <p class="border-t border-zinc-800 pt-3 text-xs leading-5">
                        {minutes} {Number(minutes) === 1 ? "minute" : "minutes"}
                        <span aria-hidden="true" class="px-2 text-zinc-600">
                          /
                        </span>
                        {count} {count === 1 ? "round" : "rounds"}
                      </p>
                      {fractionalRounds && (
                        <p class="leading-6">
                          Rounds use fractional seconds to keep the workout exactly {minutes}{" "}
                          {Number(minutes) === 1 ? "minute" : "minutes"}. You can start as usual.
                        </p>
                      )}
                    </div>
                  ) : !validMinutes ? (
                    "Choose 1–1,440 whole minutes."
                  ) : (
                    "Choose 1–1,000 whole rounds."
                  )}
                </div>

                <div class="space-y-3">
                  <button type="submit" disabled={!valid} class={cn(primaryButton, "w-full")}>
                    Start workout <ArrowRight size={22} />
                  </button>
                  <p class="text-center text-xs leading-6 text-zinc-500">
                    3-second countdown before your first round.
                  </p>
                </div>
              </form>
            </div>
          ) : (
            <div class="mx-auto w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-900/30 px-5 py-8 text-center sm:p-8">
              <div
                role="status"
                class="mb-6 flex min-h-8 items-center justify-center gap-2 text-sm font-medium tracking-widest text-orange-400 uppercase"
              >
                {completed ? (
                  <>
                    <Check size={20} /> Workout complete
                  </>
                ) : ended ? (
                  "Session stopped"
                ) : workout.status === "paused" ? (
                  "Paused"
                ) : workout.preparing ? (
                  "Get ready"
                ) : (
                  "Running"
                )}
              </div>
              <h2 class="text-xl font-medium text-zinc-300 sm:text-3xl">
                {workout.preparing && !ended ? (
                  "Take your position"
                ) : (
                  <>
                    Round <span class="text-zinc-50">{workout.round}</span>{" "}
                    <span class="text-zinc-600">/ {count}</span>
                  </>
                )}
              </h2>
              <div
                class={cn(
                  "my-6 text-6xl leading-none font-semibold tracking-tighter tabular-nums sm:text-8xl",
                  workout.preparing && !ended ? "text-orange-400" : "text-zinc-50",
                )}
              >
                {workout.preparing && !ended
                  ? workout.preparationRemaining
                  : formatTime(ended ? workout.workoutElapsed : workout.remaining)}
              </div>
              <p class="text-sm text-zinc-400">
                {ended
                  ? "total time"
                  : workout.preparing
                    ? "seconds until start"
                    : "left this round"}
              </p>

              <div class="mt-8 border-t border-zinc-800 pt-6">
                <progress
                  aria-label="Workout progress"
                  max={duration}
                  value={workout.workoutElapsed}
                  class="block h-2 w-full overflow-hidden rounded-full accent-orange-400"
                />
                <div class="mt-4 flex flex-wrap justify-between gap-x-4 gap-y-2 text-xs text-zinc-400 sm:text-sm">
                  <span>{roundTime} / round</span>
                  <span>{formatTime(workout.totalRemaining)} remaining</span>
                </div>
                <div class="mt-8 grid grid-cols-2 gap-3">
                  {ended ? (
                    <>
                      <button type="button" onClick={workout.start} class={primaryButton}>
                        <RotateCcw size={22} /> Restart
                      </button>
                      <button type="button" onClick={workout.reset} class={secondaryButton}>
                        <Settings2 size={20} /> Setup
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={workout.status === "paused" ? workout.resume : workout.pause}
                        class={primaryButton}
                      >
                        {workout.status === "paused" ? (
                          <>
                            <Play size={22} /> Resume
                          </>
                        ) : (
                          <>
                            <Pause size={22} /> Pause
                          </>
                        )}
                      </button>
                      <button type="button" onClick={workout.stop} class={secondaryButton}>
                        <Square size={18} /> Stop
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
