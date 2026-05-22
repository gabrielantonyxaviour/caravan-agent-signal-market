import { ArrowRight, BadgeDollarSign, Clock3 } from "lucide-react";
import { CaravanRun } from "@/src/lib/caravan";

export function HeroPanel({
  run,
  isPending,
  mode,
  onLive,
  onReplay,
}: {
  run: CaravanRun;
  isPending: boolean;
  mode: "fixture" | "live";
  onLive: () => void;
  onReplay: () => void;
}) {
  return (
    <div className="liquid-glass reveal-up flex min-h-[650px] flex-col justify-between rounded-[28px] p-5 sm:p-8 lg:rounded-[36px] lg:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="mono rounded-full border border-white/12 px-3 py-2 text-xs uppercase tracking-[0.22em] text-white/58">
          Agent-to-agent signal market
        </span>
        <span
          className={`mono rounded-full px-3 py-2 text-xs ${
            mode === "live"
              ? "bg-[rgba(120,255,182,0.13)] text-[var(--green)]"
              : "bg-[rgba(229,169,90,0.14)] text-[var(--amber)]"
          }`}
        >
          {mode === "live" ? "Live market frame" : "DEMO FIXTURE"}
        </span>
      </div>

      <div className="max-w-4xl py-8 sm:py-10">
        <p className="serif mb-4 text-2xl italic text-[var(--amber)] sm:text-3xl">
          signals get stale fast
        </p>
        <h1 className="max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.04em] text-white sm:text-7xl lg:text-[82px]">
          Agents sell alpha to agents that can still use it.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-white/62 sm:text-lg">
          CARAVAN turns unused market signals into tiny USDC-priced trades on
          Arc. The buyer agent prices the information, audits the route, and may
          refuse execution when costs erase the edge. Real payment proof appears
          only when an Arc transaction hash is configured.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.82fr]">
        <div className="rounded-3xl border border-white/10 bg-black/28 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="mono text-xs uppercase tracking-[0.22em] text-white/45">
                Current sale
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                {run.signal.title}
              </h2>
            </div>
            <BadgeDollarSign className="text-[var(--green)]" size={28} />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric label="Ask" value={`${run.signal.askingPriceUsdc} USDC`} />
            <Metric
              label="Confidence"
              value={`${Math.round(run.signal.confidence * 100)}%`}
            />
            <Metric label="Half-life" value={`${run.signal.halfLifeSeconds}s`} />
            <Metric label="Trace" value={run.signal.evidenceHash} small />
          </div>
        </div>
        <div className="flex flex-col justify-end gap-3">
          <button
            className="group flex items-center justify-between rounded-full bg-white px-5 py-4 text-left font-semibold text-black transition hover:bg-[var(--green)]"
            disabled={isPending}
            onClick={onLive}
            type="button"
          >
            <span>{isPending ? "Fetching market frame" : "Run live check"}</span>
            <ArrowRight
              className="transition group-hover:translate-x-1"
              size={18}
            />
          </button>
          <button
            className="liquid-glass flex items-center justify-between rounded-full px-5 py-4 text-left font-semibold text-white"
            onClick={onReplay}
            type="button"
          >
            <span>Replay deterministic fixture</span>
            <Clock3 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  small,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
      <div className="mono text-[10px] uppercase tracking-[0.18em] text-white/42">
        {label}
      </div>
      <div
        className={`mt-2 font-semibold text-white ${small ? "mono text-xs" : "text-lg"}`}
      >
        {value}
      </div>
    </div>
  );
}
