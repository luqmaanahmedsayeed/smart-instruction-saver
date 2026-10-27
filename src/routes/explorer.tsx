import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CLOCK, EVENTS, MINUTE, type EventType, type Team } from "@/data/match";
import { MiniPitch } from "@/components/pitch";
import { Hud, SceneHeading, Seg, Tag } from "@/components/ui";
import { useApp } from "@/state/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/explorer")({
  head: () => ({
    meta: [
      { title: "PITCHPULSE — 06 Event Explorer & Replay Console" },
      { name: "description", content: "Forensic event log: filter the full synthetic event stream, replay any moment and inspect machine-readable event payloads." },
      { property: "og:title", content: "PITCHPULSE — Event Explorer" },
      { property: "og:description", content: "Replay. Filter. Inspect. Every synthetic event, one console." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Scene06,
});

const EVENT_TYPES: EventType[] = ["goal", "shot", "pass", "tackle", "interception", "recovery", "pressure", "possession", "corner", "yellow", "offside"];

export default function Scene06() {
  const { scrub, toast } = useApp();
  const [team, setTeam] = useState<"all" | Team>("all");
  const [type, setType] = useState<"all" | EventType>("all");
  const [player, setPlayer] = useState("all");
  const [range, setRange] = useState<[number, number]>([0, 90]);
  const [selectedId, setSelectedId] = useState<string>("EV-0123");

  const players = useMemo(() => {
    const set = new Map<string, string>();
    EVENTS.forEach((e) => { if (e.player) set.set(e.player, e.player); });
    return [...set.values()].sort();
  }, []);

  const rows = useMemo(() => EVENTS.filter((e) =>
    (team === "all" || e.team === team) &&
    (type === "all" || e.type === type) &&
    (player === "all" || e.player === player) &&
    e.sec >= range[0] * 60 && e.sec <= range[1] * 60
  ), [team, type, player, range]);

  const selected = EVENTS.find((e) => e.id === selectedId) ?? rows[0] ?? EVENTS[0];

  const payload = {
    schema: "pitchpulse.event.v1",
    dataset: "SYNTHETIC_DEMO",
    id: selected.id,
    gameClock: CLOCK(selected.sec),
    minute: MINUTE(selected.sec),
    type: selected.type,
    team: selected.team ?? null,
    player: selected.player ?? null,
    playerNumber: selected.playerNum ?? null,
    label: selected.label,
    description: selected.detail,
    outcome: selected.outcome ?? null,
    location: selected.x != null ? { x: selected.x, y: selected.y } : null,
  };

  const clearFilters = () => {
    setTeam("all"); setType("all"); setPlayer("all"); setRange([0, 90]);
    toast("Filters reset ✓");
  };

  return (
    <div className="mx-auto max-w-[1500px]">
      <SceneHeading num="06" title="Event Explorer / Replay Console"
        blurb="A forensic view of the full synthetic event stream. Filter, replay and inspect every recorded action — select a row to jump the timeline and highlight the location."
        tag="SYNTHETIC EVENT LOG" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* table */}
        <Hud label={`Event log · ${rows.length}/${EVENTS.length}`} meta="FILTERED">
          <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-line pb-3">
            <Seg ariaLabel="Team filter" size="sm" value={team} onChange={setTeam}
              options={[{ id: "all" as const, label: "All" }, { id: "MCI" as const, label: "MCI" }, { id: "LIV" as const, label: "LIV" }]} />
            <select aria-label="Event type" value={type} onChange={(e) => setType(e.target.value as EventType | "all")}
              className="border border-line-strong bg-surface-2 px-2 py-1.5 text-xs font-semibold">
              <option value="all">All types</option>
              {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select aria-label="Player filter" value={player} onChange={(e) => setPlayer(e.target.value)}
              className="border border-line-strong bg-surface-2 px-2 py-1.5 text-xs font-semibold">
              <option value="all">All players</option>
              {players.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <label className="flex items-center gap-1.5 text-xs ink-dim">
              Min
              <input type="number" min={0} max={90} value={range[0]} onChange={(e) => setRange([Number(e.target.value), range[1]])}
                className="tabular w-14 border border-line-strong bg-surface-2 px-1.5 py-1.5" aria-label="Minute range start" />
            </label>
            <label className="flex items-center gap-1.5 text-xs ink-dim">
              Max
              <input type="number" min={0} max={90} value={range[1]} onChange={(e) => setRange([range[0], Number(e.target.value)])}
                className="tabular w-14 border border-line-strong bg-surface-2 px-1.5 py-1.5" aria-label="Minute range end" />
            </label>
            <button className="btn btn-outline !py-1.5 text-xs" onClick={clearFilters}>✕ CLEAR</button>
          </div>

          <div className="max-h-[430px] overflow-auto no-scrollbar">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="sticky top-0 bg-surface">
                <tr className="border-b border-line">
                  {["Clock", "Type", "Team", "Player", "Event", "Outcome"].map((h) => (
                    <th key={h} className="hud-label py-2 pr-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => (
                  <tr key={e.id} onClick={() => { setSelectedId(e.id); scrub(e.sec); }}
                    className={cn("row-line row-hover cursor-pointer", selectedId === e.id && "bg-lime/10")}>
                    <td className="tabular py-1.5 pr-3 font-semibold text-lime">{CLOCK(e.sec)}</td>
                    <td className="pr-3 uppercase"><span className={cn("pixel-sm", e.type === "goal" && "text-lime", e.type !== "goal" && "text-teal")}>{e.type}</span></td>
                    <td className="pr-3 text-xs font-semibold text-teal">{e.team ?? "—"}</td>
                    <td className="min-w-0 max-w-[160px] truncate pr-3 text-xs">{e.player ? `${e.player} #${e.playerNum}` : "—"}</td>
                    <td className="min-w-0 max-w-[220px] truncate pr-3 text-xs" title={e.detail}>{e.label}</td>
                    <td className="pr-3 text-xs ink-dim">{e.outcome ?? "—"}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-sm ink-dim">No events match these filters. Clear filters to reset.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* replay controls */}
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
            <button className="btn btn-primary !py-1.5 text-xs" onClick={() => { scrub(selected.sec); toast(`Timeline moved to ${CLOCK(selected.sec)} ✓`); }}>
              ⏮ REPLAY FROM {CLOCK(selected.sec)}
            </button>
            <Tag solid>SEE SCENE 01 FOR LIVE PLAYBACK</Tag>
          </div>
        </Hud>

        {/* detail pane */}
        <div className="flex min-w-0 flex-col gap-4">
          <Hud label="Selected event" meta={selected.id}>
            <div className="grid gap-3 sm:grid-cols-[110px_minmax(0,1fr)]">
              <div className="aspect-square border border-line bg-surface-2/50">
                <MiniPitch highlight={{ x: selected.x, y: selected.y }} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag lime>{CLOCK(selected.sec)}</Tag>
                  <Tag>{selected.type.toUpperCase()}</Tag>
                  {selected.team && <Tag>{selected.team}</Tag>}
                </div>
                <p className="mt-2 text-sm font-semibold">{selected.label}</p>
                <p className="mt-1 text-xs ink-dim">{selected.detail}</p>
                {selected.outcome && <p className="mt-2 pixel-sm text-teal">OUTCOME: {selected.outcome.toUpperCase()}</p>}
              </div>
            </div>
          </Hud>

          <Hud label="Event payload inspector" meta="pitchpulse.event.v1">
            <pre className="max-h-72 overflow-auto no-scrollbar border border-line bg-surface-2/60 p-3 text-[11px] leading-relaxed text-teal" tabIndex={0}>
              {JSON.stringify(payload, null, 2)}
            </pre>
          </Hud>
        </div>
      </div>
    </div>
  );
}
