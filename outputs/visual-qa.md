# Visual QA

## Screenshots Captured

- `outputs/screenshots/prod-1440-final-wait.png`
- `outputs/screenshots/prod-768-final.png`
- `outputs/screenshots/prod-375-final.png`
- `outputs/screenshots/prod-1440-live.png`

## Browser Evidence

- Production server: `http://localhost:3037`
- `curl -I http://localhost:3037`: returned `HTTP/1.1 200 OK`.
- `agent-browser` route snapshot showed the hero, signal room, proof path, and submit packet headings.
- Interactivity check: after scrolling the button into view and clicking `Run live check`, page text changed from `DEMO FIXTURE` to `Live market frame`.

## Polish Gate Status

Attempted official `/polish` path with `playwright-cli-sessions`.

- `PLAYWRIGHT_CLI_REMOTE=m2worker`
- `npx playwright-cli-sessions@latest browser status`: no attached Chrome.
- `npx playwright-cli-sessions@latest browser start`: failed with SSH timeout to `m2worker` / `100.115.214.82:22`.
- Report filed: `/Users/gabrielantonyxaviour/.playwright-sessions/.reports/2026-05-21T01-26-30-014-caravan-polish-attempted-from-workspace-playwrig.md`

Because local M4 fallback is forbidden without Gabriel's explicit approval, the formal polish loop could not run. The best available evidence is the production `agent-browser` screenshot set above.
