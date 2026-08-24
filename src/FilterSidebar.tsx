import { PLATFORMS, STATUSES, type Filters, type Platform, type Status } from './types';

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function FilterSidebar({ filters, onChange }: Props) {
  function togglePlatform(platform: Platform) {
    const platforms = filters.platforms.includes(platform)
      ? filters.platforms.filter((p) => p !== platform)
      : [...filters.platforms, platform];
    onChange({ ...filters, platforms });
  }

  function toggleStatus(status: Status) {
    const statuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onChange({ ...filters, statuses });
  }

  return (
    <aside className="w-full md:w-64 shrink-0 glass-panel rounded-xl p-1md h-fit">
      <h3 className="font-display text-lg font-semibold mb-1md pb-2 border-b border-white/5">
        Filters
      </h3>
      <fieldset className="mb-1lg">
        <legend className="font-display text-xs text-on-surface-variant mb-1sm uppercase tracking-wider">
          Platform
        </legend>
        <div className="flex flex-col gap-2">
          {PLATFORMS.map((platform) => (
            <label key={platform} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="rounded bg-surface-container border-white/10 text-primary"
                checked={filters.platforms.includes(platform)}
                onChange={() => togglePlatform(platform)}
              />
              <span className="text-on-surface">{platform}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="font-display text-xs text-on-surface-variant mb-1sm uppercase tracking-wider">
          Status
        </legend>
        <div className="flex flex-col gap-2">
          {STATUSES.map((status) => (
            <label key={status} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="rounded bg-surface-container border-white/10 text-secondary"
                checked={filters.statuses.includes(status)}
                onChange={() => toggleStatus(status)}
              />
              <span className="text-on-surface">{status}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </aside>
  );
}
