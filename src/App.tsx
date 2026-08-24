import { useState } from 'react';
import { useGames } from './useGames';
import { filterGames, countByStatus } from './filters';
import type { Filters, Game } from './types';
import { SummaryBar } from './SummaryBar';
import { FilterSidebar } from './FilterSidebar';
import { GameCard } from './GameCard';
import { GameModal } from './GameModal';
import { SearchIcon } from './icons';

const EMPTY_FILTERS: Filters = { query: '', platforms: [], statuses: [] };

export default function App() {
  const { games, addGame, updateGame, deleteGame } = useGames();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [editing, setEditing] = useState<Game | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const visible = filterGames(games, filters);
  const counts = countByStatus(games);
  const hasFilters = filters.query !== '' || filters.platforms.length > 0 || filters.statuses.length > 0;

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(game: Game) {
    setEditing(game);
    setModalOpen(true);
  }

  function handleDelete(game: Game) {
    if (confirm(`Delete "${game.title}" from your collection?`)) {
      deleteGame(game.id);
    }
  }

  function handleSave(draft: Omit<Game, 'id'>) {
    if (editing) {
      updateGame(editing.id, draft);
    } else {
      addGame(draft);
    }
    setModalOpen(false);
  }

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-1gutter py-1sm bg-background/70 backdrop-blur-lg border-b border-white/10">
        <span className="font-display text-2xl md:text-4xl font-bold text-primary">Patch Notes</span>
        <div className="flex items-center gap-1md">
          <div className="relative hidden sm:block">
            <input
              type="text"
              name="search"
              placeholder="Search collection..."
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              aria-label="Search collection"
              className="bg-surface-container-low border border-white/10 rounded-full py-2 pl-10 pr-4 w-56 md:w-64 text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
            />
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="bg-primary text-on-primary px-1lg py-2 rounded-full font-semibold text-sm hover:bg-primary-container"
          >
            Add Game
          </button>
        </div>
      </nav>

      <div className="pt-[90px] px-1gutter max-w-[1280px] mx-auto pb-1xl flex flex-col md:flex-row gap-1lg">
        <FilterSidebar filters={filters} onChange={setFilters} />

        <main className="flex-1 flex flex-col gap-1xl min-w-0">
          <SummaryBar counts={counts} />

          {visible.length > 0 ? (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1lg">
              {visible.map((game) => (
                <GameCard key={game.id} game={game} onEdit={openEdit} onDelete={handleDelete} />
              ))}
            </section>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1md py-1xl text-center">
              <p className="text-on-surface-variant">
                {hasFilters ? 'No games match your filters.' : 'Your collection is empty.'}
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={() => setFilters(EMPTY_FILTERS)}
                  className="px-1lg py-2 rounded-full border border-white/10 text-on-surface hover:bg-white/5"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {modalOpen && (
        <GameModal game={editing} onSave={handleSave} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
