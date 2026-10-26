import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { CLOCK, FIXTURE, scoreAt } from "@/data/match";
import { useApp } from "@/state/store";
import { Tag } from "@/components/ui";
import { cn } from "@/lib/utils";

const NAV = [
  {
    group: "Live Ops",
    items: [
      { to: "/", num: "01", label: "Command Centre" },
      { to: "/tactical", num: "02", label: "Tactical Intelligence" },
    ],
  },
  {
    group: "Story",
    items: [
      { to: "/studio", num: "03", label: "Story & Overlay Studio" },
      { to: "/recap", num: "04", label: "Match Recap" },
      { to: "/recap-studio", num: "08", label: "Full-Time Story Studio" },
    ],
  },
  {
    group: "Forensics",
    items: [
      { to: "/explorer", num: "06", label: "Event Explorer" },
    ],
  },
  {
    group: "System",
    items: [
      { to: "/stack", num: "05", label: "Tech Stack" },
      { to: "/personalise", num: "07", label: "Language & Personalisation" },
    ],
  },
];

function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-2.5 no-underline">
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden className="shrink-0">
        <rect x="1" y="1" width="28" height="28" fill="none" stroke="var(--pp-teal)" strokeWidth="1.4" />
        <path d="M8 21V9h7v3h-4v2h3.5v3H11v4H8Z" fill="var(--pp-lime)" />
        <path d="M17 21V9h4.5a3.5 3.5 0 0 1 0 7H20v5h-3Zm3-7.5h1.2a1.2 1.2 0 0 0 0-2.4H20v2.4Z" fill="var(--pp-teal)" />
      </svg>
      <span className="display text-lg leading-none tracking-wide">PITCHPULSE</span>
    </Link>
  );
}

function Scoreline({ compact }: { compact?: boolean }) {
  const { clock } = useApp();
  const s = scoreAt(clock);
  return (
    <div className={cn("flex items-center gap-2", compact && "gap-1.5")}>
      <span className="pixel-sm text-foreground">{FIXTURE.homeShort}</span>
      <span className="tabular display text-base text-lime">{s.mci}</span>
      <span className="ink-dim text-xs">–</span>
      <span className="tabular display text-base text-lime">{s.liv}</span>
      <span className="pixel-sm text-foreground">{FIXTURE.awayShort}</span>
      <span className="tabular pixel-sm text-teal">{CLOCK(clock)}</span>
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <nav aria-label="Scenes" className="flex flex-col gap-5">
      {NAV.map((g) => (
        <div key={g.group}>
          <p className="hud-label mb-2">{g.group}</p>
          <ul className="flex flex-col gap-1">
            {g.items.map((it) => {
              const active = pathname === it.to;
              return (
                <li key={it.to}>
                  <Link to={it.to} onClick={onNavigate}
                    className={cn(
                      "group flex items-center gap-2.5 border px-2.5 py-2 no-underline transition-colors",
                      active ? "border-lime/60 bg-lime/10" : "border-transparent hover:border-line hover:bg-teal/5"
                    )}>
                    <span className={cn("pixel-sm w-6 shrink-0", active ? "text-lime" : "text-teal")}>{it.num}</span>
                    <span className={cn("text-sm font-semibold", active ? "text-lime" : "text-foreground")}>{it.label}</span>
                    {active && <span className="ml-auto h-2 w-2 shrink-0 bg-lime" aria-hidden />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { clock, playing, glitch } = useApp();
  const [drawer, setDrawer] = useState(false);
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <div className="flex min-h-screen w-full">
      {/* desktop rail */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-surface/60 px-4 py-5 lg:flex">
        <Wordmark />
        <div className="my-5 border-y border-line py-2">
          <Scoreline />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
          <NavLinks />
        </div>
        <div className="mt-4 space-y-2 border-t border-line pt-3">
          <div className="flex items-center gap-2">
            <span className={cn("h-2 w-2", playing ? "bg-lime anim-pulse" : "bg-teal")} aria-hidden />
            <span className="pixel-sm text-teal">{playing ? "PLAYBACK LIVE" : "PAUSED"}</span>
          </div>
          <p className="pixel-sm text-teal/70">FEED · SYNTHETIC DEMO</p>
          <p className="text-[11px] ink-dim">No real data. No live feed.</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* command strip */}
        <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur-sm">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5 sm:flex sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <button className="btn btn-quiet !p-1.5 lg:hidden" aria-label="Open navigation" aria-expanded={drawer} onClick={() => setDrawer(true)}>
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden><path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.6" /></svg>
              </button>
              <div className="lg:hidden"><Wordmark /></div>
              <div className="hidden min-w-0 items-center gap-2 lg:flex">
                <Tag lime>SYNTHETIC DEMO</Tag>
                <Tag>{FIXTURE.competition.toUpperCase()}</Tag>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="lg:hidden"><Scoreline compact /></div>
              <div className="hidden items-center gap-2 sm:flex lg:hidden xl:flex">
                <Tag>{playing ? "● PLAYING" : "❚❚ PAUSED"}</Tag>
                <Tag>{pathname.replace("/", "").toUpperCase() || "LIVE"}</Tag>
              </div>
            </div>
          </div>
          {/* data ticker */}
          <div className="overflow-hidden border-t border-line bg-surface-2/60 py-1" aria-hidden>
            <div className="flex w-max anim-ticker gap-8 px-4">
              {[0, 1].map((k) => (
                <div key={k} className="flex gap-8">
                  {["SYNTHETIC DEMO DATASET", "MCI 62% POSSESSION", "HAALAND ×2 GOALS", "KDB 2 ASSISTS", "HIGH RECOVERIES 12", "EXPERIMENTAL INDICATORS — NOT OFFICIAL METRICS", "67' YELLOW — MAC ALLISTER", "EVENTS GROUNDED · EV-0031 / EV-0123"].map((t, i) => (
                    <span key={i} className="pixel-sm text-teal/80">{t}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </header>

        <main className={cn("min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8", glitch && "anim-glitch")}>
          {children}
        </main>

        <footer className="border-t border-line px-4 py-3 sm:px-6">
          <p className="pixel-sm text-teal/70">PITCHPULSE · EVERY EVENT HAS A STORY · FRONTEND PROTOTYPE · SYNTHETIC DEMO DATA ONLY</p>
        </footer>
      </div>

      {/* mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto border-r border-line bg-surface px-4 py-5">
            <div className="mb-4 flex items-center justify-between">
              <Wordmark />
              <button className="btn btn-quiet !p-1.5" aria-label="Close navigation" onClick={() => setDrawer(false)}>
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" /></svg>
              </button>
            </div>
            <NavLinks onNavigate={() => setDrawer(false)} />
            <p className="mt-6 text-[11px] ink-dim">Clock {CLOCK(clock)} · synthetic demo</p>
          </div>
        </div>
      )}

      {/* mobile bottom nav */}
      <nav aria-label="Quick scenes" className="sticky bottom-0 z-40 flex items-stretch border-t border-line bg-surface/90 backdrop-blur-sm lg:hidden">
        {[
          { to: "/", label: "LIVE" },
          { to: "/tactical", label: "TACTICS" },
          { to: "/studio", label: "STORY" },
          { to: "/recap", label: "RECAP" },
          { to: "/personalise", label: "PREFS" },
        ].map((it) => {
          const active = pathname === it.to;
          return (
            <Link key={it.to} to={it.to} className={cn("flex-1 px-1 py-2.5 text-center no-underline", active && "bg-lime/10")}>
              <span className={cn("pixel-sm block", active ? "text-lime" : "text-teal")}>{it.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
