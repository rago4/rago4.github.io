import {
  ArrowLeft,
  EyeOff,
  Flame,
  LampDesk,
  Maximize,
  Minimize,
  SlidersHorizontal,
  Sun,
} from "lucide-preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { useScreenWakeLock } from "./use-screen-wake-lock.ts";

const modes = [
  {
    id: "candle",
    name: "Candle",
    description: "A soft amber glow",
    background: "bg-orange-200",
    icon: Flame,
  },
  {
    id: "warm",
    name: "Warm",
    description: "A gentle golden light",
    background: "bg-amber-100",
    icon: LampDesk,
  },
  {
    id: "daylight",
    name: "Daylight",
    description: "A clear, cool white",
    background: "bg-slate-50",
    icon: Sun,
  },
] as const;

export function Lamp() {
  const [mode, setMode] = useState<(typeof modes)[number]>(modes[1]);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState("");
  const [controlsVisible, setControlsVisible] = useState(true);
  useScreenWakeLock();
  const controls = useRef<HTMLElement>(null);
  const controlsToggle = useRef<HTMLButtonElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const controlClass =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-xs font-medium hover:bg-zinc-950/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-900";

  const keyClass =
    "inline-flex size-5 items-center justify-center rounded border border-zinc-900/10 bg-white/40 text-xs text-zinc-500";

  useEffect(() => {
    const syncFullscreen = () => setFullscreen(document.fullscreenElement === surface.current);
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    setFullscreenError("");
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await surface.current?.requestFullscreen();
      }
    } catch {
      setFullscreenError("Fullscreen couldn’t open. You can keep reading in this window.");
    }
  }, []);

  const toggleControls = useCallback(() => {
    if (document.activeElement && controls.current?.contains(document.activeElement)) {
      controlsToggle.current?.focus();
    }
    setControlsVisible((visible) => !visible);
  }, []);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      const target = event.target;
      if (
        event.repeat ||
        event.isComposing ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        (target instanceof HTMLElement &&
          (target.isContentEditable || target.closest("input, textarea, select")))
      )
        return;

      if (event.key.toLowerCase() === "h") {
        event.preventDefault();
        toggleControls();
      } else if (event.key.toLowerCase() === "f" && document.fullscreenEnabled) {
        event.preventDefault();
        void toggleFullscreen();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [toggleControls, toggleFullscreen]);

  return (
    <div
      ref={surface}
      class={`flex min-h-dvh flex-col font-geist-mono text-zinc-900 scheme-light ${mode.background}`}
    >
      <nav aria-label="Site navigation" class="px-5 py-4 sm:px-8">
        <a href="#/" class={`${controlClass} text-zinc-600 hover:text-zinc-900`}>
          <ArrowLeft size={16} aria-hidden="true" /> Back to homepage
        </a>
      </nav>
      <main>
        <h1 class="sr-only">Reading lamp</h1>
        <div class="fixed right-4 bottom-4 left-4 flex flex-col items-end sm:right-6 sm:bottom-6 sm:left-auto sm:w-80">
          <section
            ref={controls}
            id="lamp-controls"
            aria-label="Lamp controls"
            hidden={!controlsVisible}
            class="w-full rounded-2xl border border-white/50 bg-white/40 p-2 text-xs shadow-sm"
          >
            <header class="flex min-h-11 items-center px-3 pr-24">
              <h2 class="font-medium text-zinc-600">Reading lamp</h2>
            </header>
            <fieldset>
              <legend class="sr-only">Light mode</legend>
              <div class="grid grid-cols-3 gap-1 rounded-xl bg-zinc-900/5 p-1">
                {modes.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={mode.id === option.id}
                    onClick={() => setMode(option)}
                    class={`relative flex min-h-16 flex-col items-center justify-center gap-2 rounded-lg px-1 py-3 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 ${mode.id === option.id ? "bg-white/80 text-zinc-900 shadow-sm ring-1 ring-zinc-900/5" : "text-zinc-600 hover:bg-white/30 hover:text-zinc-900"}`}
                  >
                    <option.icon size={18} strokeWidth={1.5} aria-hidden="true" />
                    {option.name}
                    {mode.id === option.id && (
                      <span
                        aria-hidden="true"
                        class="absolute top-2 right-2 size-1 rounded-full bg-zinc-500"
                      />
                    )}
                  </button>
                ))}
              </div>
            </fieldset>

            <p role="status" class="sr-only">
              {mode.name}: {mode.description}
            </p>
            {document.fullscreenEnabled && (
              <div class="mt-2 border-t border-zinc-900/5 pt-1">
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-keyshortcuts="f"
                  class="flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-zinc-600 hover:bg-white/40 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                >
                  <span class="flex items-center gap-2">
                    {fullscreen ? (
                      <Minimize size={15} strokeWidth={1.5} aria-hidden="true" />
                    ) : (
                      <Maximize size={15} strokeWidth={1.5} aria-hidden="true" />
                    )}
                    {fullscreen ? "Exit fullscreen" : "Fullscreen"}
                  </span>
                  <kbd aria-hidden="true" class={keyClass}>
                    F
                  </kbd>
                </button>
              </div>
            )}
            {fullscreenError && (
              <p role="alert" class="px-3 pt-2 pb-3 leading-relaxed text-zinc-700">
                {fullscreenError}
              </p>
            )}
          </section>
          <button
            ref={controlsToggle}
            type="button"
            onClick={toggleControls}
            aria-label={controlsVisible ? "Hide controls" : "Show controls"}
            title={controlsVisible ? "Hide controls (H)" : "Show controls (H)"}
            aria-controls="lamp-controls"
            aria-expanded={controlsVisible}
            aria-keyshortcuts="h"
            class={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-xs text-zinc-600 hover:bg-white/50 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 ${controlsVisible ? "absolute top-2 right-2" : "border border-white/40 bg-white/30 shadow-sm"}`}
          >
            {controlsVisible ? (
              <EyeOff size={15} strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <>
                <SlidersHorizontal size={15} strokeWidth={1.5} aria-hidden="true" /> Controls
              </>
            )}
            <kbd aria-hidden="true" class={keyClass}>
              H
            </kbd>
          </button>
        </div>
      </main>
    </div>
  );
}
