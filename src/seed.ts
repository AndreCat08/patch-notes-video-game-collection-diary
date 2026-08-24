import type { Game } from './types';

export const SEED_GAMES: Game[] = [
  {
    id: crypto.randomUUID(),
    title: 'Elden Ring',
    platform: 'PlayStation 5',
    format: 'Digital',
    status: 'In Progress',
    note: 'Mastering the parry timing. Stuck on Malenia, need to respec build perhaps.',
  },
  {
    id: crypto.randomUUID(),
    title: 'Hades',
    platform: 'Nintendo Switch',
    format: 'Physical',
    status: 'Completed',
    note: 'Cleared Heat 16 with the Bow. Taking a break before pushing higher.',
  },
  {
    id: crypto.randomUUID(),
    title: 'Cyberpunk 2077',
    platform: 'PC',
    format: 'Digital',
    status: 'In Progress',
    note: 'Phantom Liberty expansion. Netrunner build is finally feeling overpowered.',
  },
  {
    id: crypto.randomUUID(),
    title: 'Hollow Knight',
    platform: 'PC',
    format: 'Digital',
    status: 'Not Started',
    note: '',
  },
  {
    id: crypto.randomUUID(),
    title: 'Starfield',
    platform: 'Xbox Series X',
    format: 'Digital',
    status: 'Dropped',
    note: 'Lost interest after 20 hours. Inventory management got too tedious.',
  },
];
