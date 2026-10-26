import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CLOCK, EVENTS, FIXTURE, FULL_TIME, eventsUpTo, scoreAt, statsAt, goals, PATTERNS } from "@/data/match";
import { useApp } from "@/state/store";
import { Pitch } from "@/components/pitch";
import { Hud, MeterRow, Tag } from "@/components/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PITCHPULSE — 01 Live Match Command Centre" },
      { name: "description", content: "Real-time simulated pitch, event feed, match stats and playback controls over a synthetic demo fixture: Manchester City 2–0 Liverpool." },
      { property: "og:title", content: "PITCHPULSE — Live Match Command Centre" },
      { property: "og:description", content: "Simulated football intelligence control room — synthetic demo fixture, live event feed and playback." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Scene01,
});

const TYPE_GLYPH: Record<string, string> = {
  goal: "◉", shot: "▲", save: "▣", pass: "→", tackle: "✕", interception: "⌀",
  recovery: "↺", pressure: "≋", possession: "⇄", corner: "∟", yellow: "▮", offside: "⌐",
};

function ballPos(clock: number) {
  const t = clock / 60;
  return { x: 50 + 26 * Math.sin(t / 4.2), y: 50 + 22 * Math.cos(t / 5.6) };
}

function Scene01() {
  const { clock, playing, speed, togglePlay, restart, setSpeed, scrub } = useApp();
  const [showPasses, setShowPasses] = useState(true);
  const [showHeat, setShowHeat] = useState(false);
  const [tracked, setTracked] = useState<number>(10);

  const s = scoreAt(clock);
  const stats = statsAt(clock);
  const feed = useMemo(() => eventsUpTo(clock).slice().reverse(), [clock]);
  const latestGoal = goals.filter((g) => g.sec <= clock).at(-1);
  const pattern = PATTERNS[clock < 1400 ? 0 : clock < 2800 ? 4 : 1];

  const passLines = useMemo(() => {
    if (!showPasses) return [];
    return EVENTS.filter((e) => e.type === "pass" && e.sec <= clock && e.x != null).slice(-6)
      .map((e) => ({ x1: e.x!, y1: e.y!, x2: e.x2 ?? e.x! + 4, y2: e.y2 ?? e.y! - 3, team: e.team! }));
  }, [clock, showPasses]);

  const pct = (clock / FULL_TIME) * 100;

  return (
    <div className="mx-auto max-w-[1500px]">
      {/* scoreboard bar */}
      <div className="hud mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 !py-3">
        <div className="flex items-center gap-3">
          <span className="display text-xl">{FIXTURE.home}</span>
          <span className="display tabular text-3xl text-lime">{s.mci}–{s.liv}</span>
          <span className="display text-xl">{FIXTURE.away}</span>
        </div>
        <span className="tabular pixel text-lime">{CLOCK(clock)}</span>
        <Tag solid>{playing ? "● LIVE PLAYBACK" : "❚❚ PAUSED"}</Tag>
        <Tag>SYNTHETIC DEMO — NOT A LIVE FIXTURE</Tag>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* pitch */}
        <Hud label="Pitch · tracking overlay" meta={`TRACK #${tracked}`} className="min-h-[420px]" bodyClass="relative flex">
          <Pitch
            className="min-h-[380px] flex-1"
            trackedNum={tracked}
            ball={ballPos(clock)}
            passLines={passLines}
            heat={showHeat ? [{ x: 72, y: 50, r: 16, i: 1 }, { x: 60, y: 40, r: 11, i: 0.6 }, { x: 30, y: 60, r: 10, i: 0.5 }] : undefined}
          />
          <div className="absolute bottom-2 right-2 flex flex-col gap-1">
            <button className={cn("chip cursor-pointer", showHeat && "chip-lime")} onClick={() => setShowHeat(!showHeat)} aria-pressed={showHeat}>PRESSURE HEAT</button>
            <button className={cn("chip cursor-pointer", showPasses && "chip-lime")} onClick={() => setShowPasses(!showPasses)} aria-pressed={showPasses}>PASS LINES</button>
          </div>
          <div className="absolute left-2 bottom-2 flex flex-col gap-1">
            {[[9, "HAA"], [10, "KDB"], [11, "FOD"], [16, "ROD"]].map(([n, t]) => (
              <button key={n} onClick={() => setTracked(n as number)} aria-pressed={tracked === n}
                className={cn("chip cursor-pointer", tracked === n && "chip-lime")}>{`#${n} ${t}`}</button>
            ))}
          </div>
        </Hud>

        {/* right rail */}
        <div className="flex min-w-0 flex-col gap-4">
          <Hud label="Match stats" meta={`@ ${CLOCK(clock)}`}>
            <div className="space-y-3">
              <div className="flex justify-between gap-3">
                <span className="text-sm font-semibold text-teal">MCI {stats.MCI.possession}%</span>
                <span className="hud-label">Possession</span>
                <span className="text-sm font-semibold">{stats.LIV.possession}% LIV</span>
              </div>
              <div className="meter"><div className="meter-fill-lime meter-step" style={{ width: `${stats.MCI.possession}%` }} /></div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {[
                  ["Shots", stats.MCI.shots, stats.LIV.shots],
                  ["On target", stats.MCI.onTarget, stats.LIV.onTarget],
                  ["Pass acc.", `${stats.MCI.passAccuracy}%`, `${stats.LIV.passAccuracy}%`],
                  ["Corners", stats.MCI.corners, stats.LIV.corners],
                ].map(([label, a, b]) => (
                  <div key={label as string} className="min-w-0">
                    <div className="flex justify-between text-sm">
                      <span className="tabular font-semibold text-teal">{a as number}</span>
                      <span className="hud-label">{label as string}</span>
                      <span className="tabular font-semibold">{b as number}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Hud>

          <Hud label="Event feed" meta={`${feed.length} EVENTS`} className="max-h-[340px]" bodyClass="overflow-y-auto no-scrollbar">
            <ol className="space-y-0">
              {feed.slice(0, 14).map((e) => (
                <li key={e.id} className="row-line row-hover flex items-center gap-2.5 py-1.5">
                  <span className="tabular pixel-sm w-8 shrink-0 text-lime">{CLOCK(e.sec).slice(0, 5)}</span>
                  <span className="w-4 shrink-0 text-center text-teal" aria-hidden>{TYPE_GLYPH[e.type]}</span>
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold" title={e.detail}>{e.label}</span>
                  <span className="pixel-sm shrink-0 text-teal">{e.team ?? "—"}</span>
                </li>
              ))}
            </ol>
          </Hud>

          <Hud label="Latest insight" meta="EXPERIMENTAL">
            <p className="text-sm font-semibold text-lime">{pattern.title}</p>
            <p className="mt-1 text-xs ink-dim">{pattern.summary}</p>
            <p className="mt-2 pixel-sm text-teal">WINDOW {pattern.window}</p>
          </Hud>
        </div>
      </div>

      {/* control deck */}
      <Hud label="Playback control deck" className="mt-4">
        <div className="flex flex-wrap items-center gap-3">
          <button className={cn("btn", playing ? "btn-outline" : "btn-primary")} onClick={togglePlay} aria-label={playing ? "Pause playback" : "Play playback"}>
            {playing ? "❚❚ PAUSE" : "▶ PLAY"}
          </button>
          <button className="btn btn-outline" onClick={restart} aria-label="Restart playback">↺ RESTART</button>
          <div className="seg" role="group" aria-label="Playback speed">
            {([1, 2, 4] as const).map((sp) => (
              <button key={sp} className="seg-btn" aria-pressed={speed === sp} onClick={() => setSpeed(sp)}>{sp}×</button>
            ))}
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="tabular pixel-sm shrink-0 text-teal">00:00</span>
            <input
              type="range"
              min={0}
              max={FULL_TIME}
              step={1}
              value={Math.round(clock)}
              onChange={(e) => scrub(Number(e.target.value))}
              className="h-2 min-w-0 flex-1 cursor-pointer appearance-none bg-teal/15 accent-[#d9fd91]"
              aria-label="Scrub match timeline"
            />
            <span className="tabular pixel-sm shrink-0 text-teal">90:00</span>
          </div>
        </div>
        {/* timeline with event markers */}
        <div className="relative mt-3 h-6" aria-hidden>
          <div className="absolute inset-x-0 top-1/2 h-px bg-line-strong" />
          {EVENTS.filter((e) => ["goal", "shot", "yellow", "corner"].includes(e.type)).map((e) => (
            <button key={e.id} onClick={() => scrub(e.sec)} className="absolute -translate-x-1/2 cursor-pointer" style={{ left: `${(e.sec / FULL_TIME) * 100}%`, top: 0 }} title={`${CLOCK(e.sec)} ${e.label}`}>
              <span className={cn("block h-3 w-[3px]", e.type === "goal" ? "bg-lime" : e.type === "yellow" ? "bg-teal" : "bg-teal/60")} />
            </button>
          ))}
          <div className="absolute top-1/2 h-2 w-2 -translate-y-1/2 -translate-x-1/2 bg-lime" style={{ left: `${pct}%` }} />
          {latestGoal && <span className="absolute right-0 -top-1 pixel-sm text-lime">LAST GOAL {latestGoal.minute ?? CLOCK(latestGoal.sec)}</span>}
        </div>
      </Hud>
    </div>
  );
}
