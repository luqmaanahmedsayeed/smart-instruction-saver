import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FIXTURE, PLAYER_MATCH_STATS, personalStory } from "@/data/match";
import { clubName, playerName, useApp } from "@/state/store";
import { Hud, SceneHeading, Seg, Tag } from "@/components/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recap")({
  head: () => ({
    meta: [
      { title: "PITCHPULSE — 04 Match Recap" },
      { name: "description", content: "Full-time recap: key moments, standout players, tactical summary and a personalised story — Manchester City 2–0 Liverpool." },
      { property: "og:title", content: "PITCHPULSE — Match Recap" },
      { property: "og:description", content: "Get the full story — key moments, top performers, tactical takeaways." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Scene04,
});

const TABS = [
  { id: "moments", label: "Key Moments" },
  { id: "players", label: "Standout Players" },
  { id: "tactics", label: "Tactical Summary" },
  { id: "story", label: "Personalised Story" },
] as const;

const MOMENTS = [
  { min: "12'", tag: "GOAL", title: "1–0 — Haaland", sub: "Assist: De Bruyne", lime: true },
  { min: "32'", tag: "CHANCE", title: "Big chance — MCI", sub: "Foden — off target", lime: false },
  { min: "43'", tag: "GOAL", title: "2–0 — Haaland", sub: "Assist: De Bruyne", lime: true },
  { min: "55'", tag: "PRESSURE", title: "Liverpool press wave", sub: "~2 min sustained", lime: false },
  { min: "67'", tag: "CARD", title: "Yellow — Mac Allister", sub: "Stops a City counter", lime: false },
  { min: "82'", tag: "CHANCE", title: "Missed chance — MCI", sub: "Foden drags wide", lime: false },
];

export default function Scene04() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("moments");
  const { prefs } = useApp();

  return (
    <div className="mx-auto max-w-[1500px]">
      <SceneHeading num="04" title="Match Recap"
        blurb="Get the full story — key moments, top performers, tactical takeaways and your personalised summary. More than a score. It's the whole story."
        tag="FULL-TIME · SYNTHETIC DEMO" />

      {/* scoreboard */}
      <div className="hud mb-4 flex flex-wrap items-center gap-x-8 gap-y-3">
        <div className="flex items-center gap-4">
          <span className="hud-label">{FIXTURE.home}</span>
          <span className="display tabular text-5xl text-lime">2–0</span>
          <span className="hud-label">{FIXTURE.away}</span>
        </div>
        <Tag solid>FT · 90:00</Tag>
        <Tag>SYNTHETIC DEMO — NOT A REAL RESULT</Tag>
      </div>

      <Seg options={TABS.map((t) => ({ id: t.id, label: t.label }))} value={tab} onChange={setTab} ariaLabel="Recap sections" />

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {tab === "moments" && (
          <Hud label="Key moments timeline" meta="6 MARKERS">
            <ol className="relative space-y-3 border-l border-line pl-5">
              {MOMENTS.map((m) => (
                <li key={m.min} className="relative">
                  <span className={cn("absolute -left-[26px] top-1.5 h-2.5 w-2.5", m.lime ? "bg-lime" : "bg-teal")} aria-hidden />
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="tabular pixel-sm text-lime">{m.min}</span>
                    <Tag>{m.tag}</Tag>
                    <span className="text-sm font-semibold">{m.title}</span>
                    <span className="text-xs ink-dim">{m.sub}</span>
                  </div>
                </li>
              ))}
            </ol>
          </Hud>
        )}

        {tab === "players" && (
          <Hud label="Player performance" meta="SYNTHETIC">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="border-b border-line text-left">
                    {["Player", "Rating", "Goals", "Shots (OT)", "Key passes", "Dist.", "Pass acc."].map((h) => (
                      <th key={h} className="hud-label py-2 pr-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PLAYER_MATCH_STATS.map((p) => (
                    <tr key={`${p.team}-${p.name}`} className="row-line row-hover">
                      <td className="py-2 pr-3 font-semibold">{p.name} <span className="pixel-sm text-teal">{p.team} #{p.num}</span></td>
                      <td className="tabular py-2 pr-3 font-bold text-lime">{p.rating.toFixed(1)}</td>
                      <td className="tabular py-2 pr-3">{p.goals}</td>
                      <td className="tabular py-2 pr-3">{p.shots} ({p.onTarget})</td>
                      <td className="tabular py-2 pr-3">{p.keyPasses}</td>
                      <td className="tabular py-2 pr-3">{p.distanceKm} km*</td>
                      <td className="tabular py-2 pr-3">{p.passAccuracy}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-[11px] ink-dim">*Distance from synthetic mock tracking samples — not real player tracking.</p>
            </div>
          </Hud>
        )}

        {tab === "tactics" && (
          <Hud label="Tactical summary" meta="EVIDENCE-BASED">
            <p className="text-sm ink-dim">City's high press and quick transitions made the difference. The numbers behind it:</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {[
                ["12", "High recoveries (MCI)"],
                ["31", "Final-third entries (MCI)"],
                ["62%", "Possession share"],
                ["68/100", "Control-vs-chaos (experimental)"],
              ].map(([v, l]) => (
                <li key={l} className="border border-line px-3 py-2">
                  <span className="display tabular block text-2xl text-lime">{v}</span>
                  <span className="hud-label">{l}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 border-l-2 border-lime pl-3 text-xs ink-dim">
              The 12' and 43' goals both started from De Bruyne creations in the right half-space. Liverpool's best phase (55'–57') produced pressure but no box entry within 8 seconds. All indices are experimental demo indicators.
            </p>
          </Hud>
        )}

        {tab === "story" && (
          <Hud label={`Personalised story · ${prefs.lang.toUpperCase()}`} meta="SYNTHETIC">
            <p className="display text-xl">{prefs.lang === "hi" ? "आपकी कहानी" : prefs.lang === "ta" ? "உங்கள் கதை" : "Your story"}</p>
            <p className="mt-2 max-w-xl text-sm ink-dim">{personalStory(prefs.lang, clubName(prefs.club), playerName(prefs.player))}</p>
            <p className="mt-3 pixel-sm text-teal">FAV CLUB: {clubName(prefs.club).toUpperCase()} · FAV PLAYER: {playerName(prefs.player).toUpperCase()}</p>
            <p className="mt-1 text-[11px] ink-dim">Change club & player in Scene 07 — Language & Personalisation.</p>
          </Hud>
        )}

        {/* right rail — always visible */}
        <div className="flex min-w-0 flex-col gap-4">
          <Hud label="Top performer" meta="9.2 RATING">
            <p className="display text-3xl text-lime">ERLING HAALAND</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {[["Goals", "2"], ["Shots (on target)", "4 (3)"], ["Distance*", "8.7 km"], ["Pass accuracy", "78%"]].map(([l, v]) => (
                <li key={l} className="row-line flex justify-between pb-1"><span className="ink-dim">{l}</span><span className="tabular font-semibold">{v}</span></li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] ink-dim">*Mock tracking sample (synthetic).</p>
          </Hud>
          <Hud label="Final thoughts" meta="EDITORIAL">
            <p className="text-sm ink-dim">City's high press and quick transitions made the difference. Haaland's clinical finishing and De Bruyne's creativity once again proved decisive — two goals, two assists, one controlled performance.</p>
            <p className="mt-2 pixel-sm text-teal">EVERY CLAIM LINKED TO THE SYNTHETIC EVENT STREAM</p>
          </Hud>
        </div>
      </div>
    </div>
  );
}
