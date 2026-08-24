import { describe, expect, it, beforeEach } from 'vitest';
import { countByStatus, filterGames } from './filters';
import { loadGames, saveGames } from './storage';
import type { Game } from './types';

const games: Game[] = [
  { id: '1', title: 'Elden Ring', platform: 'PC', format: 'Digital', status: 'In Progress', note: '' },
  { id: '2', title: 'Hades', platform: 'Nintendo Switch', format: 'Physical', status: 'Completed', note: '' },
  { id: '3', title: 'Hollow Knight', platform: 'PC', format: 'Digital', status: 'Not Started', note: '' },
  { id: '4', title: 'Starfield', platform: 'Xbox Series X', format: 'Digital', status: 'Dropped', note: '' },
];

describe('countByStatus', () => {
  it('returns zeros for an empty collection', () => {
    expect(countByStatus([])).toEqual({
      'Not Started': 0,
      'In Progress': 0,
      Completed: 0,
      Dropped: 0,
    });
  });

  it('tallies a mixed collection', () => {
    expect(countByStatus(games)).toEqual({
      'Not Started': 1,
      'In Progress': 1,
      Completed: 1,
      Dropped: 1,
    });
  });
});

describe('filterGames', () => {
  it('matches title case-insensitively by substring', () => {
    const result = filterGames(games, { query: 'elden', platforms: [], statuses: [] });
    expect(result.map((g) => g.id)).toEqual(['1']);
  });

  it('empty query matches all', () => {
    expect(filterGames(games, { query: '', platforms: [], statuses: [] })).toHaveLength(4);
  });

  it('ORs within platform group', () => {
    const result = filterGames(games, {
      query: '',
      platforms: ['PC', 'Nintendo Switch'],
      statuses: [],
    });
    expect(result.map((g) => g.id).sort()).toEqual(['1', '2', '3']);
  });

  it('ORs within status group', () => {
    const result = filterGames(games, {
      query: '',
      platforms: [],
      statuses: ['Completed', 'Dropped'],
    });
    expect(result.map((g) => g.id).sort()).toEqual(['2', '4']);
  });

  it('ANDs across platform and status groups', () => {
    const result = filterGames(games, {
      query: '',
      platforms: ['PC'],
      statuses: ['In Progress'],
    });
    expect(result.map((g) => g.id)).toEqual(['1']);
  });

  it('returns input unchanged when all filters are empty', () => {
    expect(filterGames(games, { query: '', platforms: [], statuses: [] })).toEqual(games);
  });
});

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns [] when nothing is stored', () => {
    expect(loadGames()).toEqual([]);
  });

  it('returns [] for garbage JSON', () => {
    localStorage.setItem('patch-notes:games', 'garbage');
    expect(loadGames()).toEqual([]);
  });

  it('returns [] when stored value is not an array', () => {
    localStorage.setItem('patch-notes:games', JSON.stringify({ foo: 'bar' }));
    expect(loadGames()).toEqual([]);
  });

  it('drops entries with an invalid status but keeps valid siblings', () => {
    const stored = [
      games[0],
      { ...games[1], status: 'Not A Real Status' },
    ];
    localStorage.setItem('patch-notes:games', JSON.stringify(stored));
    const result = loadGames();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('round-trips a collection through save and load', () => {
    saveGames(games);
    expect(loadGames()).toEqual(games);
  });
});
