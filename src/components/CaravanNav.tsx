import { Radio } from "lucide-react";

export function CaravanNav({ proofLabel }: { proofLabel: string }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 py-4 sm:px-6 lg:px-10">
      <nav className="liquid-glass mx-auto flex max-w-[1520px] items-center justify-between rounded-full px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--green)] text-black">
            <Radio size={18} />
          </div>
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.24em] text-white/50">
              Agora Agents
            </div>
            <div className="text-lg font-semibold tracking-tight">CARAVAN</div>
          </div>
        </div>
        <div className="hidden items-center gap-6 text-sm text-white/62 md:flex">
          <a className="transition hover:text-white" href="#room">
            Signal room
          </a>
          <a className="transition hover:text-white" href="#proof">
            Proof path
          </a>
          <a className="transition hover:text-white" href="#packet">
            Submit packet
          </a>
        </div>
        <div className="mono hidden rounded-full border border-white/12 px-3 py-2 text-xs text-white/70 sm:block">
          {proofLabel}
        </div>
      </nav>
    </header>
  );
}
