import { ArrowRight, ArrowUpRight, LampDesk, Timer } from "lucide-preact";

const projects = [
  {
    name: "Interval timer",
    href: "#/interval-timer",
    icon: Timer,
    description:
      "I built this for my kettlebell workouts. Set the duration and number of rounds, and it beeps at the end of each round.",
    hoverClass:
      "hover:border-orange-400 hover:bg-orange-50/50 dark:hover:border-orange-400 dark:hover:bg-orange-950/20",
    iconHoverClass: "group-hover:text-orange-600 dark:group-hover:text-orange-400",
  },
  {
    name: "Reading lamp",
    href: "#/lamp",
    icon: LampDesk,
    description:
      "I built this to read in a dark room, using my monitor as a light for my book. It has candle, warm light, and daylight modes.",
    hoverClass:
      "hover:border-amber-400 hover:bg-amber-50/50 dark:hover:border-amber-400 dark:hover:bg-amber-950/20",
    iconHoverClass: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
  },
];

export function Homepage() {
  const socialLinkClass =
    "inline-flex min-h-11 items-center gap-2 rounded-sm text-sm text-blue-600 underline decoration-blue-600/30 underline-offset-4 transition-colors hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 dark:text-blue-400 dark:decoration-blue-400/30 dark:focus-visible:outline-blue-400";

  return (
    <div class="min-h-screen bg-white font-geist-mono text-zinc-950 scheme-light-dark dark:bg-zinc-950 dark:text-zinc-50">
      <main class="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-20">
        <header>
          <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">rgolawski</h1>
          <div class="mt-6 space-y-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
            <p>
              I’m a software engineer focused on web technologies, mostly working with React
              meta-frameworks, but I like to experiment with other technologies too. I’m also a dad
              who enjoys lifting weights, working out with kettlebells, and going for the occasional
              run.
            </p>
            <p>
              If you need a hand with open source, or simply want to say hi, you can reach me here:
            </p>
          </div>
          <nav aria-label="Social links" class="mt-5 flex flex-wrap gap-x-6 gap-y-1">
            <a class={socialLinkClass} href="https://x.com/awskir">
              X (@awskir)
              <ArrowUpRight aria-hidden="true" class="size-4" />
            </a>
            <a class={socialLinkClass} href="https://github.com/rago4">
              GitHub <span class="sr-only">(rago4)</span>
              <ArrowUpRight aria-hidden="true" class="size-4" />
            </a>
          </nav>
        </header>

        <section aria-labelledby="projects-heading" class="mt-12 sm:mt-16">
          <div class="border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <h2 id="projects-heading" class="text-xl font-semibold tracking-tight">
              What I’ve been up to
            </h2>
            <p class="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Projects, useful tools, and occasional writing.
            </p>
          </div>
          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <a
                key={project.href}
                href={project.href}
                class={`group flex flex-col rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 sm:p-7 dark:border-zinc-800 dark:bg-zinc-900/30 dark:focus-visible:outline-blue-400 ${project.hoverClass}`}
              >
                <div
                  class={`flex size-11 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition-colors dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 ${project.iconHoverClass}`}
                >
                  <project.icon aria-hidden="true" class="size-5" />
                </div>
                <h3 class="mt-5 font-semibold">{project.name}</h3>
                <p class="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {project.description}
                </p>
                <div class="mt-auto pt-6">
                  <span class="flex items-center justify-between gap-3 border-t border-zinc-200 pt-4 text-xs font-medium dark:border-zinc-800">
                    Open
                    <ArrowRight
                      aria-hidden="true"
                      class="size-4 text-zinc-500 motion-safe:transition-transform motion-safe:group-hover:translate-x-1 dark:text-zinc-400"
                    />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
