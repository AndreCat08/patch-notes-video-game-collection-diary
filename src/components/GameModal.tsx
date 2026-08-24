import { useEffect, useRef, useState } from 'react';
import { FORMATS, PLATFORMS, STATUSES, type Format, type Game, type GameDraft, type Platform, type Status } from '../types';
import { CloseIcon } from '../icons';

interface Props {
  game: Game | null;
  onSave: (draft: GameDraft) => void;
  onClose: () => void;
}

const EMPTY: GameDraft = {
  title: '',
  platform: 'PC',
  format: 'Digital',
  status: 'Not Started',
  note: '',
};

export function GameModal({ game, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<GameDraft>(game ?? EMPTY);
  const [error, setError] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (draft.title.trim().length === 0) {
      setError('Title is required.');
      return;
    }
    onSave({ ...draft, title: draft.title.trim() });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-1md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        className="glass-panel bg-surface-container-low rounded-xl p-1lg w-full max-w-[28rem]"
      >
        <div className="flex justify-between items-center mb-1md pb-2 border-b border-white/5">
          <h2 id="modal-title" className="font-display text-2xl font-semibold text-primary">
            {game ? 'Edit Game' : 'Add New Game'}
          </h2>
          <button type="button" aria-label="Close" onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-1md">
          <div>
            <label htmlFor="title" className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">
              Game Title
            </label>
            <input
              id="title"
              ref={titleRef}
              type="text"
              placeholder="e.g. Baldur's Gate 3"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            {error && <p className="text-error text-sm mt-1">{error}</p>}
          </div>

          <div className="grid grid-cols-2 gap-1md">
            <div>
              <label htmlFor="platform" className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">
                Platform
              </label>
              <select
                id="platform"
                value={draft.platform}
                onChange={(e) => setDraft({ ...draft, platform: e.target.value as Platform })}
                className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Format</span>
              <div className="flex rounded-lg border border-white/10 overflow-hidden" role="radiogroup" aria-label="Format">
                {FORMATS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    role="radio"
                    aria-checked={draft.format === f}
                    onClick={() => setDraft({ ...draft, format: f as Format })}
                    className={`flex-1 py-2 text-sm ${draft.format === f ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="status" className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">
              Status
            </label>
            <select
              id="status"
              value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value as Status })}
              className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="note" className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">
              Personal Notes
            </label>
            <textarea
              id="note"
              placeholder="What are your thoughts?"
              value={draft.note}
              maxLength={280}
              onChange={(e) => setDraft({ ...draft, note: e.target.value })}
              rows={3}
              className="w-full bg-surface-container border border-white/10 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 mt-1sm">
            <button
              type="button"
              onClick={onClose}
              className="px-1lg py-2 rounded-full border border-white/10 text-on-surface hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-1lg py-2 rounded-full bg-primary text-on-primary font-semibold hover:bg-primary-container"
            >
              Save Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
