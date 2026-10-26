import { useState, type ReactNode } from "react";
import { useApp } from "@/state/store";
import { cn } from "@/lib/utils";

/* ---------- HUD panel with corner brackets + label strip ---------- */
export function Hud({ label, meta, className, children, bodyClass }: { label?: string; meta?: ReactNode; className?: string; children: ReactNode; bodyClass?: string }) {
  return (
    <section className={cn("hud flex flex-col", className)}>
      {label && (
        <header className="mb-3 flex items-center justify-between gap-2 border-b border-line pb-2">
          <span className="hud-label">{label}</span>
          {meta && <span className="pixel-sm text-lime">{meta}</span>}
        </header>
      )}
      <div className={cn("min-w-0 flex-1", bodyClass)}>{children}</div>
    </section>
  );
}

/* ---------- pixel tag ---------- */
export function Tag({ children, lime, solid, className }: { children: ReactNode; lime?: boolean; solid?: boolean; className?: string }) {
  return <span className={cn("chip", lime && "chip-lime", solid && "chip-solid", className)}>{children}</span>;
}

/* ---------- meter row ---------- */
export function MeterRow({ label, value, display, lime, dim }: { label: string; value: number; display?: string; lime?: boolean; dim?: string }) {
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="hud-label">{label}</span>
        <span className={cn("tabular text-sm font-semibold", lime ? "text-lime" : "text-foreground")}>{display ?? value}</span>
      </div>
      <div className="meter">
        <div className={cn(lime ? "meter-fill-lime" : "meter-fill", "meter-step")} style={{ width: `${Math.max(2, Math.min(100, value))}%` }} />
      </div>
      {dim && <p className="mt-1 text-xs ink-dim">{dim}</p>}
    </div>
  );
}

/* ---------- segmented control ---------- */
export function Seg<T extends string>({ options, value, onChange, ariaLabel, size = "md" }: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
  size?: "sm" | "md";
}) {
  return (
    <div className="seg" role="group" aria-label={ariaLabel}>
      {options.map((o) => (
        <button key={o.id} aria-pressed={value === o.id} onClick={() => onChange(o.id)}
          className={cn("seg-btn", size === "sm" && "px-2 py-1 text-[11px]")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- evidence disclosure ---------- */
export function Evidence({ ids }: { ids: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button className="btn btn-quiet !px-0 !py-1 text-xs" onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? "▾" : "▸"} Evidence ({ids.length})
      </button>
      {open && (
        <ul className="mt-1 space-y-1 border-l border-line pl-3">
          {ids.map((id) => <li key={id} className="pixel-sm text-teal">{id}</li>)}
        </ul>
      )}
    </div>
  );
}

/* ---------- clipboard / download helpers ---------- */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ---------- toast stack (reads app state) ---------- */
export function Toasts() {
  const { toasts } = useApp();
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="hud flex items-center gap-2 !py-2 !px-3">
          <span className="h-2 w-2 shrink-0 bg-lime" aria-hidden />
          <span className="text-xs font-semibold">{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- scene heading ---------- */
export function SceneHeading({ num, title, blurb, tag }: { num: string; title: string; blurb: string; tag?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-end gap-x-5 gap-y-2 border-b border-line pb-4">
      <span className="display text-5xl text-lime sm:text-6xl" aria-hidden>{num}</span>
      <div className="min-w-0 flex-1">
        <h1 className="display text-2xl uppercase sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-xl text-sm ink-dim">{blurb}</p>
      </div>
      {tag && <Tag solid className="shrink-0">{tag}</Tag>}
    </div>
  );
}
