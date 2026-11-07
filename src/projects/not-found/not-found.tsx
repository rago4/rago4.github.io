import { useEffect, useRef, useState } from "preact/hooks";
import { usePageTitle } from "@/use-page-title.ts";

type SceneState = "loading" | "ready" | "unavailable";

export function NotFound() {
  usePageTitle("404: Page not found");

  const stage = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<SceneState>("loading");

  useEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;

    import("./scene.ts")
      .then(({ createScene }) => {
        if (cancelled || !stage.current) return;
        const result = createScene(stage.current);
        dispose = result.dispose;
        setScene("ready");
      })
      .catch(() => {
        if (!cancelled) setScene("unavailable");
      });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return (
    <main class="flex min-h-svh flex-col items-center justify-center bg-white px-6 py-8 font-geist-mono text-zinc-950 scheme-light-dark sm:px-8 sm:py-12 dark:bg-zinc-950 dark:text-zinc-50">
      <div class="w-full max-w-4xl text-center">
        <div
          ref={stage}
          aria-hidden="true"
          class="relative h-64 w-full overflow-hidden bg-white text-orange-500 sm:h-72 lg:h-80 dark:bg-zinc-950 dark:text-orange-400"
        >
          {scene === "unavailable" && (
            <span class="absolute inset-0 flex items-center justify-center text-8xl font-bold">
              404
            </span>
          )}
        </div>
        <div class="mx-auto mt-2 max-w-md">
          <h1 class="text-3xl font-bold tracking-tight text-balance sm:text-4xl">Page not found</h1>
          <p class="mt-4 text-base leading-relaxed text-pretty text-zinc-600 dark:text-zinc-400">
            We couldn’t find this page. Head home to explore the projects and tools.
          </p>
        </div>
        <a
          href="/#/"
          class="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-orange-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700 active:bg-orange-900 dark:bg-orange-400 dark:text-zinc-950 dark:hover:bg-orange-300 dark:focus-visible:outline-orange-400 dark:active:bg-orange-500"
        >
          Back home
        </a>
      </div>
    </main>
  );
}
