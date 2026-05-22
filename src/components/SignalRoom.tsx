import {
  Activity,
  BadgeDollarSign,
  Check,
  Gauge,
  Radio,
  Sparkles,
  X,
} from "lucide-react";
import { CaravanRun } from "@/src/lib/caravan";

export function SignalRoom({
  run,
  decisionTone,
}: {
  run: CaravanRun;
  decisionTone: "red" | "green";
}) {
  return (
    <div
      id="room"
      className="reveal-up delay-1 grid min-h-[650px] gap-4 lg:grid-rows-[auto_1fr_auto]"
    >
      <AgentRoster run={run} />
      <SignalLedger run={run} decisionTone={decisionTone} />
      <CostPanel run={run} />
    </div>
  );
}

function AgentRoster({ run }: { run: CaravanRun }) {
  return (
    <div className="liquid-glass rounded-[28px] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="mono text-xs uppercase tracking-[0.22em] text-white/45">
            Caravan agents
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            Sell, buy, audit.
          </h2>
        </div>
        <Sparkles className="text-[var(--cyan)]" size={22} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {run.agents.map((agent) => (
          <article
            className="rounded-3xl border border-white/10 bg-black/24 p-4"
            key={agent.id}
          >
            <div
              className={`mb-4 h-2 w-12 rounded-full ${
                agent.accent === "green"
                  ? "bg-[var(--green)]"
                  : agent.accent === "cyan"
                    ? "bg-[var(--cyan)]"
                    : "bg-[var(--amber)]"
              }`}
            />
            <h3 className="text-xl font-semibold">{agent.name}</h3>
            <p className="mono mt-1 text-xs uppercase tracking-[0.18em] text-white/45">
              {agent.role}
            </p>
            <p className="mt-4 min-h-[72px] text-sm leading-6 text-white/58">
              {agent.mandate}
            </p>
            <p className="mono mt-4 text-xs text-white/42">{agent.wallet}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function SignalLedger({
  run,
  decisionTone,
}: {
  run: CaravanRun;
  decisionTone: "red" | "green";
}) {
  const paymentLabel =
    run.sale.paymentStatus === "confirmed"
      ? "Bravo paid"
      : run.sale.paymentStatus === "fixture"
        ? "Fixture ticket"
        : "Payment-ready";
  const paymentText =
    run.sale.paymentStatus === "confirmed"
      ? `${run.sale.priceUsdc.toFixed(2)} USDC ticket confirmed on Arc`
      : run.sale.paymentStatus === "fixture"
        ? `${run.sale.priceUsdc.toFixed(2)} USDC simulated ticket; no chain tx claimed`
        : `${run.sale.priceUsdc.toFixed(2)} USDC ticket priced; Arc tx not configured`;

  return (
    <div className="liquid-glass rounded-[28px] p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="text-[var(--green)]" size={19} />
        <h2 className="text-xl font-semibold">Signal ledger</h2>
      </div>
      <div className="space-y-3">
        <LedgerRow icon={<Radio size={16} />} label="Atlas publishes">
          {run.signal.symbol} signal at ${run.signal.observedPrice.toLocaleString()}
        </LedgerRow>
        <LedgerRow icon={<BadgeDollarSign size={16} />} label={paymentLabel}>
          {paymentText}
        </LedgerRow>
        <LedgerRow icon={<Gauge size={16} />} label="Coda audits">
          {run.decision.grossEdgeBps} bps gross edge vs{" "}
          {run.decision.grossEdgeBps - run.decision.netEdgeBps} bps total cost
        </LedgerRow>
        <LedgerRow
          icon={decisionTone === "red" ? <X size={16} /> : <Check size={16} />}
          label="Bravo decides"
          tone={decisionTone}
        >
          {run.decision.decision.toUpperCase()} · {run.decision.reason}
        </LedgerRow>
      </div>
    </div>
  );
}

function LedgerRow({
  icon,
  label,
  children,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  tone?: "red" | "green";
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
      <div
        className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          tone === "red"
            ? "bg-[rgba(255,108,108,0.14)] text-[var(--red)]"
            : tone === "green"
              ? "bg-[rgba(120,255,182,0.14)] text-[var(--green)]"
              : "bg-white/8 text-white/70"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="mono text-[10px] uppercase tracking-[0.18em] text-white/42">
          {label}
        </p>
        <p className="mt-1 text-sm leading-6 text-white/72">{children}</p>
      </div>
    </div>
  );
}

function CostPanel({ run }: { run: CaravanRun }) {
  const costs = [
    ["Gross edge", run.decision.grossEdgeBps, "green"],
    ["Spread", -run.decision.spreadCostBps, "muted"],
    ["Slippage", -run.decision.slippageBps, "muted"],
    ["Stale decay", -run.decision.staleDecayBps, "amber"],
    ["Arc fee", -run.decision.arcFeeBps, "muted"],
  ] as const;

  return (
    <div className="liquid-glass rounded-[28px] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="mono text-xs uppercase tracking-[0.22em] text-white/45">
            Fee table
          </p>
          <h2 className="text-xl font-semibold">Why the buyer refused</h2>
        </div>
        <div className="rounded-full bg-[rgba(255,108,108,0.14)] px-3 py-2 text-sm font-semibold text-[var(--red)]">
          Net {run.decision.netEdgeBps} bps
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-5">
        {costs.map(([label, value, tone]) => (
          <div
            className="rounded-2xl border border-white/10 bg-black/24 p-3"
            key={label}
          >
            <p className="mono text-[10px] uppercase tracking-[0.18em] text-white/42">
              {label}
            </p>
            <p
              className={`mt-2 text-xl font-semibold ${
                tone === "green"
                  ? "text-[var(--green)]"
                  : tone === "amber"
                    ? "text-[var(--amber)]"
                    : "text-white/70"
              }`}
            >
              {value > 0 ? "+" : ""}
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
