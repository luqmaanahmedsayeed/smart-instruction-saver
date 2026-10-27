import { createFileRoute } from "@tanstack/react-router";
import { PIPELINE, TECH_STACK } from "@/data/match";
import { Hud, SceneHeading, Tag } from "@/components/ui";

export const Route = createFileRoute("/stack")({
  head: () => ({
    meta: [
      { title: "PITCHPULSE — 05 Technology Stack" },
      { name: "description", content: "The planned PITCHPULSE pipeline and Microsoft technology architecture — presented as an engineering data sheet. Frontend demo only." },
      { property: "og:title", content: "PITCHPULSE — Microsoft Technology Stack" },
      { property: "og:description", content: "Same data. More possibilities. Planned architecture — no live connections." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Scene05,
});

function TechGlyph({ kind }: { kind: string }) {
  // thin-line geometric glyphs — no brand logos reproduced
  const glyphs: Record<string, string> = {
    git: "M4 12l8-8 8 8-8 8z", copilot: "M4 8h16v10H4z M8 8v10 M16 8v10",
    foundry: "M12 3l9 9-9 9-9-9z", translator: "M4 6h10 M9 3v3 M6 6c1 4 4 7 8 9 M12 20l5-10 5 10 M13.5 16h7",
    sql: "M6 4h12v16H6z M9 9h6 M9 13h6", swa: "M12 3a9 9 0 1 0 9 9 M12 7a5 5 0 1 0 5 5",
    fabric: "M4 4l16 8-16 8z", students: "M12 4l8 4-8 4-8-4z M4 12v4c0 2 4 4 8 4s8-2 8-4v-4",
  };
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden className="shrink-0 text-lime">
      <path d={glyphs[kind] ?? glyphs.git} fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export default function Scene05() {
  return (
    <div className="mx-auto max-w-[1500px]">
      <SceneHeading num="05" title="Microsoft Technology Stack"
        blurb="The right tools, at the right place. Build, analyse, translate and deploy — all planned on Microsoft. This is an architecture data sheet: no integrations are connected."
        tag="PLANNED ARCHITECTURE" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* pipeline */}
        <Hud label="Data pipeline map" meta="6 STAGES">
          <ol className="relative space-y-0">
            {PIPELINE.map((s, i) => (
              <li key={s.id} className="relative flex gap-4 pb-4 last:pb-0">
                <div className="relative flex flex-col items-center">
                  <span className="display tabular text-xl text-lime">{String(s.id).padStart(2, "0")}</span>
                  {i < PIPELINE.length - 1 && <span className="mt-1 w-px flex-1 bg-line-strong" aria-hidden />}
                </div>
                <div className="min-w-0 flex-1 border border-line px-3 py-2">
                  <p className="text-sm font-semibold">{s.title}</p>
                  <p className="text-xs ink-dim">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
            <svg width="60" height="14" aria-hidden><path d="M0 7h50 M50 7l-4-3v6z" stroke="var(--pp-teal)" fill="var(--pp-teal)" /></svg>
            <span className="pixel-sm text-teal">SYNTHETIC DEMO EVENTS IN → OVERLAY + RECAP JSON OUT</span>
          </div>
        </Hud>

        {/* tiles */}
        <div className="flex min-w-0 flex-col gap-4">
          <Hud label="System tiles" meta="8 TOOLS">
            <div className="grid gap-2 sm:grid-cols-2">
              {TECH_STACK.map((t) => (
                <div key={t.name} className="flex items-start gap-3 border border-line px-3 py-2.5">
                  <TechGlyph kind={t.glyph} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs ink-dim">{t.role}</p>
                    <span className="chip mt-1.5 inline-flex">{t.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </Hud>

          <Hud label="Honesty panel" meta="REQUIRED LABELS">
            <ul className="space-y-1.5 text-xs ink-dim">
              <li>▸ This build is a <span className="text-lime">frontend prototype</span>. No cloud services, APIs, databases or AI inference are connected.</li>
              <li>▸ All match data is <span className="text-lime">synthetic demo data</span> generated in this document's dataset.</li>
              <li>▸ Microsoft technologies are shown as <span className="text-lime">planned / recommended architecture</span>, labelled per tile.</li>
              <li>▸ Narratives are authored, evidence-grounded templates — labelled as sample output, not live AI generation.</li>
            </ul>
          </Hud>
        </div>
      </div>
    </div>
  );
}
