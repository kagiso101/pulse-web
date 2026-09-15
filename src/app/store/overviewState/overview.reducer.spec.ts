import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Dispatcher } from '@ngrx/signals/events';
import { beforeEach, describe, expect, it } from 'vitest';
import { OverviewStore } from './overview.store';
import { overviewEvents } from './overview.events';
import { alertsEvents } from '../alertsState/alerts.events';
import { prospectsEvents } from '../prospectsState/prospects.events';
import { Overview } from '../../../shared/models/overview.model';
import { AlertEvent } from '../../../shared/models/alert.model';
import { Prospect } from '../../../shared/models/prospect.model';

const overview: Overview = {
  range: '7d',
  headline: {
    visitors: 1200,
    bookingsThisWeek: null,
    depositsCents: null,
    founderSeatsUsed: 3,
    founderSeatsTotal: 20,
    cvDownloads: 4,
    sitesUp: 3,
    sitesTotal: 4,
  },
  projects: [],
  needsYou: [
    {
      type: 'alert',
      id: 'a1',
      title: 'Site down',
      detail: 'brujathembi.com',
      since: '2026-09-15T05:00:00Z',
      projectId: 'p4',
      href: '/p/bruja-thembi',
    },
    {
      type: 'prospect',
      id: 'pr1',
      title: 'Call Nomsa',
      detail: 'Salon Blaauwberg',
      since: '2026-09-14',
      projectId: null,
      href: '/prospects',
    },
  ],
  summary: { date: '2026-09-15', body: 'Yesterday: 2 bookings.', sentAt: null },
  lastSnapshotAt: '2026-09-15T06:45:00Z',
};

describe('overview reducer', () => {
  let store: InstanceType<typeof OverviewStore>;
  let dispatcher: Dispatcher;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    store = TestBed.inject(OverviewStore);
    dispatcher = TestBed.inject(Dispatcher);
  });

  it('marks loading with the requested range', () => {
    dispatcher.dispatch(overviewEvents.load('30d'));
    expect(store.loading()).toBe(true);
    expect(store.range()).toBe('30d');
    expect(store.error()).toBeNull();
  });

  it('stores the overview on success and clears the error', () => {
    dispatcher.dispatch(overviewEvents.loadFailure('boom'));
    dispatcher.dispatch(overviewEvents.loadSuccess(overview));
    expect(store.data()?.headline.visitors).toBe(1200);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('keeps the last good data when a refresh fails', () => {
    dispatcher.dispatch(overviewEvents.loadSuccess(overview));
    dispatcher.dispatch(overviewEvents.loadFailure("Can't reach the Pulse API"));
    expect(store.data()).not.toBeNull();
    expect(store.error()).toBe("Can't reach the Pulse API");
  });

  it('removes an acknowledged alert from Needs you', () => {
    dispatcher.dispatch(overviewEvents.loadSuccess(overview));
    const acked: AlertEvent = {
      id: 'a1',
      ruleId: 'r1',
      kind: 'site_down',
      projectId: 'p4',
      firedAt: '2026-09-15T05:00:00Z',
      payload: {},
      delivered: true,
      acknowledgedAt: '2026-09-15T07:00:00Z',
      title: 'Site down',
      detail: 'brujathembi.com',
    };
    dispatcher.dispatch(alertsEvents.ackSuccess(acked));
    expect(store.data()?.needsYou.map((i) => i.id)).toEqual(['pr1']);
  });

  it('removes a prospect that is no longer overdue, keeps one that still is', () => {
    dispatcher.dispatch(overviewEvents.loadSuccess(overview));
    const prospect: Prospect = {
      id: 'pr1',
      name: 'Nomsa',
      business: 'Salon Blaauwberg',
      phone: null,
      area: null,
      hasWebsite: null,
      status: 'contacted',
      nextAction: 'Call',
      nextActionDate: '2026-09-20',
      notes: null,
      updatedAt: '2026-09-15T07:00:00Z',
      overdue: true,
    };
    dispatcher.dispatch(prospectsEvents.saveSuccess(prospect));
    expect(store.data()?.needsYou).toHaveLength(2);
    dispatcher.dispatch(prospectsEvents.saveSuccess({ ...prospect, overdue: false }));
    expect(store.data()?.needsYou.map((i) => i.id)).toEqual(['a1']);
  });
});
