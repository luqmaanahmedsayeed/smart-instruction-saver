import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CLOCK, EVENTS, PATTERNS, TACTICAL, statsAt } from "@/data/match";
import { Pitch } from "@/components/pitch";
import { Evidence, Hud, MeterRow, SceneHeading, Seg, Tag } from "@/components/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tactical")({
  head: () => ({
    meta: [
      { title: "PITCHPULSE — 02 Tactical Intelligence" },
      { name: "description", content: "Heatmap, passing network, tactical metrics and detected patterns with evidence — all from the synthetic demo event stream." },
      { property: "og:title", content: "PITCHPULSE — Tactical Intelligence" },
      { property: "og:description", content: "Visualise patterns, track performance and understand the game beyond the numbers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Scene02,
});

const VIEWS = [
  { id: "heat", label: "Heatmap" },
  { id: "network", label: "Pass network" },
  { id: "pressure", label: "Pressure map" },
] as const;

export default function Scene02() {
  const [view, setView] = useState<(typeof VIEWS)[number]["id"]>("heat");
  const [patternId, setPatternId] = useState(PATTERNS[0].id);
  const pattern = PATTERNS.find((p) => p.id === patternId)!;

  const heat = useMemo(() => [
    { x: 74, y: 50, r: 15, i: 1 }, { x: 62, y: 42, r: 11, i: 0.8 }, { x: 66, y: 66, r: 10, i: 0.7 },
    { x: 50, y: 52, r: 12, i: 0.55 }, { x: 38, y: 36, r: 9, i: 0.45 }, { x: 30, y: 62, r: 8, i: 0.35 },
    { x: 84, y: 44, r: 7, i: 0.6 }, { x: 26, y: 26, r: 6, i: 0.25 },
  ], []);

  const network = useMemo(() => {
    const mci = EVENTS.filter((e) => e.type === "pass" && e.team === "MCI" && e.x != null).slice(-8);
    return mci.map((e) => ({ x1: e.x!, y1: e.y!, x2: e.x2 ?? e.x! + 3, y2: e.y2 ?? e.y! - 2, team: "MCI" as const }));
  }, []);

  const pressure = useMemo(() => {
    const ups = EVENTS.filter((e) => e.type === "pressure" && e.x != null);
    return ups.map((e) => ({ x: e.x!, y: e.y!, r: 8, i: 0.8 }));
  }, []);

  const stats = statsAt(67 * 60 + 42);

  return (
    <div className="mx-auto max-w-[1500px]">
      <SceneHeading num="02" title="Tactical Intelligence"
        blurb="Visualise patterns, track performance and understand the game beyond the numbers. All indices are experimental demo indicators — not official metrics."
        tag="SYNTHETIC DEMO" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* left: pitch visual */}
        <Hud label="Visual workspace" meta={VIEWS.find((v) => v.id === view)!.label.toUpperCase()}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <Seg options={VIEWS.map((v) => ({ id: v.id, label: v.label }))} value={view} onChange={setView} ariaLabel="Tactical view" />
            <span className="pixel-sm text-teal">WINDOW 0'–67'</span>
          </div>
          <Pitch
            className="aspect-[4/3] max-h-[520px] w-full"
            heat={view === "heat" ? heat : view === "pressure" ? pressure : undefined}
            passLines={view === "network" ? network : undefined}
            trackedNum={view === "network" ? 10 : undefined}
          />
          <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-line pt-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-teal" aria-hidden /> MCI presence</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-foreground/70" aria-hidden /> LIV presence</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-lime" aria-hidden /> High intensity (demo)</span>
            <span className="pixel-sm ml-auto text-teal">GRID 10m · SYNTHETIC</span>
          </div>
        </Hud>

        {/* right column */}
        <div className="flex min-w-0 flex-col gap-4">
          <Hud label="Tactical metrics" meta="EXPERIMENTAL DEMO INDICATORS">
            <div className="grid gap-4 sm:grid-cols-2">
              <MeterRow label={`Pressure index MCI`} value={TACTICAL.pressureIndex.mci} display={`${TACTICAL.pressureIndex.mci}/100`} lime />
              <MeterRow label={`Pressure index LIV`} value={TACTICAL.pressureIndex.liv} display={`${TACTICAL.pressureIndex.liv}/100`} />
              <MeterRow label={`Momentum ${TACTICAL.momentum.window}`} value={70} display={`+${TACTICAL.momentum.value} → ${TACTICAL.momentum.side}`} lime />
              <MeterRow label="Control vs chaos" value={TACTICAL.controlVsChaos.value} display={`${TACTICAL.controlVsChaos.value}/100`} dim={TACTICAL.controlVsChaos.note} />
              <MeterRow label="Final-third entries" value={(TACTICAL.finalThirdEntries.mci / 40) * 100} display={`${TACTICAL.finalThirdEntries.mci} vs ${TACTICAL.finalThirdEntries.liv}`} />
              <MeterRow label="Turnover rate" value={TACTICAL.turnoverRate.mci * 7} display={`${TACTICAL.turnoverRate.mci} vs ${TACTICAL.turnoverRate.liv}/100p`} />
            </div>
          </Hud>

          <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <Hud label="Team snapshot" meta={`@ 67:42`}>
              <ul className="space-y-1.5 text-sm">
                <li className="flex justify-between"><span className="ink-dim">Possession</span><span className="tabular font-semibold text-teal">62% – 38%</span></li>
                <li className="flex justify-between"><span className="ink-dim">Shots</span><span className="tabular font-semibold">{stats.MCI.shots} – {stats.LIV.shots}</span></li>
                <li className="flex justify-between"><span className="ink-dim">Pass accuracy</span><span className="tabular font-semibold">{stats.MCI.passAccuracy}% – {stats.LIV.passAccuracy}%</span></li>
                <li className="flex justify-between"><span className="ink-dim">High recoveries</span><span className="tabular font-semibold text-teal">12 – 5</span></li>
              </ul>
            </Hud>

            <Hud label="Recent events feeding metrics" meta="EV LINKS">
              <ul className="space-y-1">
                {EVENTS.filter((e) => e.sec > 3300 && e.x != null).slice(0, 4).map((e) => (
                  <li key={e.id} className="row-line flex items-center gap-2 pb-1 text-xs">
                    <span className="tabular pixel-sm text-lime">{CLOCK(e.sec)}</span>
                    <span className="min-w-0 flex-1 truncate ink-dim">{e.label}</span>
                    <span className="pixel-sm text-teal">{e.id}</span>
                  </li>
                ))}
              </ul>
            </Hud>
          </div>

          <Hud label="Patterns detected" meta={`${PATTERNS.length} ACTIVE`}>
            <div className="flex flex-wrap gap-1.5">
              {PATTERNS.map((p) => (
                <button key={p.id} onClick={() => setPatternId(p.id)} aria-pressed={patternId === p.id}
                  className={cn("chip cursor-pointer", patternId === p.id && "chip-lime")}>{p.title}</button>
              ))}
            </div>
            <div className="mt-3 border-l-2 border-lime pl-3">
              <p className="text-sm font-semibold text-lime">{pattern.title}</p>
              <p className="pixel-sm mt-0.5 text-teal">{pattern.window}</p>
              <p className="mt-1.5 text-xs ink-dim">{pattern.summary}</p>
              <ul className="mt-2 grid gap-1 sm:grid-cols-3">
                {pattern.measures.map((m) => (
                  <li key={m.label} className="border border-line px-2 py-1.5">
                    <span className="hud-label block">{m.label}</span>
                    <span className="tabular text-sm font-semibold">{m.value}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex items-center gap-3">
                <Evidence ids={pattern.evidence} />
                <Tag>EXPERIMENTAL DEMO</Tag>
              </div>
            </div>
          </Hud>
        </div>
      </div>
    </div>
  );
}
