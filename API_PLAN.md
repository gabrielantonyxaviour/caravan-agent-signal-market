# API_PLAN

## Stack

- App: Next.js + React + TypeScript.
- Styling: Tailwind CSS with template-derived custom CSS for liquid glass, fixed hero geometry, and dense operational panels.
- Agent/demo engine: TypeScript modules under `src/lib`.
- Replay command: `scripts/replay-demo.ts`.
- Optional chain client: `viem` against Arc Testnet when `ARC_TESTNET_RPC_URL` and testnet keys are present.

## Data Model

### Agent

- `id`: stable agent id, e.g. `atlas`, `bravo`, `coda`
- `name`: display name
- `mandate`: what the agent optimizes for
- `walletAddress`: optional EVM address
- `riskLimitBps`: max edge risk

### Signal

- `id`
- `symbol`
- `source`
- `observedPrice`
- `twentyFourHourChange`
- `confidence`
- `halfLifeSeconds`
- `sellerAgentId`
- `askingPriceUsdc`
- `evidenceHash`
- `createdAt`

### SignalSale

- `id`
- `signalId`
- `sellerAgentId`
- `buyerAgentId`
- `priceUsdc`
- `paymentStatus`: `fixture`, `ready`, `submitted`, `confirmed`, `blocked`
- `txHash`: optional Arc transaction hash
- `arcscanUrl`: optional
- `createdAt`

### BuyerDecision

- `id`
- `saleId`
- `decision`: `execute` or `refuse`
- `grossEdgeBps`
- `costBps`
- `netEdgeBps`
- `reason`
- `traceHash`
- `recordTxHash`: optional

## API And Integration Boundaries

- Live public market source: CoinGecko or Binance public price APIs, with deterministic fixture data as fallback.
- Arc read/write: optional `viem` helper reads chain ID and can submit direct USDC or registry transactions when credentials exist.
- Circle faucet: browser/manual-CAPTCHA-gated external funding surface; never bypass CAPTCHA.
- Canteen ARC CLI: first choice for RPC key and context sync.

## Secrets

Never commit:

- `ARC_TESTNET_RPC_URL`
- `PRIVATE_KEY`
- Circle API keys
- OAuth tokens
- faucet/session cookies

All secrets live in `.env.local` or shell environment only. `.gitignore` must include `.env*`.

## Real Integration Proof Path

1. `arc-canteen rpc eth_chainId` returns Arc Testnet chain ID.
2. Wallet has Arc Testnet USDC for gas.
3. `scripts/replay-demo.ts --submit` submits a registry event or direct USDC micro-transfer.
4. App renders the returned tx hash and Arcscan URL.
5. Report records exact command, transaction hash, and any Circle/Arc friction.

## Fallback Policy

- Fixture data is allowed only with visible `DEMO FIXTURE` labeling.
- Live market data without chain proof is acceptable as partial progress, not as a completed sponsor integration.
- No copy may claim `paid on Arc`, `Gateway`, `Paymaster`, or `Circle Wallets` unless verified by command output or browser proof.
