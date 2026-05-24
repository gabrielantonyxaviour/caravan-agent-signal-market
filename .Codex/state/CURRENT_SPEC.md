# Current Spec: CARAVAN Agent-to-Agent Signal Market

## Goal
Make the existing Agora Agents Hackathon CARAVAN execution run ready for serious end-to-end testing by adding real web3 auth behavior, expanding E2E coverage, rerunning checks, and writing `outputs/readiness-report.md` with current evidence.

## Decided
- Build CARAVAN, not AGRA, because the execution prompt names CARAVAN and the council ranked it as the strongest pure agent-to-agent Arc-finality story.
- Use a Next.js/React product surface with a cinematic, template-borrowed first screen plus an interactive signal room.
- Official sponsor stack is Canteen x Circle Arc Testnet, USDC gas/settlement, Circle faucet, Arc docs, Circle docs, and the Canteen ARC CLI.
- Demo state transition: seller agent publishes a live-data signal, buyer agent pays a tiny USDC-priced fee, buyer agent executes or refuses after cost accounting, and the sale/refusal is recorded through a replayable Arc transaction path.
- CARAVAN is classified as `web3-auth`: the browser must use an EIP-1193 wallet provider, verify Arc Testnet chain `5042002`, request a signature, and persist only a signed session.
- Readiness must update `FEATURE_MATRIX.md`, `INTEGRATION_MATRIX.md`, `TRUTH_AUDIT.md`, `QUALITY_GATE.md`, `AUTH_PLAN.md`, `E2E_TEST_PLAN.md`, and `READINESS_GATE.md` before writing `outputs/readiness-report.md`.

## Open
- Arc RPC key, funded testnet wallet, wallet browser extension availability, and any Circle dashboard/API credentials may need browser/CLI access attempts before a real transaction can be produced.
- Primary submitter/repo owner is selected as Gabriel unless Gabriel overrides; no alternate persona team was hard-coded for this run.
- Submission portal can be inspected and drafted, but legal attestations and final submit remain blocked without explicit approval.

## Out Of Scope
- No live mainnet trading, custody, or real-money claims.
- No Gateway/nanopayment claim unless a working proof lands.
- No Polymarket builder-code attribution unless granted and verified.
- No Kimi-generated product code.

## Done When
- Required planning docs exist in the execution workspace.
- App runs locally, passes lint/type/unit/build/readiness E2E where available, and has replay plus blocked-submit proof.
- UI has browser evidence at 375, 768, and 1440 widths, plus a formal polish pass or an explicit M2 blocker.
- Every visible button/link/action is audited as working, navigable, disabled with a reason, or removed.
- `outputs/readiness-report.md` records readiness status, auth proof, E2E proof, integrations, blockers, commands, screenshots, and exact next actions.
