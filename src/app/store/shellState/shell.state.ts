import { Range, RANGES } from '../../../shared/models/range.model';

export const RANGE_STORAGE_KEY = 'pulse_range';

export interface ShellState {
  /** Today · 7d · 30d — persisted in localStorage. */
  range: Range;
  /** The selected project pill; null = All. Drives the Ask scope. */
  selectedSlug: string | null;
  /** From the latest overview/dashboard response — "updated 3 min ago". */
  lastSnapshotAt: string | null;
  /** True between a refresh request and the next load settling. */
  refreshing: boolean;
  /** Incremented every 60s while the tab is visible and on manual refresh; pages react to it. */
  refreshTick: number;
}

export function readPersistedRange(): Range {
  try {
    const v = localStorage.getItem(RANGE_STORAGE_KEY);
    return v && (RANGES as readonly string[]).includes(v) ? (v as Range) : '7d';
  } catch {
    return '7d';
  }
}

export const initialShellState: ShellState = {
  range: readPersistedRange(),
  selectedSlug: null,
  lastSnapshotAt: null,
  refreshing: false,
  refreshTick: 0,
};
