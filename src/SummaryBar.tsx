import { STATUSES, type StatusCounts } from './types';
import { CompletedIcon, DroppedIcon, InProgressIcon, NotStartedIcon } from './icons';

const ICONS = {
  'Not Started': NotStartedIcon,
  'In Progress': InProgressIcon,
  Completed: CompletedIcon,
  Dropped: DroppedIcon,
};

const BORDER = {
  'Not Started': 'border-l-outline',
  'In Progress': 'border-l-secondary',
  Completed: 'border-l-tertiary',
  Dropped: 'border-l-error',
};

const TEXT = {
  'Not Started': 'text-outline',
  'In Progress': 'text-secondary',
  Completed: 'text-tertiary',
  Dropped: 'text-error',
};

export function SummaryBar({ counts }: { counts: StatusCounts }) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-1md" aria-label="Collection summary">
      {STATUSES.map((status) => {
        const Icon = ICONS[status];
        return (
          <div
            key={status}
            className={`glass-panel rounded-xl p-1md flex flex-col gap-1sm border-l-2 ${BORDER[status]}`}
          >
            <span className="font-display text-xs text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
              {status}
              {status === 'In Progress' && (
                <span className="w-1.5 h-1.5 rounded-full bg-secondary pulse-dot" />
              )}
            </span>
            <div className="flex items-end justify-between">
              <span className={`font-display text-3xl font-semibold ${TEXT[status]}`}>
                {counts[status]}
              </span>
              <Icon className={`w-6 h-6 ${TEXT[status]} opacity-50`} />
            </div>
          </div>
        );
      })}
    </section>
  );
}
