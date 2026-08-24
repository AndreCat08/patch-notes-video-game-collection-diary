import { PLATFORM_LABELS, type Game } from '../types';
import { DeleteIcon, EditIcon } from '../icons';

interface Props {
  game: Game;
  onEdit: (game: Game) => void;
  onDelete: (game: Game) => void;
}

const PILL: Record<Game['status'], string> = {
  'Not Started': 'bg-outline/20 text-outline border-outline/30',
  'In Progress': 'bg-secondary/20 text-secondary border-secondary/30',
  Completed: 'bg-tertiary/20 text-tertiary border-tertiary/30',
  Dropped: 'bg-error/20 text-error border-error/30',
};

export function GameCard({ game, onEdit, onDelete }: Props) {
  const dropped = game.status === 'Dropped';
  return (
    <div className="glass-panel rounded-xl overflow-hidden card-hover flex flex-col relative">
      <div className="p-1md pb-0 flex justify-between items-start gap-2">
        <span className="bg-surface-container-highest/80 text-on-surface px-2 py-1 rounded-full text-xs border border-white/10">
          {PLATFORM_LABELS[game.platform]}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs border flex items-center gap-1.5 ${PILL[game.status]}`}
        >
          {game.status === 'In Progress' && (
            <span className="w-1.5 h-1.5 rounded-full bg-secondary pulse-dot" />
          )}
          {game.status}
        </span>
      </div>
      <div className="p-1md flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3
            className={`font-display text-xl font-semibold ${dropped ? 'line-through opacity-50' : 'text-on-surface'}`}
          >
            {game.title}
          </h3>
          <div className="flex gap-1 shrink-0">
            <button
              type="button"
              aria-label={`Edit ${game.title}`}
              onClick={() => onEdit(game)}
              className="text-on-surface-variant hover:text-primary p-1 bg-surface-container-low/50 rounded-lg border border-white/5"
            >
              <EditIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label={`Delete ${game.title}`}
              onClick={() => onDelete(game)}
              className="text-on-surface-variant hover:text-error p-1 bg-surface-container-low/50 rounded-lg border border-white/5"
            >
              <DeleteIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <span className="text-on-surface-variant text-xs uppercase tracking-wider mb-1sm">
          {game.format}
        </span>
        <p className="text-on-surface/80 text-sm line-clamp-3 mt-2 flex-1">
          {game.note ? game.note : <em className="text-on-surface-variant/60">No notes yet.</em>}
        </p>
      </div>
    </div>
  );
}
