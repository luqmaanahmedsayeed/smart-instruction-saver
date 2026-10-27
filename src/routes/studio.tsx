import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { EVENTS, LANG_NAMES, STORIES, STORY_MOMENTS, buildOverlayJson, type Lang, type StoryMoment, type ViewMode } from "@/data/match";
import { useApp } from "@/state/store";
import { copyText, downloadJson, Hud, SceneHeading, Seg, Tag } from "@/components/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "PITCHPULSE — 03 Story & Overlay Studio" },
      { name: "description", content: "Turn one synthetic moment into fan, analyst and broadcast stories — in English, हिन्दी and தமிழ் — with copyable overlay JSON." },
      { property: "og:title", content: "PITCHPULSE — Story & Overlay Studio" },
      { property: "og:description", content: "Different fans. Different stories. Same game." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Scene03,
});

export default function Scene03() {
  const { prefs, setPrefs, strings, toast } = useApp();
  const [momentId, setMomentId] = useState<StoryMoment["id"]>("goal-43");
  const moment = STORY_MOMENTS.find((m) => m.id === momentId)!;
  const story = STORIES[momentId][prefs.viewMode][prefs.lang];
  const ev = EVENTS.find((e) => e.id === moment.eventId);

  const overlay = buildOverlayJson(moment, prefs.viewMode, prefs.lang);

  const doCopy = async () => {
    const ok = await copyText(JSON.stringify(overlay, null, 2));
    toast(ok ? `${strings.copied} ✓` : "Clipboard blocked in this browser");
  };
  const doDownload = () => {
    downloadJson(overlay, `pitchpulse-overlay-${moment.id}.json`);
    toast(`${strings.downloaded} ✓`);
  };

  return (
    <div className="mx-auto max-w-[1500px]">
      <SceneHeading num="03" title="Story & Overlay Studio"
        blurb="Turn match events into clear stories, tactical visuals and broadcast-ready graphics — in your preferred language and mode. Different fans. Different stories. Same game."
        tag="SYNTHETIC DEMO" />

      <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
        {/* left: controls */}
        <div className="flex min-w-0 flex-col gap-4">
          <Hud label="Choose moment" meta="1 / 5">
            <ul className="space-y-1">
              {STORY_MOMENTS.map((m) => (
                <li key={m.id}>
                  <button onClick={() => setMomentId(m.id)} aria-pressed={momentId === m.id}
                    className={cn("row-line row-hover flex w-full items-center gap-2 px-1 py-2 text-left", momentId === m.id && "bg-lime/10")}>
                    <span className={cn("tabular pixel-sm w-8 shrink-0", momentId === m.id ? "text-lime" : "text-teal")}>{m.minute}</span>
                    <span className={cn("min-w-0 flex-1 text-xs font-semibold", momentId === m.id && "text-lime")}>{m.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Hud>

          <Hud label="Mode & language">
            <div className="space-y-3">
              <div>
                <p className="hud-label mb-1.5">{strings.mode}</p>
                <Seg ariaLabel="Viewing mode" size="sm" value={prefs.viewMode}
                  onChange={(v) => setPrefs({ viewMode: v })}
                  options={[{ id: "fan", label: strings.fan }, { id: "analyst", label: strings.analyst }, { id: "broadcast", label: strings.broadcast }]} />
              </div>
              <div>
                <p className="hud-label mb-1.5">{strings.language}</p>
                <Seg ariaLabel="Language" size="sm" value={prefs.lang}
                  onChange={(v) => setPrefs({ lang: v })}
                  options={(["en", "hi", "ta"] as Lang[]).map((l) => ({ id: l, label: LANG_NAMES[l] }))} />
              </div>
            </div>
          </Hud>
        </div>

        {/* centre: story card */}
        <div className="flex min-w-0 flex-col gap-4">
          <Hud label={`${strings.story} · ${LANG_NAMES[prefs.lang]}`} meta={moment.tag}>
            <article>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Tag lime>{moment.tag}</Tag>
                <Tag>{moment.minute} · MCI 2–0 LIV</Tag>
                <Tag>{prefs.viewMode.toUpperCase()}</Tag>
              </div>
              <h2 className="display text-2xl sm:text-3xl">{story.headline}</h2>
              <p className="mt-2 max-w-2xl text-sm ink-dim">{story.body}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {ev?.player && <Tag solid>{ev.player.toUpperCase()} #{ev.playerNum}</Tag>}
                {ev && <Tag>{ev.id}</Tag>}
                <span className="pixel-sm text-teal">GROUNDED IN SYNTHETIC EVENT STREAM</span>
              </div>
            </article>
          </Hud>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* broadcast overlay preview */}
            <Hud label={strings.overlay} meta="LOWER-THIRD">
              <div className="relative border border-line bg-surface-2 p-4">
                <div className="absolute inset-0 pointer-events-none scanlines-bg opacity-60" aria-hidden />
                <div className="relative flex items-stretch">
                  <div className="flex items-center bg-lime px-3 py-2">
                    <span className="pixel text-[#012420]">{moment.minute} {overlay.overlay.headline.toUpperCase().slice(0, 18)}</span>
                  </div>
                  <div className="min-w-0 flex-1 border border-line border-l-0 px-3 py-2">
                    <p className="pixel-sm truncate text-foreground">{overlay.overlay.headline}</p>
                    <p className="pixel-sm mt-1 truncate text-teal">{overlay.overlay.subline}</p>
                  </div>
                </div>
                <p className="mt-2 pixel-sm text-teal">DURATION {overlay.overlay.duration_sec}s · {LANG_NAMES[prefs.lang].toUpperCase()}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="btn btn-primary" onClick={doCopy}>{strings.copyJson}</button>
                <button className="btn btn-outline" onClick={doDownload}>{strings.downloadJson}</button>
              </div>
            </Hud>

            {/* JSON inspector */}
            <Hud label="Overlay JSON" meta="pitchpulse.overlay.v1">
              <pre className="max-h-56 overflow-auto no-scrollbar border border-line bg-surface-2/60 p-3 text-[11px] leading-relaxed text-teal" tabIndex={0}>
                {JSON.stringify(overlay, null, 2)}
              </pre>
            </Hud>
          </div>
        </div>
      </div>
    </div>
  );
}
