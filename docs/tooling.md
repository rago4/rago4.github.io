# Checks before pushing

The Git pre-push hook runs Oxlint and Oxfmt through `npx` using their latest
versions. There are no pinned versions, project dependencies, npm scripts,
tool configuration files, or CI checks for these tools.

Enable the tracked hook once per clone:

```sh
git config --local core.hooksPath .githooks
```

The hook checks lint, formatting, and TypeScript before each push. A failed check
stops the push. Oxlint uses default rules plus its built-in Vue plugin. Oxfmt uses
default formatting and checks files without rewriting them during a push.
The existing `npm run typecheck` command runs `vue-tsc --noEmit` to check
TypeScript and Vue components without generating output files.

Run the same checks manually:

```sh
npx --yes oxlint@latest --vue-plugin
npx --yes oxfmt@latest --check
npm run typecheck
```

To apply safe lint fixes and format files:

```sh
npx --yes oxlint@latest --vue-plugin --fix
npx --yes oxfmt@latest
```

`npx` downloads tools into npm's cache and may require network access. Latest
versions can introduce new rules or formatting changes. Both tools respect
`.gitignore` during directory traversal, excluding `dist` and `node_modules`.
Oxfmt also skips lockfiles automatically. Oxlint checks Vue `<script>` blocks;
Oxfmt formats the whole Vue file, including templates and styles.

References: [Oxlint](https://oxc.rs/docs/guide/usage/linter/quickstart),
[Oxlint CLI](https://oxc.rs/docs/guide/usage/linter/cli),
[Oxfmt](https://oxc.rs/docs/guide/usage/formatter/quickstart).
