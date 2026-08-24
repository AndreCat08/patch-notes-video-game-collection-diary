import { STATUSES, type Filters, type Game, type StatusCounts } from '../types';

export function filterGames(games: Game[], filters: Filters): Game[] {
  const query = filters.query.trim().toLowerCase();
  return games.filter((game) => {
    if (query && !game.title.toLowerCase().includes(query)) return false;
    if (filters.platforms.length > 0 && !filters.platforms.includes(game.platform)) return false;
    if (filters.statuses.length > 0 && !filters.statuses.includes(game.status)) return false;
    return true;
  });
}

export function countByStatus(games: Game[]): StatusCounts {
  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0])) as StatusCounts;
  for (const game of games) counts[game.status]++;
  return counts;
}
