import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Dispatcher } from '@ngrx/signals/events';
import { beforeEach, describe, expect, it } from 'vitest';
import { ShellStore } from './shell.store';
import { shellEvents } from './shell.events';
import { overviewEvents } from '../overviewState/overview.events';
import { Overview } from '../../../shared/models/overview.model';

const overview: Overview = {
  range: '7d',
  headline: {
    visitors: 1,
    bookingsThisWeek: null,
    depositsCents: null,
    founderSeatsUsed: 3,
    founderSeatsTotal: 20,
    cvDownloads: 2,
    sitesUp: 4,
    sitesTotal: 4,
  },
  projects: [],
  needsYou: [],
  summary: null,
  lastSnapshotAt: '2026-09-15T06:45:00Z',
};

describe('shell reducer', () => {
  let store: InstanceType<typeof ShellStore>;
  let dispatcher: Dispatcher;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    store = TestBed.inject(ShellStore);
    dispatcher = TestBed.inject(Dispatcher);
  });

  it('starts on 7d with nothing selected', () => {
    expect(store.range()).toBe('7d');
    expect(store.selectedSlug()).toBeNull();
    expect(store.refreshTick()).toBe(0);
  });

  it('sets and persists the range', () => {
    dispatcher.dispatch(shellEvents.setRange('30d'));
    expect(store.range()).toBe('30d');
    expect(localStorage.getItem('pulse_range')).toBe('30d');
  });

  it('selects a project pill', () => {
    dispatcher.dispatch(shellEvents.selectProject('bookvas'));
    expect(store.selectedSlug()).toBe('bookvas');
    dispatcher.dispatch(shellEvents.selectProject(null));
    expect(store.selectedSlug()).toBeNull();
  });

  it('a manual refresh bumps the tick and shows the spinner until the overview lands', () => {
    dispatcher.dispatch(shellEvents.refreshRequested());
    expect(store.refreshTick()).toBe(1);
    expect(store.refreshing()).toBe(true);

    dispatcher.dispatch(overviewEvents.loadSuccess(overview));
    expect(store.refreshing()).toBe(false);
    expect(store.lastSnapshotAt()).toBe('2026-09-15T06:45:00Z');
  });

  it('a failed load also settles the spinner', () => {
    dispatcher.dispatch(shellEvents.refreshRequested());
    dispatcher.dispatch(overviewEvents.loadFailure("Can't reach the Pulse API"));
    expect(store.refreshing()).toBe(false);
  });

  it('auto ticks do not show the manual spinner', () => {
    dispatcher.dispatch(shellEvents.autoRefreshTick());
    expect(store.refreshTick()).toBe(1);
    expect(store.refreshing()).toBe(false);
  });
});
