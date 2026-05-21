# Current Spec: CARAVAN Agent-to-Agent Signal Market

## Goal
Ship a judge-ready Agora Agents Hackathon prototype for CARAVAN: three autonomous agents buy, sell, and refuse market signals using live public data, with a real Arc/Circle integration path and explicit fixture labeling when credentials or testnet funding are missing.

## Decided
- Build CARAVAN, not AGRA, because the execution prompt names CARAVAN and the council ranked it as the strongest pure agent-to-agent Arc-finality story.
- Use a Next.js/React product surface with a cinematic, template-borrowed first screen plus an interactive signal room.
- Official sponsor stack is Canteen x Circle Arc Testnet, USDC gas/settlement, Circle faucet, Arc docs, Circle docs, and the Canteen ARC CLI.
- Demo state transition: seller agent publishes a live-data signal, buyer agent pays a tiny USDC-priced fee, buyer agent executes or refuses after cost accounting, and the sale/refusal is recorded through a replayable Arc transaction path.

## Open
- Arc RPC key, funded testnet wallet, and any Circle dashboard/API credentials may need browser/CLI access attempts before a real transaction can be produced.
- Primary submitter/repo owner is selected as Gabriel unless Gabriel overrides; no alternate persona team was hard-coded for this run.
- Submission portal can be inspected and drafted, but legal attestations and final submit remain blocked without explicit approval.

## Out Of Scope
- No live mainnet trading, custody, or real-money claims.
- No Gateway/nanopayment claim unless a working proof lands.
- No Polymarket builder-code attribution unless granted and verified.
- No Kimi-generated product code.

## Done When
- Required planning docs exist in the execution workspace.
- App runs locally, passes build/tests/lint where available, and has a replay command.
- UI has browser evidence and a polish report or an explicit polish blocker.
- Builder report is written to `outputs/builder-report.md` with repo, submission, API, UI, test, blocker, and next-action status.
