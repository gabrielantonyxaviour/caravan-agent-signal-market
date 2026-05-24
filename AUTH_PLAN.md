# Auth Plan

Hackathon: Agora Agents Hackathon
Idea: CARAVAN Agent-to-Agent Signal Market
Updated: 2026-05-22 07:25 IST

Auth classification: `web3-auth`

Decision evidence:
- Product claim is an agent-to-agent USDC-priced signal market on Arc Testnet.
- Primary proof path requires wallet account state, Arc chain checks, and transaction/RPC proof.
- Regular email/OAuth app login is not the user-facing product auth path; Canteen/GitHub device auth is an operator credential path for Arc CLI/RPC.

| Actor / role | Required auth | Implementation path | Real credential/profile/wallet | Test proof | Status | Blocker |
|---|---|---|---|---|---|---|
| Browser product tester / operator | EIP-1193 wallet connect, Arc Testnet chain `5042002`, `personal_sign` session, no fake connected state | `src/components/WalletAuthPanel.tsx`; `src/lib/wallet-auth.ts`; nav link `#auth` | Real wallet extension not available in local headless QA; no private key stored in repo | `npm run e2e:readiness` passed app-side injected-provider flow with account `0x1111...1111`, chain `0x4cef52`, and signed session; no-wallet path shows blocked state | implemented; real-wallet proof blocked | Need an unlocked browser wallet/profile on Arc Testnet to prove a real extension signature. |
| No-wallet browser | Explicit blocked auth state | `WalletAuthPanel` provider detection and `Connect wallet` error path | No credential | `npm run e2e:readiness` passed no-wallet failure path; screenshot `outputs/readiness-e2e/no-wallet-375.png` | passed | None. |
| Arc/Canteen operator | GitHub device authorization for `arc-canteen` CLI | `/Users/gabrielantonyxaviour/.local/bin/arc-canteen login` plus Gabriel Chrome profile through `agent-browser` | Gabriel Chrome profile `Default` used; CLI token not minted | `arc-canteen login` generated code `6916-3154`; `agent-browser --profile "Default"` reached GitHub `Authorize SWARM-cli`; `Authorize the-canteen-dev` button was disabled; screenshot `outputs/readiness-arc-login-disabled.png`; `arc-canteen status` and `arc-canteen rpc eth_chainId` still return not logged in | blocked | GitHub OAuth authorization button disabled; no Canteen RPC token. |
| Arc transaction submitter | `ARC_TESTNET_RPC_URL`, `PRIVATE_KEY`, funded Arc Testnet wallet | `scripts/replay-demo.ts -- --submit` using `viem` | Missing | `env -u ARC_TESTNET_RPC_URL -u PRIVATE_KEY npm run replay -- --submit --fixture` returns blocked: missing env | blocked | No RPC URL, no private key, no funded wallet, no faucet proof. |

Kimi readiness inventory findings (2026-05-22 07:33 IST):
- **sessionStorage key**: `caravan.wallet.session.v1` is the only storage key written by the product; no `localStorage` usage.
- **Provider detection**: `src/lib/wallet-auth.ts:21-24` reads `window.ethereum` directly; no wallet connector library (MetaMask SDK, RainbowKit, etc.) is in dependencies.
- **Env vars**: `NEXT_PUBLIC_ARC_TX_HASH` (optional, build-time), `ARC_TESTNET_RPC_URL`, `PRIVATE_KEY` (both submit-only, currently unset). No `.env` or `.env.local` file exists.
- **Unit test evidence**: `tests/caravan.test.ts:64-74` asserts `ARC_CHAIN_ID_HEX === "0x4cef52"` and message binding; 5/5 tests passed.
- **Blocker unchanged**: Real wallet extension signature, Canteen GitHub OAuth disabled button, Arc RPC URL, private key, funded wallet remain missing.

Auth rules applied:
- No dummy login button remains; `Connect wallet` calls the browser wallet provider and otherwise reports a blocked state.
- No connected account is displayed unless a signed wallet session exists.
- No Arcscan link or confirmed payment state is displayed unless a real tx hash is configured.
