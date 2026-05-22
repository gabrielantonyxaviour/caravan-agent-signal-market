# Quality Gate

Hackathon: Agora Agents Hackathon
Idea: CARAVAN Agent-to-Agent Signal Market

Updated: 2026-05-22 05:26 IST

Final status: demo-ready

| Gate | Evidence | Status |
|---|---|---|
| Unit/type/build checks | `npm run lint` passed; `npm run typecheck` passed; `npm test` passed 4/4; `npm run build` passed | passed |
| Replay checks | `npm run replay` returned live market frame and refusal; `npm run replay -- --fixture` returned fixture refusal; `npm run replay -- --submit --fixture` returned blocked on missing env | passed with Arc submit blocked |
| Integration/API/RPC/contract smoke checks | CoinGecko curl returned BTC/ETH/SOL data; `arc-canteen status` and `arc-canteen rpc eth_chainId` returned not logged in; solc 0.8.30 produced ABI/bin under `/tmp/caravan-contract-check` | passed except Arc/Canteen auth blocked |
| Public repo/deploy state | GitHub repo is public under `gabrielantonyxaviour`; Vercel deploy `dpl_27WhLwXN6k7ENDwmdCaFiQJ63WJg` is ready and aliased to `https://caravan-agent-signal-market.vercel.app`; `curl -I` returned HTTP 200 | passed; local hardening edits pending push |
| Browser proof for primary flow | `npm run visual:qa` clicked `Run live check` on production and reached `Live market frame`; screenshot `outputs/screenshots/hardening-1440-live.png` | passed local fallback |
| Local visual QA at 375 / 768 / 1440 | `outputs/screenshots/hardening-375-fixture.png`; `outputs/screenshots/hardening-768-fixture.png`; `outputs/screenshots/hardening-1440-fixture.png`; no horizontal overflow; hero/ledger/proof labels present | local-visual-qa-passed |
| Formal /polish | `PLAYWRIGHT_CLI_REMOTE=m2worker`; `browser status` no attached Chrome; `browser start` failed SSH preflight timeout to `100.115.214.82:22`; report saved to `/Users/gabrielantonyxaviour/.playwright-sessions/.reports/2026-05-21T23-51-22-283-caravan-formal-polish-attempt-from-hardening-pas.md` | formal-polish-blocked-by-m2 |
| Hidden mock/fake claim audit | README, execution packet, metadata, hero, ledger, proof panel, `TRUTH_AUDIT.md`, and this gate now separate fixture/payment-ready/confirmed states | passed |
| Security/dependency audit | `npm audit --omit=dev` reports 2 moderate advisories from Next's bundled PostCSS path; `npm view next version` returned `16.2.6`, matching installed version | residual-risk |
| Submission readiness | Demo and repo/deploy exist; real Arc tx, demo video URL, and final Google Form approval are missing | blocked for submit-ready |

Final visual status: local-visual-qa-passed; formal-polish-blocked-by-m2
