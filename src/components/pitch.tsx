import { PLAYERS, type Player, type Team } from "@/data/match";
import { cn } from "@/lib/utils";

/* ---------- SVG football pitch: shared by live view, tactical view and mini-pitch ---------- */

function PitchLines({ hud }: { hud?: boolean }) {
  return (
    <g stroke="currentColor" fill="none" strokeWidth={hud ? 0.35 : 0.45}>
      <rect x={2} y={4} width={96} height={92} />
      <line x1={50} y1={4} x2={50} y2={96} strokeDasharray="1.5 1.5" />
      <circle cx={50} cy={50} r={9} />
      <circle cx={50} cy={50} r={0.8} fill="currentColor" />
      <rect x={2} y={32} width={12} height={36} />
      <rect x={86} y={32} width={12} height={36} />
      <rect x={2} y={42} width={5} height={16} />
      <rect x={93} y={42} width={5} height={16} />
      {/* calibration ticks along bottom */}
      <g opacity={0.5} strokeWidth={0.25}>
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={2 + i * 12} y1={96} x2={2 + i * 12} y2={97.5} />
        ))}
      </g>
    </g>
  );
}

function Marker({ p, tracked, dim }: { p: Player; tracked?: boolean; dim?: boolean }) {
  const isTracked = tracked && p.num === tracked;
  const color = p.team === "MCI" ? "var(--pp-teal)" : "#F5F6FA";
  return (
    <g transform={`translate(${p.x} ${p.y})`} className={cn(dim && "opacity-50")}>
      {isTracked && (
        <g>
          <rect x={-3.4} y={-3.4} width={6.8} height={6.8} fill="none" stroke="var(--pp-lime)" strokeWidth={0.5} className="anim-lockon" />
          <rect x={-4.4} y={-4.4} width={1.6} height={1.6} fill="var(--pp-lime)" />
          <rect x={2.8} y={-4.4} width={1.6} height={1.6} fill="var(--pp-lime)" />
          <rect x={-4.4} y={2.8} width={1.6} height={1.6} fill="var(--pp-lime)" />
          <rect x={2.8} y={2.8} width={1.6} height={1.6} fill="var(--pp-lime)" />
          <text x={0} y={-5.6} textAnchor="middle" fill="var(--pp-lime)" fontSize={2.6} fontFamily="var(--font-pixel)">#{p.num}</text>
        </g>
      )}
      <circle r={1.9} fill={p.team === "MCI" ? "rgb(137 201 201 / 90%)" : "rgb(245 246 250 / 85%)"} stroke="#012420" strokeWidth={0.4} />
      <text y={4.6} textAnchor="middle" fill={color} fontSize={2.2} fontFamily="var(--font-sans)" fontWeight={600}>{p.num}</text>
    </g>
  );
}

export function Pitch({
  trackedNum,
  ball,
  passLines,
  heat,
  mini,
  className,
  label,
}: {
  trackedNum?: number;
  ball?: { x: number; y: number };
  passLines?: { x1: number; y1: number; x2: number; y2: number; team: Team }[];
  heat?: { x: number; y: number; r: number; i: number }[];
  mini?: boolean;
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      {label && <span className="pixel-sm absolute left-2 top-2 z-10 text-teal">{label}</span>}
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="block h-full w-full text-teal/50" role="img" aria-label="Synthetic demo football pitch">
        {/* pitch surface + subtle mow stripes */}
        <rect x={0} y={0} width={100} height={100} fill="rgb(3 52 42 / 55%)" />
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={2 + i * 12} y={4} width={6} height={92} fill="rgb(137 201 201 / 4%)" />
        ))}
        <PitchLines hud={mini} />
        {heat?.map((h, i) => (
          <circle key={i} cx={h.x} cy={h.y} r={h.r} fill="var(--pp-lime)" opacity={0.05 + h.i * 0.10} />
        ))}
        {passLines?.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.team === "MCI" ? "var(--pp-teal)" : "rgb(245 246 250 / 55%)"} strokeWidth={0.35} strokeDasharray="2 1.4" opacity={0.75} />
        ))}
        {PLAYERS.map((p) => <Marker key={`${p.team}-${p.num}`} p={p} tracked={trackedNum} />)}
        {ball && (
          <g transform={`translate(${ball.x} ${ball.y})`}>
            <circle r={2.6} fill="none" stroke="var(--pp-lime)" strokeWidth={0.3} opacity={0.6} className="anim-pulse" />
            <circle r={1.1} fill="var(--pp-lime)" />
          </g>
        )}
        {/* scanline sweep */}
        {!mini && (
          <rect x={-12} y={0} width={8} height={100} fill="rgb(217 253 145 / 5%)" className="anim-scan" />
        )}
        <text x={98} y={98} textAnchor="end" fill="currentColor" fontSize={1.8} opacity={0.7} fontFamily="var(--font-sans)">GRID 10m · SYNTHETIC DEMO</text>
      </svg>
    </div>
  );
}

/* ---------- mini pitch used in event detail ---------- */
export function MiniPitch({ highlight }: { highlight?: { x?: number; y?: number } }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full text-teal/50" role="img" aria-label="Mini pitch with selected event highlighted">
      <PitchLines hud />
      {highlight?.x != null && (
        <g transform={`translate(${highlight.x} ${highlight.y ?? 50})`}>
          <rect x={-4} y={-4} width={8} height={8} fill="none" stroke="var(--pp-lime)" strokeWidth={0.5} className="anim-pulse" />
          <line x1={0} y1={-4} x2={0} y2={-7} stroke="var(--pp-lime)" strokeWidth={0.35} />
          <line x1={-4} y1={0} x2={-7} y2={0} stroke="var(--pp-lime)" strokeWidth={0.35} />
          <circle r={1} fill="var(--pp-lime)" />
        </g>
      )}
    </svg>
  );
}
