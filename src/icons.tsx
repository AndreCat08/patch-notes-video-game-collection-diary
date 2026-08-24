type IconProps = { className?: string };

const base = 'currentColor';

export function EditIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={base} strokeWidth="2" aria-hidden="true">
      <path d="M12 20h9" strokeLinecap="round" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DeleteIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={base} strokeWidth="2" aria-hidden="true">
      <path d="M3 6h18" strokeLinecap="round" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={base} strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={base} strokeWidth="2" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}

export function NotStartedIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={base} strokeWidth="2" aria-hidden="true">
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M8 7V4h8v3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InProgressIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={base} strokeWidth="2" aria-hidden="true">
      <rect x="2" y="8" width="20" height="10" rx="5" />
      <circle cx="8" cy="13" r="2" fill={base} stroke="none" />
      <path d="M14 11h3M14 15h2" strokeLinecap="round" />
    </svg>
  );
}

export function CompletedIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={base} strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DroppedIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={base} strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m6 6 12 12" strokeLinecap="round" />
    </svg>
  );
}
