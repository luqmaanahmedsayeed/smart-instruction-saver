import { createFileRoute } from "@tanstack/react-router";
import { FAVOURITE_CLUBS, FAVOURITE_PLAYERS, LANG_NAMES, PERSONALISATION, personalStory, STORIES, STORY_MOMENTS, type Lang, type ViewMode } from "@/data/match";
import { useApp } from "@/state/store";
import { Hud, SceneHeading, Seg, Tag } from "@/components/ui";

export const Route = createFileRoute("/personalise")({
  head: () => ({
    meta: [
      { title: "PITCHPULSE — 07 Multi-Language & Personalisation" },
      { name: "description", content: "Your match. Your language. Your preferences — one intelligence engine adapting to every fan. Preferences saved locally." },
      { property: "og:title", content: "PITCHPULSE — Language & Personalisation" },
      { property: "og:description", content: "Fan. Analyst. Broadcaster. You." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Scene07,
});

export default function Scene07() {
  const { prefs, setPrefs, resetPrefs, toast } = useApp();
  const moment = STORIES[STORY_MOMENTS[2].id][prefs.viewMode][prefs.lang];

  return (
    <div className="mx-auto max-w-[1500px]">
      <SceneHeading num="07" title="Multi-Language & Personalisation"
        blurb="Your match. Your language. Your preferences. A unique experience for every fan — saved locally in this browser, resettable any time."
        tag="LOCAL · SYNTHETIC DEMO" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        {/* controls */}
        <Hud label="Personalise your experience" meta="SAVES LOCALLY">
          <div className="space-y-5">
            <div>
              <p className="hud-label mb-2">Language</p>
              <Seg ariaLabel="Language" value={prefs.lang} onChange={(v) => setPrefs({ lang: v })}
                options={(["en", "hi", "ta"] as Lang[]).map((l) => ({ id: l, label: LANG_NAMES[l] }))} />
            </div>
            <div>
              <p className="hud-label mb-2">Favourite club</p>
              <div className="flex flex-wrap gap-1.5">
                {FAVOURITE_CLUBS.map((c) => (
                  <button key={c.id} aria-pressed={prefs.club === c.id} onClick={() => setPrefs({ club: c.id })}
                    className={prefs.club === c.id ? "btn btn-primary !py-1.5 text-xs" : "btn btn-outline !py-1.5 text-xs"}>
                    {c.short}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="hud-label mb-2">Favourite player</p>
              <select aria-label="Favourite player" value={prefs.player} onChange={(e) => setPrefs({ player: e.target.value })}
                className="w-full max-w-xs border border-line-strong bg-surface-2 px-2 py-2 text-sm">
                {FAVOURITE_PLAYERS.map((p) => <option key={p.id} value={p.id}>{p.name} — #{p.num} {p.team}</option>)}
              </select>
            </div>
            <div>
              <p className="hud-label mb-2">Focus mode</p>
              <Seg ariaLabel="Focus mode" size="sm" value={prefs.focus} onChange={(v) => setPrefs({ focus: v })}
                options={PERSONALISATION.focusModes.map((f) => ({ id: f.id, label: f.label }))} />
            </div>
            <div>
              <p className="hud-label mb-2">Viewing mode</p>
              <Seg ariaLabel="Viewing mode" size="sm" value={prefs.viewMode}
                onChange={(v) => setPrefs({ viewMode: v })}
                options={[{ id: "fan" as ViewMode, label: "Fan" }, { id: "analyst" as ViewMode, label: "Analyst" }, { id: "broadcast" as ViewMode, label: "Broadcast" }]} />
            </div>
            <div className="flex flex-wrap gap-2 border-t border-line pt-4">
              <button className="btn btn-primary" onClick={() => toast("Preferences saved ✓")}>SAVE PREFERENCES</button>
              <button className="btn btn-outline" onClick={() => { resetPrefs(); toast("Reset to demo defaults ✓"); }}>RESET TO DEMO DEFAULTS</button>
            </div>
          </div>
        </Hud>

        {/* live preview */}
        <div className="flex min-w-0 flex-col gap-4">
          <Hud label={`Your experience — live preview`} meta={`${LANG_NAMES[prefs.lang].toUpperCase()} · ${prefs.viewMode.toUpperCase()}`}>
            <article className="border border-line bg-surface-2/50 p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                <Tag lime>43' MCI 2–0 LIV</Tag>
                <Tag>FOCUS: {PERSONALISATION.focusModes.find((f) => f.id === prefs.focus)?.label.toUpperCase()}</Tag>
              </div>
              <h3 className="display text-2xl">{moment.headline}</h3>
              <p className="mt-2 text-sm ink-dim">{moment.body}</p>
              <div className="mt-3 border-t border-line pt-3">
                <p className="hud-label mb-1">Your personalised takeaway</p>
                <p className="text-sm ink-dim">{personalStory(prefs.lang, FAVOURITE_CLUBS.find((c) => c.id === prefs.club)?.name ?? "", FAVOURITE_PLAYERS.find((p) => p.id === prefs.player)?.name ?? "")}</p>
              </div>
            </article>
            <p className="mt-3 pixel-sm text-teal">SAME DATA · DIFFERENT LANGUAGES · REAL STORIES (SYNTHETIC)</p>
          </Hud>

          <Hud label="How adaptation works" meta="DETERMINISTIC">
            <ul className="space-y-1.5 text-xs ink-dim">
              <li>▸ One synthetic event stream feeds every scene — preferences never change the underlying facts.</li>
              <li>▸ Language switches curated sample narratives (English, हिन्दी, தமிழ்) — no live translation service is connected.</li>
              <li>▸ Viewing mode rewrites the same moment for fan, analyst or broadcast audiences.</li>
              <li>▸ Preferences persist in this browser's local storage only.</li>
            </ul>
          </Hud>
        </div>
      </div>
    </div>
  );
}
