import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { saveGames } from './storage';
import type { Game } from './types';

const games: Game[] = [
  { id: '1', title: 'Elden Ring', platform: 'PC', format: 'Digital', status: 'In Progress', note: '' },
  { id: '2', title: 'Hades', platform: 'Nintendo Switch', format: 'Physical', status: 'Completed', note: '' },
];

beforeEach(() => {
  localStorage.clear();
  saveGames(games);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('add flow', () => {
  it('adds a game and increments its status count', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Add Game' }));
    await user.type(screen.getByLabelText('Game Title'), 'Baldur\'s Gate 3');
    await user.click(screen.getByRole('button', { name: 'Save Game' }));

    expect(screen.getByText('Baldur\'s Gate 3')).toBeInTheDocument();
    const summary = screen.getByRole('region', { name: 'Collection summary' });
    const notStartedTile = within(summary).getByText('Not Started').closest<HTMLElement>('.glass-panel')!;
    expect(within(notStartedTile).getByText('1')).toBeInTheDocument();
  });
});

describe('validation', () => {
  it('blocks save on a whitespace-only title', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Add Game' }));
    await user.type(screen.getByLabelText('Game Title'), '   ');
    await user.click(screen.getByRole('button', { name: 'Save Game' }));

    expect(screen.getByText('Title is required.')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).toBeInTheDocument();
  });
});

describe('edit flow', () => {
  it('updates a game in place without changing collection size', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Edit Elden Ring' }));
    await user.selectOptions(screen.getByLabelText('Status'), 'Completed');
    await user.click(screen.getByRole('button', { name: 'Save Game' }));

    const card = screen.getByText('Elden Ring').closest<HTMLElement>('div.glass-panel')!;
    expect(within(card).getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Hades')).toBeInTheDocument();
  });
});

describe('delete flow', () => {
  it('removes a game after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Delete Hades' }));

    expect(screen.queryByText('Hades')).not.toBeInTheDocument();
  });
});

describe('filter flow', () => {
  it('shows empty state when no game matches', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('checkbox', { name: 'Dropped' }));

    expect(screen.getByText('No games match your filters.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByText('Elden Ring')).toBeInTheDocument();
  });
});
