# Project intent

This app turns the screen into a warm reading light. Keep the interface simple
and the light comfortable for reading. All light modes should retain a warm
palette. Candle motion should feel irregular and natural, respect reduced-motion
preferences, and pause when the page is hidden.

# Working conventions

- Follow the existing Vue and TypeScript patterns and keep changes focused.
- Prefer clear code over explanatory comments. Do not add documentation for
  every change or duplicate implementation details such as formulas, animation
  parameters, dependency versions, or file inventories here.
- Use Oxlint and Oxfmt through unpinned `npx` commands with default configuration.
  Keep these checks in the Git pre-push hook rather than npm scripts or CI.
- Treat `.githooks/pre-push` as the source of truth for pre-push checks. Enable
  it per clone with `git config --local core.hooksPath .githooks`.
- Run the pre-push hook before pushing. Use the existing build command when
  changing application code or build configuration.
- Do not create or run tests unless explicitly requested, including temporary
  tests, browser automation, and E2E tests outside the repository. Use manual
  inspection and the existing lint, formatting, type, and build checks.
- Commit or push only when requested; a request to commit does not authorize
  pushing.
