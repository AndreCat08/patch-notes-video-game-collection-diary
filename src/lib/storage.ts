import { FORMATS, PLATFORMS, STATUSES, type Game } from '../types';

const KEY = 'patch-notes:games';

function isGame(value: unknown): value is Game {
  if (typeof value !== 'object' || value === null) return false;
  const g = value as Record<string, unknown>;
  return (
    typeof g.id === 'string' &&
    typeof g.title === 'string' &&
    g.title.trim().length > 0 &&
    typeof g.note === 'string' &&
    (PLATFORMS as readonly string[]).includes(g.platform as string) &&
    (FORMATS as readonly string[]).includes(g.format as string) &&
    (STATUSES as readonly string[]).includes(g.status as string)
  );
}

export function loadGames(): Game[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isGame);
  } catch {
    return [];
  }
}

export function saveGames(games: Game[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(games));
  } catch {
    // quota exceeded or storage unavailable — UI keeps working in-memory
  }
}
