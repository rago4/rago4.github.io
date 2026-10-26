export function Homepage() {
  return (
    <div class="min-h-screen bg-white font-geist-mono text-zinc-950 scheme-light-dark dark:bg-zinc-950 dark:text-zinc-50">
      <main class="container mx-auto space-y-8 p-8">
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
      </main>
    </div>
  );
}
