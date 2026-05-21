import { useMemo } from "react";
import { ExternalLink, ShieldAlert } from "lucide-react";
import { ARC_TESTNET, CaravanRun } from "@/src/lib/caravan";

export function ProofSections({ run }: { run: CaravanRun }) {
  const proofState = run.sale.txHash
    ? "confirmed"
    : run.signal.isFixture
      ? "fixture"
      : "ready";
  const rows = useMemo(
    () => [
      ["Chain", `Arc Testnet · chain ${ARC_TESTNET.chainId}`],
      ["USDC", ARC_TESTNET.usdc],
      ["Trace", run.decision.traceHash],
      ["Replay", "npm run replay"],
    ],
    [run.decision.traceHash],
  );

  return (
    <section id="proof" className="px-4 pb-16 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1520px] gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="liquid-glass rounded-[28px] p-5 sm:p-8">
          <p className="mono text-xs uppercase tracking-[0.22em] text-white/45">
            Arc/Circle proof
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            The app is honest about chain state.
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-white/62">
            CARAVAN renders a real Arc transaction only when one is configured.
            Until then, it separates live market input from fixture chain proof
            so judges can tell exactly what is proven.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span
              className={`mono rounded-full px-3 py-2 text-xs uppercase tracking-[0.16em] ${
                proofState === "confirmed"
                  ? "bg-[rgba(120,255,182,0.14)] text-[var(--green)]"
                  : proofState === "ready"
                    ? "bg-[rgba(146,232,255,0.13)] text-[var(--cyan)]"
                    : "bg-[rgba(229,169,90,0.14)] text-[var(--amber)]"
              }`}
            >
              {proofState === "confirmed"
                ? "confirmed"
                : proofState === "ready"
                  ? "live data, tx pending"
                  : "fixture chain proof"}
            </span>
            {run.sale.arcscanUrl ? (
              <a
                className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-black"
                href={run.sale.arcscanUrl}
                rel="noreferrer"
                target="_blank"
              >
                Arcscan <ExternalLink size={14} />
              </a>
            ) : null}
          </div>
        </div>
        <div id="packet" className="liquid-glass rounded-[28px] p-5 sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <ShieldAlert className="text-[var(--amber)]" size={24} />
            <h2 className="text-2xl font-semibold tracking-tight">
              Submission packet snapshot
            </h2>
          </div>
          <div className="grid gap-3">
            {rows.map(([label, value]) => (
              <div
                className="grid gap-2 rounded-2xl border border-white/10 bg-black/24 p-4 sm:grid-cols-[140px_1fr]"
                key={label}
              >
                <p className="mono text-[10px] uppercase tracking-[0.18em] text-white/42">
                  {label}
                </p>
                <p className="mono overflow-hidden text-ellipsis text-sm text-white/72">
                  {value}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-white/52">
            No mainnet trading, no hidden custody, and no Gateway/Paymaster
            claim is shown unless a separate proof is added.
          </p>
        </div>
      </div>
    </section>
  );
}
