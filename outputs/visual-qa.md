# Visual QA

Updated: 2026-05-22 05:26 IST

## Screenshots Captured

- `outputs/screenshots/hardening-375-fixture.png`
- `outputs/screenshots/hardening-768-fixture.png`
- `outputs/screenshots/hardening-1440-fixture.png`
- `outputs/screenshots/hardening-1440-live.png`
- `outputs/screenshots/prod-1440-final-wait.png`
- `outputs/screenshots/prod-768-final.png`
- `outputs/screenshots/prod-375-final.png`
- `outputs/screenshots/prod-1440-live.png`

## Browser Evidence

- Production URL: `https://caravan-agent-signal-market.vercel.app`
- `curl -I https://caravan-agent-signal-market.vercel.app`: returned `HTTP/2 200`.
- `npm run visual:qa` used local headless Chrome to verify hero, fixture label, signal ledger, proof label, and no horizontal overflow at 375, 768, and 1440.
- Interactivity check: clicking `Run live check` changed page state to `Live market frame`.
- Report: `outputs/local-visual-qa-hardening.md`.

## Polish Gate Status

Attempted official `/polish` path with `playwright-cli-sessions`.

- `PLAYWRIGHT_CLI_REMOTE=m2worker`
- `npx playwright-cli-sessions@latest browser status`: no attached Chrome.
- `npx playwright-cli-sessions@latest browser start`: failed with SSH preflight timeout to `m2worker` / `100.115.214.82:22`.
- Report filed: `/Users/gabrielantonyxaviour/.playwright-sessions/.reports/2026-05-21T23-51-22-283-caravan-formal-polish-attempt-from-hardening-pas.md`

Final visual status: `local-visual-qa-passed; formal-polish-blocked-by-m2`.
