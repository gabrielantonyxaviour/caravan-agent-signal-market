# Current Spec: CARAVAN Agent-to-Agent Signal Market

## Goal
Harden the existing Agora Agents Hackathon CARAVAN execution run so every product, repo, deploy, integration, fixture, and visual claim is backed by current evidence or relabeled before the hardening report is written.

## Decided
- Build CARAVAN, not AGRA, because the execution prompt names CARAVAN and the council ranked it as the strongest pure agent-to-agent Arc-finality story.
- Use a Next.js/React product surface with a cinematic, template-borrowed first screen plus an interactive signal room.
- Official sponsor stack is Canteen x Circle Arc Testnet, USDC gas/settlement, Circle faucet, Arc docs, Circle docs, and the Canteen ARC CLI.
- Demo state transition: seller agent publishes a live-data signal, buyer agent pays a tiny USDC-priced fee, buyer agent executes or refuses after cost accounting, and the sale/refusal is recorded through a replayable Arc transaction path.
- Hardening must update `FEATURE_MATRIX.md`, `INTEGRATION_MATRIX.md`, `TRUTH_AUDIT.md`, and `QUALITY_GATE.md` before writing `outputs/hardening-report.md`.

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
- UI has browser evidence at 375, 768, and 1440 widths, plus a formal polish pass or an explicit M2 blocker.
- `outputs/hardening-report.md` records changes made, checks run, visual proof, real integrations, fixtures/mocks, blockers, and exact next actions.
