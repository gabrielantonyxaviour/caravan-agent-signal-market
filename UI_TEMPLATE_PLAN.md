# UI_TEMPLATE_PLAN

## Selected Production Template

- Primary template: `06-linear` (`/Users/gabrielantonyxaviour/Documents/templates/06-linear`)
- Borrowed patterns: restrained dark SaaS structure, quiet fixed navigation, crisp numbered sections, reveal timing, dense product mockup panels.

## Selected MotionSites Prompts

- `innovation-landing`: liquid-glass primitives, cinematic dark page rhythm, first-screen interactive object over full-bleed backdrop.
- `portal-hero`: bottom-weighted cinematic hero, liquid glass controls, staggered blur-fade-up motion.
- `rivr`: DeFi-specific glass cards and rounded surface language, adapted without the pale/beige base.

## Visual System

- Brand: CARAVAN.
- Vibe: midnight trading floor meets agent convoy; serious, fast, and legible.
- Palette: graphite black, porcelain white, signal green, copper amber, cold cyan. Avoid one-note purple/blue gradients and beige/sand dominance.
- Typography: use a refined sans for operational text and a serif/italic accent for one or two judge-moment phrases only.
- Components: liquid-glass buttons/pills, thin borders, status LEDs, compact agent cards, ledger rows, and one large live signal rail.

## First-Screen Judge Moment

The first viewport must show the whole product thesis without scrolling:

> Agent Alpha sells a stale market signal for 0.12 USDC; Agent Bravo pays, runs cost accounting, and refuses execution.

The screen must include:

- Three visible agent identities.
- A live/fixture signal card.
- A USDC-priced sale ticket.
- A fee table ending in `REFUSE`.
- Arc proof status with clear `real`, `ready`, or `blocked` state.

## Motion Language

- Staggered reveal on hero elements.
- Slow horizontal signal ticker movement, not distracting loops.
- Hover interactions reveal cost-accounting details.
- Status LEDs pulse only when live data is fresh or transaction submission is pending.
- Respect reduced-motion by disabling non-essential transforms.

## Code/Design Patterns To Reuse Or Adapt

- From `06-linear/app/globals.css`: dark tokens, reveal classes, restrained section typography, thin scrollbar.
- From `06-linear` component structure: `Nav`, `Hero`, product mockup, numbered proof sections, CTA packet.
- From `innovation-landing`: `.liquid-glass` border treatment and cinematic full-viewport hero.
- From `rivr`: DeFi glass cards and bottom-corner utility panel idea, adapted to CARAVAN's signal ledger.

## Visual QA Acceptance Criteria

- Route `/` works at 375, 768, and 1440 widths without overlap.
- First viewport shows brand, agent-to-agent sale, buyer refusal, and Arc proof status.
- UI clearly labels fixture/demo state if no chain tx is present.
- No generic 3x3 feature grids, no dashboard stat-card hero, no search icon in inputs, no decorative orbs.
- `/polish` target: marketing/landing threshold 95. If M2/Playwright routing blocks polish, record the exact blocker and provide browser screenshots from the best available local preview.
