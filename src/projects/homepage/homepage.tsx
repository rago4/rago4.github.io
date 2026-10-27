export function Homepage() {
  return (
    <div class="min-h-screen bg-white font-geist-mono text-zinc-950 scheme-light-dark dark:bg-zinc-950 dark:text-zinc-50">
      <main class="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-20">
        <header class="space-y-6">
          <h1 class="text-3xl font-bold">rgolawski</h1>
          <p class="leading-relaxed">
            I'm a software engineer focused on web technologies. I mostly work with React-based
            meta-frameworks, but I like exploring other technologies too. I'm also a dad who enjoys
            lifting weights, training with kettlebells, and going for the occasional run. Say hi on{" "}
            <a class="text-blue-600 underline dark:text-blue-400" href="https://x.com/awskir">
              X (@awskir)
            </a>{" "}
            or check out my work on{" "}
            <a class="text-blue-600 underline dark:text-blue-400" href="https://github.com/rago4">
              GitHub (rago4)
            </a>
            . If you need a hand with an open-source project, hit me up. I'm happy to help however I
            can.
          </p>
        </header>
        <section class="mt-12 space-y-6 sm:mt-16 sm:space-y-8">
          <div class="space-y-2">
            <h2 class="text-xl font-bold">What I’ve been up to</h2>
            <p class="text-zinc-600 dark:text-zinc-400">
              A mix of projects, useful tools, and occasional writing.
            </p>
          </div>
          <a
            href="#/interval-timer"
            class="block rounded-xl border border-zinc-200 p-5 transition hover:border-orange-400 sm:p-6 dark:border-zinc-800 dark:hover:border-orange-400"
          >
            <h3 class="font-semibold">
              Interval timer <span aria-hidden="true">🏋️‍♂️</span>
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              I built this for my kettlebell workouts. Set the duration and number of rounds, and it
              handles the timing with a beep for each round.
            </p>
          </a>
        </section>
      </main>
    </div>
  );
}
