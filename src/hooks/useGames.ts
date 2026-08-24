import { useEffect, useState } from 'react';
import { loadGames, saveGames } from '../lib/storage';
import { SEED_GAMES } from '../lib/seed';
import type { Game, GameDraft } from '../types';

export function useGames() {
  const [games, setGames] = useState<Game[]>(() => {
    const stored = loadGames();
    return stored.length > 0 ? stored : SEED_GAMES;
  });

  useEffect(() => {
    saveGames(games);
  }, [games]);

  function addGame(draft: GameDraft): void {
    setGames((prev) => [...prev, { ...draft, id: crypto.randomUUID() }]);
  }

  function updateGame(id: string, draft: GameDraft): void {
    setGames((prev) => prev.map((g) => (g.id === id ? { ...draft, id } : g)));
  }

  function deleteGame(id: string): void {
    setGames((prev) => prev.filter((g) => g.id !== id));
  }

  return { games, addGame, updateGame, deleteGame };
}
