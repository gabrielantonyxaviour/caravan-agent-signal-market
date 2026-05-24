# Kimi Readiness Inventory: CARAVAN Agent Signal Market

Generated: 2026-05-22 07:33 IST  
Workspace: `/Users/gabrielantonyxaviour/Documents/hackathons/agora-agents-hackathon/execution/2026-05-21T00-46-18Z-caravan-agent-to-agent-signal-market`  
Inventory type: heavy grunt verification (read-only audit + safe local commands)

---

## 1. Package Script Inventory

| Script | Command | Mutates external? | Evidence |
|---|---|---|---|
| `dev` | `next dev --port 3037` | No | Local server |
| `build` | `next build` | No | Compiled successfully |
| `start` | `next start --port 3037` | No | Local server |
| `lint` | `eslint` | No | Passed (zero output = clean) |
| `typecheck` | `tsc --noEmit` | No | Passed |
| `test` | `node --import tsx --test tests/**/*.test.ts` | No | 5/5 passed |
| `replay` | `tsx scripts/replay-demo.ts` | No (unless `--submit` + env) | Passed live + fixture |
| `visual:qa` | `node scripts/local-visual-qa.mjs` | No | Screenshots only |
| `e2e:readiness` | `node scripts/e2e-readiness.mjs` | No | CDP headless screenshots only |

---

## 2. Env Var Inventory

| Var | Used in | Required? | Current state | Notes |
|---|---|---|---|---|
| `NEXT_PUBLIC_ARC_TX_HASH` | `src/components/CaravanExperience.tsx:16` | No | Unset | If set at build time, triggers "confirmed" payment state and Arcscan link |
| `ARC_TESTNET_RPC_URL` | `scripts/replay-demo.ts:20` | Only for `--submit` | Unset | Blocked submit test passed without it |
| `PRIVATE_KEY` | `scripts/replay-demo.ts:21` | Only for `--submit` | Unset | Blocked submit test passed without it |
| `CARAVAN_E2E_URL` | `scripts/e2e-readiness.mjs:9` | No | Defaults to `http://127.0.0.1:3037` | E2E target override |
| `CARAVAN_QA_URL` | `scripts/local-visual-qa.mjs:10` | No | Defaults to production alias | Visual QA target override |
| `CHROME_PATH` | `scripts/e2e-readiness.mjs:7`, `scripts/local-visual-qa.mjs:7` | No | Defaults to `/Applications/Google Chrome.app/...` | Headless Chrome override |
| `PLAYWRIGHT_CLI_REMOTE` | Not referenced in code; used externally for `/polish` | No | `m2worker` set in shell env per prior report | M2 SSH blocked |

No `.env` or `.env.local` file exists in the workspace.

---

## 3. Button / Link / Form / Handler Inventory

### 3.1 Visible actions in product code

| # | Element | Text / Label | File:line | Handler | State |
|---|---|---|---|---|---|
| 1 | `<button>` | `Run live check` (or `Fetching market frame` when pending) | `HeroPanel.tsx:73` | `onClick={onLive}` | **working** — disables via `isPending`; fetches `/api/market` |
| 2 | `<button>` | `Replay deterministic fixture` | `HeroPanel.tsx:85` | `onClick={onReplay}` | **working** — resets fixture mode |
| 3 | `<button>` | `Connect wallet` (or `Connecting wallet`) | `WalletAuthPanel.tsx:256` | `onClick={connectWallet}` | **working or blocked-with-reason** — real EIP-1193 provider request; disabled while `isConnecting` or `checking`; if no provider, sets blocked state |
| 4 | `<button>` | `Disconnect` | `WalletAuthPanel.tsx:248` | `onClick={disconnect}` | **working** — clears `sessionStorage` key |
| 5 | `<a>` | `Signal room` | `CaravanNav.tsx:19` | `href="#room"` | **working** — real section ID |
| 6 | `<a>` | `Wallet auth` | `CaravanNav.tsx:22` | `href="#auth"` | **working** — real section ID |
| 7 | `<a>` | `Proof path` | `CaravanNav.tsx:25` | `href="#proof"` | **working** — real section ID |
| 8 | `<a>` | `Submit packet` | `CaravanNav.tsx:28` | `href="#packet"` | **working** — real section ID |
| 9 | `<a>` | `Arcscan` + `ExternalLink` icon | `ProofSections.tsx:61` | `href={run.sale.arcscanUrl}` | **conditional** — only renders when `txHash` exists; currently absent because `NEXT_PUBLIC_ARC_TX_HASH` is unset |

### 3.2 No-dummy-action audit verdict

- **Zero invalid actions** found by E2E action audit (`scripts/e2e-readiness.mjs:180-203`).
- All `<button>` elements have text.
- All `<a>` elements have either a fragment anchor (`#`) or an external URL.
- No `javascript:void(0)`, no `#` placeholders without targets, no empty `href`.
- No forms, `<input>`, `<textarea>`, or `onSubmit` handlers exist in product code.
- No `localStorage` usage; only `sessionStorage` for wallet session.

---

## 4. Storage Audit

| Key | Type | File | Purpose | Lifecycle |
|---|---|---|---|---|
| `caravan.wallet.session.v1` | `sessionStorage` | `src/lib/wallet-auth.ts` | Persist signed wallet session (account, chainId, signature, message, signedAt) | Tab-scoped; cleared by `disconnect()` or on invalid parse |

No `localStorage` keys are written by the product.

---

## 5. Fixture / Mock / Simulation Inventory

| Artifact | Location | Product or test? | Label in UI? | Verdict |
|---|---|---|---|---|
| `fixtureMarket` (BTC/ETH/SOL static prices) | `src/lib/caravan.ts:104` | Product | **Yes** — `DEMO FIXTURE` badge in `HeroPanel.tsx:30` | **Intentional fallback** with honest label |
| Injected EIP-1193 provider mock (`0x1111...1111`, fake signature) | `scripts/e2e-readiness.mjs:152-177` | **Test harness only** | N/A | **Not in product** |
| Dicebear avatar image (`api.dicebear.com`) | `WalletAuthPanel.tsx:176` | Product | No label needed | **Deterministic visual** based on real account address; blocked if no session |
| Agent wallets (`0xa71a...a911`, etc.) | `src/lib/caravan.ts:77-102` | Product | Displayed under agent cards | **Fixture personas**; not claimed as real user wallets |
| `askingPriceUsdc: 0.12` | `src/lib/caravan.ts:197` | Product | Shown in sale metric and cost panel | **Fixture pricing**; no real USDC transfer claimed |
| `stableHash` | `src/lib/caravan.ts:131` | Product | Evidence hash / trace hash | **Deterministic internal ID**; not a cryptographic security claim |
| Cost constants (`spreadCostBps: 36`, `slippageBps: 52`, etc.) | `src/lib/caravan.ts:179-182` | Product | Rendered in fee table | **Simulation parameters**; labeled as simulation |

---

## 6. Auth-Readiness Audit

### 6.1 Auth classification
`web3-auth` (EIP-1193 browser wallet, no email/OAuth product login)

### 6.2 Implementation details

| Concern | File | Evidence |
|---|---|---|
| Provider detection | `src/lib/wallet-auth.ts:21-24` | Reads `window.ethereum`; returns `undefined` if SSR or missing |
| Account request | `src/components/WalletAuthPanel.tsx:90` | `eth_requestAccounts` |
| Chain switch/check | `src/components/WalletAuthPanel.tsx:98-114` | Switches to `0x4cef52` (Arc Testnet 5042002); re-checks after switch |
| Message signing | `src/components/WalletAuthPanel.tsx:116-121` | `personal_sign` with `buildSignMessage(account, signedAt)` |
| Session persistence | `src/lib/wallet-auth.ts:62-63` | Writes to `sessionStorage` |
| Session read/restore | `src/lib/wallet-auth.ts:41-59` | Validates all 5 fields before restoring |
| Session clear | `src/lib/wallet-auth.ts:66-67` | Removes key from `sessionStorage` |
| No-wallet blocked state | `src/components/WalletAuthPanel.tsx:42-47` | Shows explicit blocked message and red styling |

### 6.3 Test evidence

| Test | Result | File evidence |
|---|---|---|
| No-wallet blocked state | **Passed** | `outputs/readiness-e2e.json` `noWallet.walletBlocked: true`; screenshot `no-wallet-375.png` |
| Injected provider signed session | **Passed** | `outputs/readiness-e2e.json` `injectedWallet.connected: true`, `chainId: "0x4cef52"`, `hasSignature: true`; screenshot `wallet-connected-1440.png` |
| Unit test: auth message binds chain | **Passed** | `tests/caravan.test.ts:64-74` asserts `ARC_CHAIN_ID_HEX === "0x4cef52"` and message content |
| Real wallet extension signature | **Blocked** | No unlocked wallet/profile available in local headless QA environment |

### 6.4 Operator auth (Canteen CLI)

| Step | Evidence | Status |
|---|---|---|
| `arc-canteen login` | Generated device code `6916-3154` | Attempted |
| `agent-browser` GitHub flow | Reached `Authorize SWARM-cli` as Gabriel | Reached |
| `Authorize the-canteen-dev` button | Disabled in UI; screenshot `outputs/readiness-arc-login-disabled.png` | **Blocked** |
| `arc-canteen status` | `Not logged in` | **Blocked** |
| `arc-canteen rpc eth_chainId` | Not logged in | **Blocked** |

### 6.5 Exact auth gaps

1. **Real wallet extension proof**: Need an unlocked browser wallet on Arc Testnet to capture a genuine `personal_sign` signature.
2. **Canteen/GitHub OAuth approval**: The `Authorize the-canteen-dev` button is disabled; may require org membership, app approval, or a different GitHub account.
3. **Arc RPC token / URL**: Cannot be obtained until Canteen login succeeds.
4. **Funded testnet wallet**: Cannot be created/funded until RPC access exists.

---

## 7. Integration-Readiness Audit

| Service / Protocol | Real access path | Credential / env | Proof command or browser proof | Status | Blocker |
|---|---|---|---|---|---|
| CoinGecko public API | `app/api/market/route.ts` -> `fetchMarketFrame()` -> `api.coingecko.com` | None | `curl -s http://127.0.0.1:3037/api/market` returned `ok=true` with BTC/ETH/SOL; E2E JSON `coingeckoProof.{bitcoin,ethereum,solana}: true` | **Proven** | Public rate limits only |
| Same-origin market route | `app/api/market/route.ts` | None | `npm run build` shows `ƒ /api/market` dynamic route; curl passed | **Proven** | None |
| Browser wallet provider | `window.ethereum` EIP-1193 | User wallet extension | Injected-provider test passed; no-wallet blocked state passed | **Implemented; real-wallet blocked** | No unlocked extension in headless |
| Arc Testnet RPC | `scripts/replay-demo.ts` via `viem` `http(rpcUrl)` | `ARC_TESTNET_RPC_URL` | `env -u ARC_TESTNET_RPC_URL -u PRIVATE_KEY npm run replay -- --submit --fixture` returned `status: "blocked"`, `reason: "Missing ARC_TESTNET_RPC_URL or PRIVATE_KEY."` | **Blocked** | No RPC URL |
| Arc transaction submission | `scripts/replay-demo.ts -- --submit` | `ARC_TESTNET_RPC_URL` + `PRIVATE_KEY` | Submit path is coded; blocks cleanly without env; no send attempted | **Blocked** | No RPC URL, no private key, no funded wallet |
| Arcscan explorer | `https://testnet.arcscan.app/tx/<txHash>` | Real tx hash | UI generates link only when `txHash` exists; currently absent | **Blocked** | No tx hash |
| Circle/USDC on Arc | Hardcoded `ARC_TESTNET.usdc` address | No Circle API key in app | UI displays `0x3600...0000` and `0.12 USDC` ticket | **Label-proven only** | Real transfer requires wallet + RPC |
| Solidity registry contract | `contracts/SignalMarketRegistry.sol` | No deploy key | `npx --yes solc@0.8.30 --bin --abi contracts/SignalMarketRegistry.sol -o /tmp/...` passed | **Compile-proven only** | No deployment address or call proof |
| Vercel deployment | `rax-tech/caravan-agent-signal-market` | Existing Vercel CLI auth | Prior hardening proved alias `https://caravan-agent-signal-market.vercel.app` | **Existing demo proven** | Current readiness changes not redeployed |
| GitHub public repo | `origin` remote | Existing GitHub CLI auth | `gh repo view gabrielantonyxaviour/caravan-agent-signal-market --json visibility` returned public | **Proven** | Current changes local only |
| Formal M2 `/polish` | `playwright-cli-sessions` | SSH to `m2worker` | SSH preflight to `100.115.214.82:22` timed out; report saved | **Blocked** | M2 worker unreachable |
| Local visual QA fallback | `scripts/local-visual-qa.mjs` | None | Passed 375/768/1440 + live click; screenshots under `outputs/screenshots/` | **Proven fallback** | Not a formal `/polish` score |
| Google Form submission | Google Form URL (external) | Gabriel profile | Not touched in this pass | **Blocked** | Demo video missing; requires explicit approval |

---

## 8. Build / Route / Dependency Inventory

| Check | Evidence | Status |
|---|---|---|
| `npm run lint` | Zero errors/warnings | Passed |
| `npm run typecheck` | `tsc --noEmit` clean | Passed |
| `npm test` | 5/5 passed | Passed |
| `npm run build` | Routes `/` (static) and `/api/market` (dynamic) generated | Passed |
| `npm run replay` | Returned `marketStatus: "live"`, `paymentStatus: "ready"` | Passed |
| `npm run replay -- --fixture` | Returned `paymentStatus: "fixture"` | Passed |
| Blocked submit proof | `env -u ARC_TESTNET_RPC_URL -u PRIVATE_KEY npm run replay -- --submit --fixture` returned `status: "blocked"` | Passed |
| `npm audit --omit=dev` | 2 moderate advisories in Next bundled PostCSS; installed `next@16.2.6` matches latest | Residual risk accepted |
| Contract compile | `solc@0.8.30` produced ABI/bin under `/tmp/caravan-readiness-contract-check` | Passed |
| `git diff --check` | No trailing whitespace conflicts | Passed |

Dependencies of note:
- `next@16.2.6` (latest as of check)
- `viem@^2.45.5` (used only in `scripts/replay-demo.ts` for optional submit)
- `react@19.2.4`, `react-dom@19.2.4`
- `framer-motion`, `gsap`, `lenis`, `lucide-react` (UI only)
- No wallet connector library (MetaMask SDK, RainbowKit, etc.) — uses raw EIP-1193

---

## 9. Codebase File Map

```
app/
  api/market/route.ts        # Same-origin CoinGecko proxy
  globals.css                # Tailwind + custom liquid-glass styles
  layout.tsx                 # Root layout; metadata title/description
  page.tsx                   # Renders <CaravanExperience />
contracts/
  SignalMarketRegistry.sol   # Solidity event registry (compile-proven only)
src/
  components/
    CaravanExperience.tsx    # Root state container; fetches market; mounts panels
    CaravanNav.tsx           # Fixed nav; 4 anchor links + proof label pill
    HeroPanel.tsx            # Hero + 2 primary action buttons
    ProofSections.tsx        # Arc proof + submission packet snapshot
    SignalRoom.tsx           # Agent roster, signal ledger, cost panel
    WalletAuthPanel.tsx      # EIP-1193 auth UI; provider detection + sign
  lib/
    caravan.ts               # Domain logic: agents, fixtureMarket, fetchMarketFrame, buildCaravanRun
    wallet-auth.ts           # Provider detection, session read/write, message builder
tests/
  caravan.test.ts            # 5 unit tests: fixture, live, confirmed, hash, wallet auth message
scripts/
  e2e-readiness.mjs          # CDP E2E: no-wallet flow, injected wallet flow, action audit
  local-visual-qa.mjs        # CDP visual QA: 3 viewports + live click
  replay-demo.ts             # Node replay: market fetch, build run, optional Arc submit
```

---

## 10. Blocker Summary for Claude / GPT

| # | Blocker | Owner | Exact gap | Suggested next step |
|---|---|---|---|---|
| 1 | Real wallet extension proof | Gabriel / operator | No unlocked wallet on Arc Testnet in local headless | Use a real browser profile with a wallet extension installed on chain 5042002; click `Connect wallet` and capture signature |
| 2 | Canteen GitHub OAuth approval | Canteen platform / Gabriel | `Authorize the-canteen-dev` button disabled | Contact Canteen support or verify correct GitHub account/org; do not bypass disabled controls |
| 3 | Arc RPC URL | Canteen CLI | `arc-canteen` not logged in | Resolve blocker #2, then run `arc-canteen status` and `arc-canteen rpc-url` |
| 4 | Funded Arc Testnet wallet | Gabriel | No private key, no faucet proof | After RPC access, create wallet and fund via allowed Arc faucet without CAPTCHA bypass |
| 5 | Arc transaction hash | Gabriel | No submit attempted | Set `ARC_TESTNET_RPC_URL` and `PRIVATE_KEY`, run `npm run replay -- --submit`, capture tx hash |
| 6 | Contract deployment | Gabriel | No deploy command or address | Optional; only needed if submission claims on-chain registry usage |
| 7 | Updated public deploy | Gabriel / Vercel | Readiness changes are local | Run `vercel --prod` after tx proof and E2E pass |
| 8 | Demo video URL | Gabriel | Missing | Record local demo flow; upload; add to submission form |
| 9 | Final submission | Gabriel | Google Form not filled | Fill form only after #1-#8; stop before final submit unless Gabriel explicitly approves |
| 10 | Formal `/polish` | M2 worker infra | SSH timeout to `100.115.214.82:22` | Retry M2 connection or accept local visual QA fallback |

---

## 11. Safety Attestations

- No dummy login button remains in product code.
- No fake connected wallet state is rendered without a real signed session.
- No Arcscan link or confirmed payment language appears unless `NEXT_PUBLIC_ARC_TX_HASH` is set at build time.
- Fixture/payment-ready/blocked labels are explicit in UI and tests.
- No credentials, private keys, or tokens are stored in the repo.
- No CAPTCHA bypass, no legal attestation, and no final submission was performed.
- All external mutations (Arc transaction send, Vercel deploy, Google Form submit) are gated by missing credentials or explicit approval.

---

*End of inventory.*
