import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { FAVOURITE_CLUBS, FAVOURITE_PLAYERS, LIVE_CLOCK, FULL_TIME, UI_STRINGS, type Lang, type ViewMode } from "@/data/match";

export interface Prefs {
  lang: Lang;
  viewMode: ViewMode;
  club: string;
  player: string;
  focus: string;
}

export const DEFAULT_PREFS: Prefs = { lang: "en", viewMode: "fan", club: "MCI", player: "haaland", focus: "story" };

const STORAGE_KEY = "pitchpulse.prefs.v1";

interface AppState {
  prefs: Prefs;
  setPrefs: (p: Partial<Prefs>) => void;
  resetPrefs: () => void;
  strings: Record<string, string>;
  clock: number;
  playing: boolean;
  speed: 1 | 2 | 4;
  togglePlay: () => void;
  restart: () => void;
  setSpeed: (s: 1 | 2 | 4) => void;
  scrub: (sec: number) => void;
  toast: (msg: string) => void;
  toasts: { id: number; msg: string }[];
  glitch: boolean;
}

const Ctx = createContext<AppState | null>(null);

const loadPrefs = (): Prefs => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch { /* demo storage */ }
  return DEFAULT_PREFS;
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefsState] = useState<Prefs>(loadPrefs);
  const [clock, setClock] = useState(LIVE_CLOCK);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);
  const [glitch, setGlitch] = useState(false);
  const toastId = useRef(0);
  const goalFired = useRef<Set<number>>(new Set());

  const setPrefs = useCallback((p: Partial<Prefs>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...p };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* demo storage */ }
      return next;
    });
  }, []);

  const resetPrefs = useCallback(() => {
    setPrefsState(DEFAULT_PREFS);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* demo storage */ }
  }, []);

  const toast = useCallback((msg: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  // simulated playback: 1x ≈ 10 game-seconds per real second
  useEffect(() => {
    if (!playing) return;
    const iv = setInterval(() => {
      setClock((c) => {
        const next = c + 2.5 * speed;
        if (next >= FULL_TIME) {
          setPlaying(false);
          return FULL_TIME;
        }
        return next;
      });
    }, 250);
    return () => clearInterval(iv);
  }, [playing, speed]);

  // glitch pulse when a goal enters view during playback
  useEffect(() => {
    const mci = clock >= 720 && !goalFired.current.has(720);
    const mci2 = clock >= 2580 && !goalFired.current.has(2580);
    if (mci || mci2) {
      if (mci) goalFired.current.add(720);
      if (mci2) goalFired.current.add(2580);
      setGlitch(true);
      const t = setTimeout(() => setGlitch(false), 450);
      return () => clearTimeout(t);
    }
  }, [clock]);

  const value = useMemo<AppState>(() => ({
    prefs,
    setPrefs,
    resetPrefs,
    strings: UI_STRINGS[prefs.lang],
    clock,
    playing,
    speed,
    togglePlay: () => setPlaying((p) => !p),
    restart: () => { setClock(0); setPlaying(true); },
    setSpeed: (s) => setSpeed(s),
    scrub: (sec) => setClock(Math.max(0, Math.min(FULL_TIME, sec))),
    toast,
    toasts,
    glitch,
  }), [prefs, setPrefs, resetPrefs, clock, playing, speed, toast, toasts, glitch]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp outside provider");
  return v;
}

export const clubName = (id: string) => FAVOURITE_CLUBS.find((c) => c.id === id)?.name ?? "Manchester City";
export const playerName = (id: string) => FAVOURITE_PLAYERS.find((p) => p.id === id)?.name ?? "Erling Haaland";
export const playerNum = (id: string) => FAVOURITE_PLAYERS.find((p) => p.id === id)?.num ?? 9;
