import { ArrowRight, ArrowUpRight, LampDesk, Pizza, Timer } from "lucide-preact";

const projects = [
  {
    name: "Interval timer",
    href: "#/interval-timer",
    icon: Timer,
    description:
      "I built this for my kettlebell workouts. Set a duration and number of rounds, with a beep after each round.",
  },
  {
    name: "Pizza dough calculator",
    href: "#/pizza-dough",
    icon: Pizza,
    description:
      "I built this to keep my pizza dough recipes repeatable. Choose a recipe, then adjust the dough balls and ingredients.",
  },
  {
    name: "Reading lamp",
    href: "#/lamp",
    icon: LampDesk,
    description:
      "I built this to use my monitor as a reading light in a dark room. Choose candle, warm light, or daylight.",
  },
].sort((a, b) => a.name.localeCompare(b.name, "en"));

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
          <ul class="mt-6 space-y-3">
            {projects.map((project) => (
              <li key={project.href}>
                <a
                  href={project.href}
                  class="group flex flex-wrap items-center gap-x-3 gap-y-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 transition-colors hover:border-orange-400 hover:bg-orange-50/50 focus-visible:border-orange-400 focus-visible:bg-orange-50/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600 sm:flex-nowrap sm:items-start sm:gap-4 dark:border-zinc-800 dark:bg-zinc-900/30 dark:hover:border-orange-400 dark:hover:bg-orange-950/20 dark:focus-visible:border-orange-400 dark:focus-visible:bg-orange-950/20 dark:focus-visible:outline-orange-400"
                >
                  <span class="order-1 flex size-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition-colors group-hover:text-orange-600 group-focus-visible:text-orange-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:group-hover:text-orange-400 dark:group-focus-visible:text-orange-400">
                    <project.icon aria-hidden="true" class="size-5" />
                  </span>
                  <div class="contents sm:order-2 sm:block sm:min-w-0 sm:flex-1 sm:pt-1">
                    <h3 class="order-2 min-w-0 flex-1 font-semibold leading-6">{project.name}</h3>
                    <p class="order-4 basis-full text-sm leading-relaxed text-zinc-600 sm:mt-2 dark:text-zinc-400">
                      {project.description}
                    </p>
                  </div>
                  <ArrowRight
                    aria-hidden="true"
                    class="order-3 size-4 shrink-0 self-center text-zinc-500 transition-colors group-hover:text-orange-600 group-focus-visible:text-orange-600 motion-safe:transition motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1 dark:text-zinc-400 dark:group-hover:text-orange-400 dark:group-focus-visible:text-orange-400"
                  />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
