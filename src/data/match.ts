/* =========================================================================
   PITCHPULSE — central synthetic match dataset.
   Single source of truth for all eight scenes. SYNTHETIC DEMO data only.
   ========================================================================= */

export type Team = "MCI" | "LIV";
export type EventType =
  | "goal" | "shot" | "save" | "pass" | "tackle" | "interception"
  | "recovery" | "pressure" | "possession" | "corner" | "yellow" | "offside";

export interface Player {
  num: number;
  name: string;
  team: Team;
  pos: "GK" | "DEF" | "MID" | "FWD";
  x: number; // 0-100 pitch coords, attack left→right for MCI
  y: number;
}

export interface MatchEvent {
  id: string;
  sec: number;
  type: EventType;
  team?: Team;
  player?: string;
  playerNum?: number;
  label: string;
  detail: string;
  outcome?: string;
  x?: number;
  y?: number;
  x2?: number;
  y2?: number;
}

export const FIXTURE = {
  home: "Manchester City",
  homeShort: "MCI",
  away: "Liverpool",
  awayShort: "LIV",
  competition: "Synthetic Demo League",
  venue: "Demo Arena (simulated)",
  label: "SYNTHETIC DEMO",
};

export const LIVE_CLOCK = 67 * 60 + 42; // 67:42
export const FULL_TIME = 90 * 60; // 90:00

/* ---------------- players on the pitch (synthetic) ---------------- */
export const PLAYERS: Player[] = [
  // MCI (attack → right)
  { num: 31, name: "Ederson", team: "MCI", pos: "GK", x: 6, y: 50 },
  { num: 2, name: "Walker", team: "MCI", pos: "DEF", x: 22, y: 22 },
  { num: 3, name: "Rúben Dias", team: "MCI", pos: "DEF", x: 18, y: 50 },
  { num: 5, name: "Stones", team: "MCI", pos: "DEF", x: 22, y: 78 },
  { num: 16, name: "Rodri", team: "MCI", pos: "MID", x: 38, y: 50 },
  { num: 8, name: "Gündoğan", team: "MCI", pos: "MID", x: 52, y: 30 },
  { num: 10, name: "De Bruyne", team: "MCI", pos: "MID", x: 58, y: 66 },
  { num: 7, name: "Grealish", team: "MCI", pos: "MID", x: 62, y: 16 },
  { num: 11, name: "Foden", team: "MCI", pos: "MID", x: 70, y: 80 },
  { num: 9, name: "Haaland", team: "MCI", pos: "FWD", x: 76, y: 50 },
  { num: 19, name: "Álvarez", team: "MCI", pos: "FWD", x: 70, y: 34 },
  // LIV (attack → left)
  { num: 1, name: "Alisson", team: "LIV", pos: "GK", x: 94, y: 50 },
  { num: 4, name: "van Dijk", team: "LIV", pos: "DEF", x: 82, y: 46 },
  { num: 6, name: "Konaté", team: "LIV", pos: "DEF", x: 82, y: 62 },
  { num: 26, name: "Robertson", team: "LIV", pos: "DEF", x: 78, y: 22 },
  { num: 66, name: "Alexander-Arnold", team: "LIV", pos: "DEF", x: 78, y: 80 },
  { num: 3, name: "Fabinho", team: "LIV", pos: "MID", x: 66, y: 48 },
  { num: 10, name: "Mac Allister", team: "LIV", pos: "MID", x: 58, y: 60 },
  { num: 8, name: "Szoboszlai", team: "LIV", pos: "MID", x: 56, y: 36 },
  { num: 11, name: "Salah", team: "LIV", pos: "FWD", x: 38, y: 78 },
  { num: 9, name: "Núñez", team: "LIV", pos: "FWD", x: 34, y: 46 },
  { num: 7, name: "Díaz", team: "LIV", pos: "FWD", x: 40, y: 20 },
];

export const FAVOURITE_CLUBS = [
  { id: "MCI", name: "Manchester City", short: "MCI" },
  { id: "LIV", name: "Liverpool", short: "LIV" },
  { id: "ARS", name: "Arsenal", short: "ARS" },
  { id: "MUN", name: "Manchester United", short: "MUN" },
];

export const FAVOURITE_PLAYERS = [
  { id: "haaland", num: 9, name: "Erling Haaland", team: "MCI" as Team },
  { id: "kdb", num: 10, name: "Kevin De Bruyne", team: "MCI" as Team },
  { id: "foden", num: 11, name: "Phil Foden", team: "MCI" as Team },
  { id: "salah", num: 11, name: "Mohamed Salah", team: "LIV" as Team },
  { id: "macallister", num: 10, name: "Alexis Mac Allister", team: "LIV" as Team },
  { id: "nunez", num: 9, name: "Darwin Núñez", team: "LIV" as Team },
];

/* ---------------- event stream 0' → 90' ---------------- */
const m = (min: number, extra = 0) => min * 60 + extra;

export const EVENTS: MatchEvent[] = [
  { id: "EV-0007", sec: m(4), type: "pass", team: "MCI", player: "Rodri", playerNum: 16, label: "Build-up pass", detail: "Rodri switches play to Walker on the right.", outcome: "Completed", x: 38, y: 50, x2: 24, y: 24 },
  { id: "EV-0012", sec: m(6, 30), type: "pressure", team: "MCI", player: "Gündoğan", playerNum: 8, label: "High press wins throw-in", detail: "Gündoğan presses Alisson's clearance; City regain in Liverpool's half.", outcome: "Regained", x: 84, y: 40 },
  { id: "EV-0021", sec: m(9), type: "tackle", team: "LIV", player: "Fabinho", playerNum: 3, label: "Tackle on Grealish", detail: "Fabinho halts a City dribble through the left channel.", outcome: "Won", x: 56, y: 24 },
  { id: "EV-0030", sec: m(12, -6), type: "pass", team: "MCI", player: "De Bruyne", playerNum: 10, label: "Assist pass — cutback", detail: "De Bruyne drives and cuts back from the right byline.", outcome: "Key pass", x: 88, y: 62, x2: 76, y: 52 },
  { id: "EV-0031", sec: m(12), type: "goal", team: "MCI", player: "Haaland", playerNum: 9, label: "GOAL — Haaland", detail: "Haaland converts the cutback first-time from 10 yards. 1–0.", outcome: "1–0 MCI", x: 76, y: 52 },
  { id: "EV-0040", sec: m(15, 20), type: "possession", team: "LIV", player: "Szoboszlai", playerNum: 8, label: "Possession change", detail: "Szoboszlai intercepts a loose second ball; Liverpool settle.", outcome: "LIV ball", x: 60, y: 40 },
  { id: "EV-0047", sec: m(18), type: "shot", team: "LIV", player: "Salah", playerNum: 11, label: "Shot — Salah", detail: "Salah cuts in from the right and shoots near-post.", outcome: "Saved", x: 30, y: 76, x2: 8, y: 48 },
  { id: "EV-0052", sec: m(19, 40), type: "save", team: "MCI", player: "Ederson", playerNum: 31, label: "Save — Ederson", detail: "Ederson parries the near-post effort behind for a corner.", outcome: "Corner", x: 8, y: 48 },
  { id: "EV-0058", sec: m(21), type: "corner", team: "LIV", player: "Alexander-Arnold", playerNum: 66, label: "Corner — LIV", detail: "Trent delivers an outswinger; Dias heads clear.", outcome: "Cleared", x: 4, y: 22 },
  { id: "EV-0066", sec: m(24, 10), type: "interception", team: "MCI", player: "Stones", playerNum: 5, label: "Interception — Stones", detail: "Stones cuts out a disguised through-ball.", outcome: "MCI ball", x: 30, y: 70 },
  { id: "EV-0073", sec: m(27, 30), type: "recovery", team: "MCI", player: "Rodri", playerNum: 16, label: "High recovery", detail: "Rodri recovers high after press; City keep Liverpool pinned.", outcome: "MCI ball", x: 68, y: 44 },
  { id: "EV-0081", sec: m(30, 45), type: "pass", team: "MCI", player: "Grealish", playerNum: 7, label: "Progressive carry + pass", detail: "Grealish carries 20m and feeds Foden between the lines.", outcome: "Completed", x: 56, y: 18, x2: 68, y: 74 },
  { id: "EV-0090", sec: m(32, 20), type: "shot", team: "MCI", player: "Foden", playerNum: 11, label: "Big chance — Foden", detail: "Foden bends one from the edge of the box.", outcome: "Off target", x: 66, y: 78, x2: 94, y: 56 },
  { id: "EV-0098", sec: m(34), type: "pressure", team: "MCI", player: "Álvarez", playerNum: 19, label: "Press forces long ball", detail: "Álvarez forces van Dijk into a hurried clearance.", outcome: "Regained", x: 80, y: 46 },
  { id: "EV-0105", sec: m(36, 15), type: "tackle", team: "LIV", player: "Mac Allister", playerNum: 10, label: "Tackle on De Bruyne", detail: "Mac Allister nips in ahead of KDB on the halfway line.", outcome: "Won", x: 50, y: 58 },
  { id: "EV-0113", sec: m(38, 50), type: "possession", team: "MCI", player: "Dias", playerNum: 3, label: "Possession change", detail: "Dias steps in and City restart the cycle.", outcome: "MCI ball", x: 22, y: 50 },
  { id: "EV-0121", sec: m(41, 20), type: "pass", team: "MCI", player: "De Bruyne", playerNum: 10, label: "Assist pass — through ball", detail: "KDB slides a through-ball into Haaland's channel.", outcome: "Key pass", x: 62, y: 60, x2: 74, y: 50 },
  { id: "EV-0122", sec: m(42, 10), type: "shot", team: "MCI", player: "Haaland", playerNum: 9, label: "Shot — Haaland", detail: "Haaland's first attempt is blocked by Konaté.", outcome: "Blocked", x: 74, y: 50, x2: 94, y: 50 },
  { id: "EV-0123", sec: m(43), type: "goal", team: "MCI", player: "Haaland", playerNum: 9, label: "GOAL — Haaland", detail: "Haaland reacts first to the rebound and rolls it in. 2–0.", outcome: "2–0 MCI", x: 76, y: 52 },
  { id: "EV-0131", sec: m(45, 30), type: "offside", team: "LIV", player: "Núñez", playerNum: 9, label: "Offside — Núñez", detail: "Núñez strays offside chasing a long ball.", outcome: "Flag", x: 20, y: 44 },
  { id: "EV-0138", sec: m(48), type: "pass", team: "LIV", player: "Salah", playerNum: 11, label: "Switch of play", detail: "Salah switches to Robertson overlapping on the left.", outcome: "Completed", x: 36, y: 74, x2: 20, y: 24 },
  { id: "EV-0146", sec: m(51, 40), type: "pressure", team: "LIV", player: "Szoboszlai", playerNum: 8, label: "Liverpool press wave", detail: "Liverpool press high for two minutes; City go long three times.", outcome: "Pressure", x: 46, y: 50 },
  { id: "EV-0153", sec: m(54), type: "interception", team: "LIV", player: "Konaté", playerNum: 6, label: "Interception — Konaté", detail: "Konaté reads a cross-field pass and steps out.", outcome: "LIV ball", x: 76, y: 60 },
  { id: "EV-0160", sec: m(56, 20), type: "shot", team: "LIV", player: "Díaz", playerNum: 7, label: "Shot — Díaz", detail: "Díaz drills one through a crowd of legs.", outcome: "Saved", x: 34, y: 24, x2: 8, y: 52 },
  { id: "EV-0168", sec: m(58, 45), type: "corner", team: "MCI", player: "De Bruyne", playerNum: 10, label: "Corner — MCI", detail: "KDB corners are cleared to the edge of the box.", outcome: "Cleared", x: 96, y: 20 },
  { id: "EV-0175", sec: m(61, 10), type: "recovery", team: "MCI", player: "Walker", playerNum: 2, label: "High recovery — Walker", detail: "Walker burns back to recover ahead of Díaz.", outcome: "MCI ball", x: 30, y: 18 },
  { id: "EV-0182", sec: m(63, 30), type: "pass", team: "MCI", player: "Haaland", playerNum: 9, label: "Link pass", detail: "Haaland drops in, holds off Konaté and lays it to KDB.", outcome: "Completed", x: 66, y: 54, x2: 58, y: 62 },
  { id: "EV-0190", sec: m(65, 45), type: "pressure", team: "MCI", player: "Gündoğan", playerNum: 8, label: "Counter-press triggers", detail: "Gündoğan triggers the counter-press; City win it back in 6s.", outcome: "Regained", x: 58, y: 48 },
  { id: "EV-0197", sec: m(67, 5), type: "tackle", team: "MCI", player: "Rodri", playerNum: 16, label: "Tackle on Salah", detail: "Rodri times a challenge on Salah as he turns inside.", outcome: "Won", x: 40, y: 70 },
  { id: "EV-0198", sec: m(67, 20), type: "yellow", team: "LIV", player: "Mac Allister", playerNum: 10, label: "Yellow card — Mac Allister", detail: "Mac Allister fouls KDB cynically to stop the counter.", outcome: "Booked", x: 52, y: 60 },
  { id: "EV-0205", sec: m(69, 30), type: "pass", team: "MCI", player: "Foden", playerNum: 11, label: "Wall pass with KDB", detail: "One-two between Foden and KDB breaks the first line.", outcome: "Completed", x: 64, y: 68, x2: 70, y: 58 },
  { id: "EV-0213", sec: m(72), type: "shot", team: "MCI", player: "De Bruyne", playerNum: 10, label: "Shot — De Bruyne", detail: "KDB lashes the half-cleared corner from 18 yards.", outcome: "Over the bar", x: 68, y: 58, x2: 94, y: 44 },
  { id: "EV-0221", sec: m(74, 50), type: "possession", team: "LIV", player: "Alisson", playerNum: 1, label: "Possession change", detail: "Alisson starts a low block build-up.", outcome: "LIV ball", x: 92, y: 50 },
  { id: "EV-0230", sec: m(77, 15), type: "interception", team: "MCI", player: "Stones", playerNum: 5, label: "Interception — Stones", detail: "Stones jumps a forward pass aimed at Núñez.", outcome: "MCI ball", x: 34, y: 62 },
  { id: "EV-0238", sec: m(79, 40), type: "pressure", team: "MCI", player: "Haaland", playerNum: 9, label: "Press on Alisson", detail: "Haaland chases Alisson's touch; Liverpool go backwards.", outcome: "Pressure", x: 86, y: 50 },
  { id: "EV-0246", sec: m(82, 20), type: "shot", team: "MCI", player: "Foden", playerNum: 11, label: "Missed chance — Foden", detail: "Foden drags a finish wide after a driving run.", outcome: "Off target", x: 72, y: 66, x2: 94, y: 54 },
  { id: "EV-0254", sec: m(84), type: "recovery", team: "LIV", player: "van Dijk", playerNum: 4, label: "Recovery — van Dijk", detail: "van Dijk sweeps behind Konaté to kill a Haaland dart.", outcome: "LIV ball", x: 78, y: 52 },
  { id: "EV-0262", sec: m(86, 30), type: "shot", team: "LIV", player: "Núñez", playerNum: 9, label: "Shot — Núñez", detail: "Núñez snatches at a falling ball in the box.", outcome: "Off target", x: 30, y: 48, x2: 6, y: 46 },
  { id: "EV-0270", sec: m(88, 50), type: "pass", team: "MCI", player: "Rodri", playerNum: 16, label: "Game management", detail: "Rodri trades safe passes as City close out the game.", outcome: "Completed", x: 40, y: 50, x2: 30, y: 44 },
  { id: "EV-0278", sec: m(90, 40), type: "possession", team: "MCI", player: "Ederson", playerNum: 31, label: "Full-time possession", detail: "Ederson takes the last touch. Full time: 2–0.", outcome: "FT 2–0", x: 8, y: 50 },
];

/* ---------------- derived facts ---------------- */
export const scoreAt = (sec: number) => {
  let mci = 0, liv = 0;
  for (const e of EVENTS) if (e.type === "goal" && e.sec <= sec) e.team === "MCI" ? mci++ : liv++;
  return { mci, liv };
};

export const eventsUpTo = (sec: number) => EVENTS.filter((e) => e.sec <= sec);
export const eventsAfter = (sec: number) => EVENTS.filter((e) => e.sec > sec);

export const goals = EVENTS.filter((e) => e.type === "goal");

export const MINUTE = (sec: number) => `${Math.min(90, Math.floor(sec / 60))}'`;
export const CLOCK = (sec: number) => {
  const s = Math.max(0, Math.min(FULL_TIME, Math.floor(sec)));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

/* ---------------- team stats (derived from synthetic state) ---------------- */
export interface TeamStats {
  possession: number; shots: number; onTarget: number; passAccuracy: number;
  corners: number; highRecoveries: number; finalThird: number; turnovers: number;
}

const countStats = (sec: number): Record<Team, TeamStats> => {
  const up = eventsUpTo(sec);
  const base: Record<Team, TeamStats> = {
    MCI: { possession: 62, shots: 0, onTarget: 0, passAccuracy: 92, corners: 0, highRecoveries: 0, finalThird: 0, turnovers: 0 },
    LIV: { possession: 38, shots: 0, onTarget: 0, passAccuracy: 84, corners: 0, highRecoveries: 0, finalThird: 0, turnovers: 0 },
  };
  for (const e of up) {
    if (!e.team) continue;
    if (e.type === "shot") base[e.team].shots++;
    if (e.type === "shot" && (e.outcome === "Saved" || e.type === "goal")) base[e.team].onTarget++;
    if (e.type === "goal") base[e.team].onTarget++;
    if (e.type === "corner") base[e.team].corners++;
    if (e.type === "recovery" || e.type === "pressure" && e.outcome === "Regained") base[e.team].highRecoveries++;
    if ((e.x ?? 0) > 62 && e.team === "MCI") base[e.team].finalThird++;
    if ((e.x ?? 100) < 38 && e.team === "LIV") base[e.team].finalThird++;
  }
  return base;
};

/* Demo tracking samples (synthetic GPS-style samples, not real tracking) */
export const TRACKING_SAMPLES = {
  note: "SYNTHETIC DEMO — mock GPS-style tracking samples",
  haaland: { kmh: 34.1, distanceKm: 8.7, sprints: 14, sampleRate: "10 Hz (simulated)" },
  kdb: { kmh: 27.3, distanceKm: 8.1, sprints: 6, sampleRate: "10 Hz (simulated)" },
  salah: { kmh: 33.0, distanceKm: 8.3, sprints: 12, sampleRate: "10 Hz (simulated)" },
  foden: { kmh: 30.4, distanceKm: 8.9, sprints: 11, sampleRate: "10 Hz (simulated)" },
};

export const statsAt = (sec: number) => countStats(sec);

export const PLAYER_MATCH_STATS = [
  { num: 9, name: "Erling Haaland", team: "MCI" as Team, rating: 9.2, goals: 2, shots: 4, onTarget: 3, keyPasses: 1, distanceKm: 8.7, passAccuracy: 78 },
  { num: 10, name: "Kevin De Bruyne", team: "MCI" as Team, rating: 8.6, goals: 0, shots: 1, onTarget: 0, keyPasses: 5, distanceKm: 8.1, passAccuracy: 88 },
  { num: 11, name: "Phil Foden", team: "MCI" as Team, rating: 8.1, goals: 0, shots: 3, onTarget: 1, keyPasses: 2, distanceKm: 8.9, passAccuracy: 90 },
  { num: 16, name: "Rodri", team: "MCI" as Team, rating: 7.9, goals: 0, shots: 0, onTarget: 0, keyPasses: 1, distanceKm: 9.4, passAccuracy: 94 },
  { num: 11, name: "Mohamed Salah", team: "LIV" as Team, rating: 7.4, goals: 0, shots: 3, onTarget: 1, keyPasses: 2, distanceKm: 8.3, passAccuracy: 81 },
  { num: 10, name: "Alexis Mac Allister", team: "LIV" as Team, rating: 6.8, goals: 0, shots: 0, onTarget: 0, keyPasses: 1, distanceKm: 9.0, passAccuracy: 86 },
] as const;

/* ---------------- tactical metrics (experimental demo indicators) ---------------- */
export const TACTICAL = {
  pressureIndex: { mci: 72, liv: 54, scale: 100 },
  momentum: { value: 3.2, window: "55'–67'", side: "MCI" as Team },
  controlVsChaos: { value: 68, scale: 100, note: "0 = chaos, 100 = full control" },
  finalThirdEntries: { mci: 31, liv: 18 },
  turnoverRate: { mci: 9.1, liv: 12.8, unit: "per 100 passes" },
};

export interface Pattern {
  id: string;
  title: string;
  window: string;
  summary: string;
  measures: { label: string; value: string }[];
  evidence: string[];
}

export const PATTERNS: Pattern[] = [
  {
    id: "high-press", title: "High-press success", window: "6'–27' · recurring",
    summary: "City's front line forced Liverpool into rushed clearances three times inside 90 seconds, regaining possession in the opponent's half.",
    measures: [ { label: "High recoveries", value: "12" }, { label: "Avg regain zone", value: "Opp. half, 71m line" }, { label: "Time to regain", value: "6.4s (demo)" } ],
    evidence: ["EV-0012", "EV-0073", "EV-0190"],
  },
  {
    id: "control-chaos", title: "Control vs chaos", window: "0'–67'",
    summary: "City hold a 62% possession share with a low turnover rate, keeping the game in a controlled state even during Liverpool's press wave.",
    measures: [ { label: "Possession", value: "62% vs 38%" }, { label: "Turnover rate", value: "9.1 vs 12.8 /100 passes" }, { label: "Index", value: "68/100 (experimental)" } ],
    evidence: ["EV-0113", "EV-0146", "EV-0221"],
  },
  {
    id: "momentum", title: "Momentum shift", window: "55'–67'",
    summary: "After Liverpool's two-minute press wave, a Walker recovery and a Rodri tackle flipped momentum back toward City ahead of the KDB chance at 72'.",
    measures: [ { label: "Momentum", value: "+3.2 → MCI" }, { label: "Press duration", value: "~2 min" }, { label: "Turnovers during wave", value: "3" } ],
    evidence: ["EV-0146", "EV-0175", "EV-0197"],
  },
  {
    id: "rhythm", title: "Game rhythm", window: "Full match",
    summary: "The match alternates in two-minute cycles: City control phases around 24 passes/minute, Liverpool's bursts reach 31 but rarely end in the box.",
    measures: [ { label: "City passes/min", value: "24" }, { label: "LIV burst rate", value: "31/min" }, { label: "LIV box entries", value: "6" } ],
    evidence: ["EV-0040", "EV-0131", "EV-0160"],
  },
  {
    id: "player-impact", title: "Player impact / milestones", window: "12', 43'",
    summary: "Haaland's two goals from 1.6 xG-equivalent chances (demo index) and KDB's two assists define the scoreline — the pair combined on both.",
    measures: [ { label: "Haaland shots", value: "4 (3 on target)" }, { label: "KDB key passes", value: "5" }, { label: "Goal assists (KDB)", value: "2" } ],
    evidence: ["EV-0030", "EV-0031", "EV-0121", "EV-0123"],
  },
];

/* ---------------- story moments ---------------- */
export interface StoryMoment { id: string; minute: string; title: string; eventId: string; tag: string; }
export const STORY_MOMENTS: StoryMoment[] = [
  { id: "goal-12", minute: "12'", title: "Haaland opens the scoring", eventId: "EV-0031", tag: "GOAL" },
  { id: "big-32", minute: "32'", title: "Foden's big chance", eventId: "EV-0090", tag: "BIG CHANCE" },
  { id: "goal-43", minute: "43'", title: "Haaland strikes again", eventId: "EV-0123", tag: "GOAL" },
  { id: "press-55", minute: "55'", title: "Liverpool's press wave", eventId: "EV-0146", tag: "PRESSURE" },
  { id: "yellow-67", minute: "67'", title: "Mac Allister booked", eventId: "EV-0198", tag: "CARD" },
];

export type ViewMode = "fan" | "analyst" | "broadcast";
export type Lang = "en" | "hi" | "ta";

interface StoryText { headline: string; body: string; }

const STORIES: Record<string, Record<ViewMode, Record<Lang, StoryText>>> = {
  "goal-43": {
    fan: {
      en: { headline: "Haaland strikes again!", body: "The Norwegian forward shows his class once more, finishing with precision after a brilliant through ball. His movement and timing continue to be unstoppable — 2–0 City." },
      hi: { headline: "हालैंड ने फिर दिखाया कमाल!", body: "शानदार थ्रू-बॉल के बाद हालैंड ने बेहतरीन फिनिशिंग से दूसरा गोल किया। उनकी मूवमेंट और टाइमिंग किसी से कम नहीं — सिटी 2–0 से आगे।" },
      ta: { headline: "ஹாலண்ட் மீண்டும் மீண்டும்!", body: "அற்புதமான துரு-பாலுக்குப் பிறகு ஹாலண்ட் துல்லியமான முடித்துவைப்புடன் இரண்டாவது கோல். 2–0 என சிட்டி முன்னிலையில்." },
    },
    analyst: {
      en: { headline: "43' — Haaland doubles the lead", body: "De Bruyne's through ball (EV-0121) released Haaland into the left half-space; the first attempt was blocked by Konaté (EV-0122) and Haaland reacted first to the rebound. Expected-shot value 0.54 (demo index); both goals came from KDB creations." },
      hi: { headline: "43' — हालैंड की दूसरी बारी", body: "डी ब्रुयने की थ्रू-बॉल (EV-0121) के बाद पहला शॉट कोनाते ने रोका (EV-022), रिबाउंड पर हालैंड सबसे तेज़। दोनों गोल KDB की प्लेस बनाए गए।" },
      ta: { headline: "43' — ஹாலண்டின் இரண்டாவது கோல்", body: "டி ப்ரூய்னேயின் துரு-பால் (EV-0121) ஹாலண்டுக்கு வழி திறந்தது; முதல் ஷாட் கொனாத்தால் தடுக்கப்பட்டு ரீபவுண்டில் கோல். இரண்டு கோல்களும் KDB படைப்பு." },
    },
    broadcast: {
      en: { headline: "43' | HAALAND — 2–0", body: "Haaland converts from the rebound after Konaté blocks the first attempt. Assist: De Bruyne. Overlay duration 6s." },
      hi: { headline: "43' | हालैंड — 2–0", body: "रिबाउंड से गोल। असिस्ट: डी ब्रुयने। ओवरले अवधि 6s." },
      ta: { headline: "43' | ஹாலண்ட் — 2–0", body: "ரீபவுண்டில் கோல். அசிஸ்ட்: டி ப்ரூய்னே. ஓவர்லே கால அளவு 6s." },
    },
  },
  "goal-12": {
    fan: {
      en: { headline: "Haaland opens the scoring", body: "A cutback from the right byline and Haaland buries it first-time. The Norwegian's sharpness in the box makes the difference — 1–0 City." },
      hi: { headline: "हालैंड का पहला गोल", body: "बायलाइन से कटबैक और हालैंड का पहली छूट पर ज़ोरदार फिनिश — सिटी 1–0 आगे।" },
      ta: { headline: "ஹாலண்டின் முதல் கோல்", body: "கட்பேக்கில் ஹாலண்ட் முதல் தட்டிலேயே கோல் — சிட்டி 1–0 முன்னிலை." },
    },
    analyst: {
      en: { headline: "12' — Cutback pattern pays off", body: "De Bruyne's cutback from the right byline (EV-0030) found Haaland at the penalty spot for a first-time finish. City's third cutback attempt of the half; xG 0.41 (demo index)." },
      hi: { headline: "12' — कटबैक पैटर्न", body: "डी ब्रुयने के कटबैक (EV-0030) पर हालैंड पेनल्टी स्पॉट से फर्स्ट-टाइम फिनिश। xG 0.41 (डेमो इंडेक्स)।" },
      ta: { headline: "12' — கட்பேக் பேட்டர்ன்", body: "KDB கட்பேக் (EV-0030) ஹாலண்டுக்கு, முதல் தட்டில் கோல். xG 0.41 (டெமோ இண்டெக்ஸ்)." },
    },
    broadcast: {
      en: { headline: "12' | HAALAND — 1–0", body: "Cutback from De Bruyne, first-time finish from Haaland. Overlay duration 6s." },
      hi: { headline: "12' | हालैंड — 1–0", body: "डी ब्रुयने का कटबैक, हालैंड का फर्स्ट-टाइम फिनिश।" },
      ta: { headline: "12' | ஹாலண்ட் — 1–0", body: "KDB கட்பேக், ஹாலண்ட் ஃபர்ஸ்ட்-டைம் ஃபினிஷ்." },
    },
  },
  "big-32": {
    fan: {
      en: { headline: "Foden so close!", body: "Foden bends one from the edge of the box but it whistles past the far post. City's pressure keeps building." },
      hi: { headline: "फोडेन किनारे से चूके!", body: "बॉक्स के किनारे से फोडेन का शॉट फार पोस्ट के पास से निकला। सिटी का दबाव जारी।" },
      ta: { headline: "ஃபோடன் தவறியது!", body: "பாக்ஸ் விளிம்பிலிருந்து ஃபோடனின் ஷாட் தூர கம்பத்திற்கு அருகில் சென்றது." },
    },
    analyst: {
      en: { headline: "32' — Half-space shot forgives City", body: "Grealish's progressive carry (EV-0081) freed Foden at the edge of the box; the shot finished 0.8m wide (EV-0090). City's shot count keeps Liverpool pinned." },
      hi: { headline: "32' — फोडेन का मौका", body: "ग्रीलिश की ड्रिबल (EV-0081) के बाद फोडेन का शॉट 0.8 मीटर चूका (EV-0090)।" },
      ta: { headline: "32' — ஃபோடன் வாய்ப்பு", body: "க்ரீலிஷ் ட்ரிபிள் (EV-0081) பிறகு ஃபோடன் ஷாட் 0.8மீ தவறி (EV-0090)." },
    },
    broadcast: {
      en: { headline: "32' | FODEN WIDE", body: "Foden's effort from the edge of the box drifts past the far post. No change: 1–0." },
      hi: { headline: "32' | फोडेन वाइड", body: "फोडेन का शॉट फार पोस्ट के बाहर। स्कोर 1–0." },
      ta: { headline: "32' | ஃபோடன் வைட்", body: "ஃபோடன் ஷாட் வெளியே. ஸ்கோர் 1–0." },
    },
  },
  "press-55": {
    fan: {
      en: { headline: "Liverpool turn up the heat", body: "A two-minute press wave has City playing long — but the back line holds firm and the danger passes." },
      hi: { headline: "लिवरपूल का दबाव", body: "दो मिनट के दबाव में सिटी लंबी बॉल खेल रही है — लेकिन डिफेंस मज़बूत है।" },
      ta: { headline: "லிவர்பூல் அழுத்தம்", body: "இரண்டு நிமிட அழுத்தத்தில் சிட்டி நீள பாஸ் ஆடியது — ஆனால் பின்கோடு தாங்கியது." },
    },
    analyst: {
      en: { headline: "55' — Press wave contained", body: "Szoboszlai's trigger (EV-0146) produced ~2 minutes of sustained pressing; City went long three times before Walker's recovery (EV-0175) settled the phase. Momentum index flipped back to +3.2 MCI." },
      hi: { headline: "55' — दबाव रुका", body: "स्ज़ोबोस्ज़लाई के ट्रिगर (EV-0146) के बाद लगभग 2 मिनट का प्रेस; वॉकर की रिकवरी (EV-0175) के बाद संतुलन लौटा।" },
      ta: { headline: "55' — அழுத்தம் முடிவு", body: "ஸ்ஜோபோஸ்லை ட்ரிக்கர் (EV-0146) பிறகு இரண்டு நிமிட அழுத்தம்; வாக்கர் ரெக்கவரி (EV-0175) சமநிலை திரும்பியது." },
    },
    broadcast: {
      en: { headline: "55' | LIV PRESS WAVE", body: "Liverpool sustain pressure for two minutes; City clear long. Score unchanged 2–0." },
      hi: { headline: "55' | LIV प्रेस", body: "लिवरपूल दो मिनट दबाव; सिटी लंबा क्लियरेंस। स्कोर 2–0." },
      ta: { headline: "55' | LIV அழுத்தம்", body: "லிவர்பூல் இரண்டு நிமிடம் அழுத்தம்; ஸ்கோர் 2–0." },
    },
  },
  "yellow-67": {
    fan: {
      en: { headline: "Mac Allister booked", body: "A cynical foul stops a City counter. KDB stays down briefly — the crowd lets the referee know." },
      hi: { headline: "मैक एलिस्टर को कार्ड", body: "सिटी के काउंटर को रोकने के लिए जानबूझकर फाउल — पीला कार्ड।" },
      ta: { headline: "மக் அலிஸ்டருக்கு கார்டு", body: "சிட்டி கவுண்டரை நிறுத்த வேண்டி போலி ஃபௌல் — மஞ்சள் கார்டு." },
    },
    analyst: {
      en: { headline: "67' — Tactical foul stops the counter", body: "Mac Allister's foul (EV-0198) came 2.1s after Rodri's tackle on Salah (EV-0197) had opened a 4v3 transition. Free-kick in a promising zone." },
      hi: { headline: "67' — टैक्टिकल फाउल", body: "रोद्री के टैकल (EV-0197) के 2.1 सेकंड बाद मैक एलिस्टर ने 4v3 ट्रांज़िशन रोका (EV-0198)।" },
      ta: { headline: "67' — தந்திர ஃபௌல்", body: "ரோட்ரி டாக்கிள் (EV-0197) பிறகு 2.1 நொடியில் மக் அலிஸ்டர் 4v3 டிரான்சிஷனை நிறுத்தினார் (EV-0198)." },
    },
    broadcast: {
      en: { headline: "67' | YELLOW — MAC ALLISTER", body: "Tactical foul halts a City transition. Free-kick, 30m from goal." },
      hi: { headline: "67' | येलो — मैक एलिस्टर", body: "टैक्टिकल फाउल। फ्री-किक, गोल से 30 मीटर।" },
      ta: { headline: "67' | மஞ்சள் — மக் அலிஸ்டர்", body: "தந்திர ஃபௌல். ஃப்ரீ-கிக், கோலிலிருந்து 30மீ." },
    },
  },
};

/* ---------------- UI dictionary (curated demo strings) ---------------- */
export const UI_STRINGS: Record<Lang, Record<string, string>> = {
  en: { story: "Story", mode: "Mode", language: "Language", evidence: "View evidence", overlay: "Overlay preview", copyJson: "Copy overlay JSON", downloadJson: "Download overlay JSON", fan: "Fan", analyst: "Analyst", broadcast: "Broadcast", copied: "Copied to clipboard", downloaded: "Download started", favClub: "Favourite club", favPlayer: "Favourite player" },
  hi: { story: "कहानी", mode: "मोड", language: "भाषा", evidence: "सबूत देखें", overlay: "ओवरले प्रीव्यू", copyJson: "JSON कॉपी करें", downloadJson: "JSON डाउनलोड करें", fan: "फैन", analyst: "एनालिस्ट", broadcast: "ब्रॉडकास्ट", copied: "क्लिपबोर्ड पर कॉपी", downloaded: "डाउनलोड शुरू", favClub: "पसंदीदा क्लब", favPlayer: "पसंदीदा खिलाड़ी" },
  ta: { story: "கதை", mode: "முறை", language: "மொழி", evidence: "ஆதாரம்", overlay: "ஓவர்லே முன்னோட்டம்", copyJson: "JSON நகல்", downloadJson: "JSON பதிவிறக்கம்", fan: "ரசிகர்", analyst: "நிபுணர்", broadcast: "ஒளிபரப்பு", copied: "நகல் எடுக்கப்பட்டது", downloaded: "பதிவிறக்கம் தொடங்கியது", favClub: "விருப்ப அணி", favPlayer: "விருப்ப வீரர்" },
};

export const LANG_NAMES: Record<Lang, string> = { en: "English", hi: "हिन्दी", ta: "தமிழ்" };

/* ---------------- overlay JSON builder ---------------- */
export const buildOverlayJson = (moment: StoryMoment, mode: ViewMode, lang: Lang) => {
  const s = STORIES[moment.id][mode][lang];
  const ev = EVENTS.find((e) => e.id === moment.eventId);
  return {
    schema: "pitchpulse.overlay.v1",
    dataset: "SYNTHETIC_DEMO",
    fixture: { home: FIXTURE.homeShort, away: FIXTURE.awayShort, score: "2-0", minute: moment.minute },
    overlay: { type: "lower-third", headline: s.headline, subline: `${ev?.player ?? "MCI"} · ${mode.toUpperCase()} · ${lang.toUpperCase()}`, duration_sec: 6, language: lang, mode },
    evidence: { event_ids: [moment.eventId], note: "Grounded in synthetic demo event stream" },
  };
};

/* ---------------- recap exports ---------------- */
export const buildRecapText = (mode: ViewMode, lang: Lang) => {
  const s = STORIES["goal-43"][mode][lang];
  const lines = [
    `PITCHPULSE RECAP — ${FIXTURE.home} 2–0 ${FIXTURE.away} (FT) · SYNTHETIC DEMO`,
    ``,
    `KEY MOMENTS`,
    `12'  1–0 Haaland (assist De Bruyne)`,
    `32'  Big chance — Foden (off target)`,
    `43'  2–0 Haaland (assist De Bruyne)`,
    `55'  Liverpool press wave (~2 min)`,
    `67'  Yellow card — Mac Allister (LIV)`,
    ``,
    `STORY`,
    `${s.headline} — ${s.body}`,
    ``,
    `TACTICAL SUMMARY`,
    `City's high press and quick transitions made the difference: 12 high recoveries, 31 final-third entries and a 62% possession share kept the game controlled. Haaland's clinical finishing (2 from 4 shots) and De Bruyne's creativity (2 assists, 5 key passes) decided it.`,
  ];
  return lines.join("\n");
};

export const buildRecapJson = (mode: ViewMode, lang: Lang) => ({
  schema: "pitchpulse.recap.v1",
  dataset: "SYNTHETIC_DEMO",
  fixture: { home: FIXTURE.home, away: FIXTURE.away, score: "2-0", fullTime: "90:00" },
  keyMoments: ["12' 1-0 Haaland (assist De Bruyne)", "32' big chance Foden", "43' 2-0 Haaland (assist De Bruyne)", "55' LIV press wave", "67' yellow Mac Allister"],
  standout: { player: "Erling Haaland", rating: 9.2, goals: 2, shots: 4, onTarget: 3, distanceKm: 8.7, trackingNote: TRACKING_SAMPLES.note },
  tacticalSummary: { possession: "62-38", highRecoveriesMCI: 12, finalThirdEntriesMCI: 31, controlVsChaos: "68/100 (experimental demo index)" },
  story: STORIES["goal-43"][mode][lang],
  language: lang,
  mode,
});

/* ---------------- pipeline & stack (planned architecture only) ---------------- */
export const PIPELINE = [
  { id: 1, title: "Synthetic Event Generator", desc: "Deterministic demo event stream feeds every view." },
  { id: 2, title: "Event Processing", desc: "Timestamped events normalised into typed records." },
  { id: 3, title: "Statistics & Tactical Rules", desc: "Derived metrics: possession, pressure, patterns." },
  { id: 4, title: "Grounded Narrative Layer", desc: "Stories cite event IDs — no unsupported claims." },
  { id: 5, title: "Language Personalisation", desc: "Fan / Analyst / Broadcast × EN / हिन्दी / தமிழ்." },
  { id: 6, title: "Overlay / Recap Output", desc: "Broadcast lower-thirds and machine-readable JSON." },
];

export const TECH_STACK = [
  { name: "GitHub", role: "Code · Collaborate · Ship", status: "FRONTEND DEMO", glyph: "git" },
  { name: "GitHub Copilot", role: "AI pair programmer", status: "PLANNED INTEGRATION", glyph: "copilot" },
  { name: "Microsoft Foundry", role: "AI models · Storytelling", status: "PLANNED INTEGRATION", glyph: "foundry" },
  { name: "Azure AI Translator", role: "Multi-language support", status: "PLANNED INTEGRATION", glyph: "translator" },
  { name: "Azure SQL Database", role: "Data · Match history", status: "PLANNED INTEGRATION", glyph: "sql" },
  { name: "Azure Static Web Apps", role: "Frontend hosting", status: "PLANNED DEPLOY", glyph: "swa" },
  { name: "Microsoft Fabric", role: "Analytics · Data pipeline", status: "OPTIONAL ANALYTICS", glyph: "fabric" },
  { name: "Azure for Students", role: "$100 credits · Eligible", status: "STUDENT TIER", glyph: "students" },
];

export const PERSONALISATION = {
  focusModes: [
    { id: "story", label: "Match story" },
    { id: "player", label: "Favourite player" },
    { id: "attacking", label: "Attacking play" },
    { id: "tactical", label: "Tactical insights" },
  ] as const,
};

/* ---------------- personalised story (scene 04) ---------------- */
export const personalStory = (lang: Lang, club: string, player: string) => {
  if (lang === "hi") return `एक ${club} समर्थक के लिए यह मैच एक सपना था — कंट्रोल, तीव्रता और शानदार फिनिशिंग। ${player} का प्रदर्शन और टीम का दबाव यादगार रहेगा।`;
  if (lang === "ta") return `${club} ரசிகருக்கு இது ஒரு கனவு போட்டி — கட்டுப்பாடு, தீவிரம் மற்றும் சிறந்த முடித்துவைப்பு. ${player} நிகழ்ச்சி நினைவில் நிற்கும்.`;
  return `As a ${club} fan, this was a perfect display of control, intensity and clinical finishing. ${player} was at the heart of it — the kind of performance that makes the whole season feel alive.`;
};
