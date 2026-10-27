import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { buildRecapJson, buildRecapText, LANG_NAMES, personalStory, STORIES, STORY_MOMENTS, type ViewMode } from "@/data/match";
import { clubName, playerName, useApp } from "@/state/store";
import { copyText, downloadJson, Hud, SceneHeading, Seg, Tag } from "@/components/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recap-studio")({
  head: () => ({
    meta: [
      { title: "PITCHPULSE — 08 Full-Time Story / Recap Studio" },
      { name: "description", content: "Assemble the full-time story, choose an output style and export recap text plus a machine-readable JSON package with overlay metadata." },
      { property: "og:title", content: "PITCHPULSE — Full-Time Story Studio" },
      { property: "og:description", content: "More than a score. It's emotion. It's you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Scene08,
});

const SECTIONS = [
  { id: "overview", title: "Match overview" },
  { id: "moments", title: "Defining moments" },
  { id: "tactics", title: "Tactical explanation" },
  { id: "player", title: "Standout player" },
  { id: "takeaway", title: "Personalised takeaway" },
] as const;

const STYLES = [
  { id: "fan", label: "Short fan recap" },
  { id: "analyst", label: "Analyst brief" },
  { id: "broadcast", label: "Broadcast script" },
] as const;

export default function Scene08() {
  const { prefs, setPrefs, toast } = useApp();
  const [momentId, setMomentId] = useState<string>(STORY_MOMENTS[2].id);
  const [style, setStyle] = useState<ViewMode>(prefs.viewMode);

  const moment = STORY_MOMENTS.find((m) => m.id === momentId) ?? STORY_MOMENTS[2];
  const focusStory = STORIES[moment.id][style][prefs.lang];

  const recap = buildRecapText(style, prefs.lang);
  const recapJson = buildRecapJson(style, prefs.lang);

  const doCopyText = async () => {
    const ok = await copyText(recap);
    toast(ok ? "Recap text copied ✓" : "Clipboard blocked in this browser");
  };
  const doExport = () => {
    downloadJson(recapJson, "pitchpulse-recap-package.json");
    toast("Recap JSON package downloaded ✓");
  };

  return (
    <div className="mx-auto max-w-[1500px]">
      <SceneHeading num="08" title="Full-Time Story / Recap Studio"
        blurb="Assemble the full-time story, choose an output style and export it as clean text or a machine-readable package. More than a score — it's emotion, it's you."
        tag="EXPORT · CLIENT-SIDE" />

      <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
        {/* moment sequence + style */}
        <div className="flex min-w-0 flex-col gap-4">
          <Hud label="Moment sequence" meta={`${STORY_MOMENTS.length} MOMENTS`}>
            <ul className="space-y-1">
              {STORY_MOMENTS.map((m) => (
                <li key={m.id}>
                  <button onClick={() => setMomentId(m.id)} aria-pressed={momentId === m.id}
                    className={cn("row-line row-hover flex w-full items-center gap-2 px-1 py-2 text-left", momentId === m.id && "bg-lime/10")}>
                    <span className={cn("tabular pixel-sm w-8 shrink-0", momentId === m.id ? "text-lime" : "text-teal")}>{m.minute}</span>
                    <span className={cn("min-w-0 flex-1 truncate text-xs font-semibold", momentId === m.id && "text-lime")}>{m.title}</span>
                    <span className="pixel-sm shrink-0 text-teal">{m.tag}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Hud>

          <Hud label="Output style" meta="REWRITES PREVIEW">
            <Seg ariaLabel="Output style" size="sm" value={style} onChange={setStyle} options={STYLES.map((s) => ({ id: s.id, label: s.label }))} />
            <div className="mt-3">
              <p className="hud-label mb-2">Language</p>
              <Seg ariaLabel="Language" size="sm" value={prefs.lang}
                onChange={(v) => setPrefs({ lang: v })}
                options={[{ id: "en" as const, label: "EN" }, { id: "hi" as const, label: "हिन्दी" }, { id: "ta" as const, label: "தமிழ்" }]} />
            </div>
          </Hud>

          <Hud label="Exports" meta="NO BACKEND">
            <div className="flex flex-col gap-2">
              <button className="btn btn-primary" onClick={doCopyText}>⧉ COPY RECAP TEXT</button>
              <button className="btn btn-outline" onClick={() => { navigator.clipboard && copyText(JSON.stringify(recapJson, null, 2)).then((ok) => toast(ok ? "JSON copied ✓" : "Clipboard blocked")); }}>
                ⧉ COPY JSON PACKAGE
              </button>
              <button className="btn btn-outline" onClick={doExport}>↓ DOWNLOAD RECAP PACKAGE (JSON)</button>
            </div>
          </Hud>
        </div>

        {/* story assembly */}
        <div className="flex min-w-0 flex-col gap-4">
          <Hud label={`Story assembly · ${LANG_NAMES[prefs.lang]}`} meta={moment.tag}>
            <div className="grid gap-3 md:grid-cols-2">
              {SECTIONS.map((s) => (
                <section key={s.id} className="border border-line px-3 py-2.5">
                  <p className="hud-label mb-1">{s.title}</p>
                  {s.id === "overview" && <p className="text-xs ink-dim">Full time, 90:00 — Manchester City 2–0 Liverpool. Synthetic demo fixture; both goals from Haaland, both created by De Bruyne.</p>}
                  {s.id === "moments" && <p className="text-xs ink-dim">{moment.minute} {moment.title} — see evidence {moment.eventId}. Timeline: 12' goal, 32' big chance, 43' goal, 55' press wave, 67' card.</p>}
                  {s.id === "tactics" && <p className="text-xs ink-dim">62% possession, 12 high recoveries, 31 final-third entries. Control-vs-chaos index 68/100 (experimental demo indicator).</p>}
                  {s.id === "player" && <p className="text-xs ink-dim">Haaland — 9.2 demo rating, 2 goals from 4 shots (3 on target), 8.7 km from mock tracking samples.</p>}
                  {s.id === "takeaway" && (
                    <p className="text-xs ink-dim">
                      {personalStory(prefs.lang, clubName(prefs.club), playerName(prefs.player))}
                      {momentId !== STORY_MOMENTS[2].id && <> · Current moment focus: <span className="text-lime">{focusStory.headline}</span></>}
                    </p>
                  )}
                </section>
              ))}
            </div>
          </Hud>

          <Hud label={`Preview — ${STYLES.find((s) => s.id === style)!.label}`} meta="BROADCAST PACKAGE">
            <div className="border border-line bg-surface-2/50 p-4">
              <div className="mb-2 flex items-center justify-between border-b border-line pb-2">
                <span className="pixel-sm text-teal">PITCHPULSE · FT PACKAGE</span>
                <Tag solid>SYNTHETIC DEMO</Tag>
              </div>
              <p className="display text-2xl">MAN CITY 2–0 LIVERPOOL</p>
              <pre className="mt-3 max-h-64 overflow-auto no-scrollbar whitespace-pre-wrap border border-line bg-surface/60 p-3 text-xs leading-relaxed" tabIndex={0}>{recap}</pre>
            </div>
          </Hud>
        </div>
      </div>
    </div>
  );
}
