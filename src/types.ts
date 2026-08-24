export const PLATFORMS = ['PC', 'PlayStation 5', 'Nintendo Switch', 'Xbox Series X'] as const;
export const FORMATS = ['Digital', 'Physical'] as const;
export const STATUSES = ['Not Started', 'In Progress', 'Completed', 'Dropped'] as const;

export type Platform = (typeof PLATFORMS)[number];
export type Format = (typeof FORMATS)[number];
export type Status = (typeof STATUSES)[number];

export interface Game {
  id: string;
  title: string;
  platform: Platform;
  format: Format;
  status: Status;
  note: string;
}

export type GameDraft = Omit<Game, 'id'>;
export type StatusCounts = Record<Status, number>;

export interface Filters {
  query: string;
  platforms: Platform[];
  statuses: Status[];
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  PC: 'PC',
  'PlayStation 5': 'PS5',
  'Nintendo Switch': 'Switch',
  'Xbox Series X': 'Xbox Series X',
};

export const STATUS_COLORS: Record<Status, string> = {
  'Not Started': 'outline',
  'In Progress': 'secondary',
  Completed: 'tertiary',
  Dropped: 'error',
};
