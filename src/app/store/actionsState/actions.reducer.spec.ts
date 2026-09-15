import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Dispatcher } from '@ngrx/signals/events';
import { beforeEach, describe, expect, it } from 'vitest';
import { ActionsStore } from './actions.store';
import { actionsEvents } from './actions.events';
import { PendingAction } from '../../../shared/models/action.model';

const extendGrace: PendingAction = {
  kind: 'extend-grace',
  subscriptionId: 'sub-1',
  days: 5,
  title: 'Extend grace',
  sentence: "Extend Nomsa's Nails' grace period by 5 days on Bookvas.",
};

describe('actions reducer', () => {
  let store: InstanceType<typeof ActionsStore>;
  let dispatcher: Dispatcher;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    store = TestBed.inject(ActionsStore);
    dispatcher = TestBed.inject(Dispatcher);
  });

  it('starts closed', () => {
    expect(store.pending()).toBeNull();
    expect(store.busy()).toBe(false);
  });

  it('request opens the sheet with the sentence and clears old results', () => {
    dispatcher.dispatch(
      actionsEvents.completed({ result: 'ok', message: 'old', actionLogId: '0' }),
    );
    dispatcher.dispatch(actionsEvents.request(extendGrace));
    expect(store.pending()?.sentence).toContain('grace period by 5 days');
    expect(store.lastResult()).toBeNull();
    expect(store.error()).toBeNull();
  });

  it('cancel closes the sheet when nothing is in flight', () => {
    dispatcher.dispatch(actionsEvents.request(extendGrace));
    dispatcher.dispatch(actionsEvents.cancel());
    expect(store.pending()).toBeNull();
  });

  it('confirm marks busy and cancel is ignored while busy', () => {
    dispatcher.dispatch(actionsEvents.request(extendGrace));
    dispatcher.dispatch(actionsEvents.confirm());
    expect(store.busy()).toBe(true);
    dispatcher.dispatch(actionsEvents.cancel());
    expect(store.pending()).not.toBeNull();
  });

  it('a failed result is kept and shown, never hidden', () => {
    dispatcher.dispatch(actionsEvents.request(extendGrace));
    dispatcher.dispatch(actionsEvents.confirm());
    dispatcher.dispatch(
      actionsEvents.completed({
        result: 'failed',
        message: 'Bookvas said no',
        actionLogId: 'log-9',
      }),
    );
    expect(store.busy()).toBe(false);
    expect(store.lastResult()?.result).toBe('failed');
    expect(store.lastResult()?.message).toBe('Bookvas said no');
    expect(store.pending()).not.toBeNull();
  });

  it('a transport failure surfaces as an error and unblocks the sheet', () => {
    dispatcher.dispatch(actionsEvents.request(extendGrace));
    dispatcher.dispatch(actionsEvents.confirm());
    dispatcher.dispatch(actionsEvents.failed("Can't reach the Pulse API"));
    expect(store.busy()).toBe(false);
    expect(store.error()).toBe("Can't reach the Pulse API");
  });

  it('dismiss clears everything', () => {
    dispatcher.dispatch(actionsEvents.request(extendGrace));
    dispatcher.dispatch(
      actionsEvents.completed({ result: 'ok', message: 'Done', actionLogId: '1' }),
    );
    dispatcher.dispatch(actionsEvents.dismiss());
    expect(store.pending()).toBeNull();
    expect(store.lastResult()).toBeNull();
  });

  it('confirm without a pending action does nothing', () => {
    dispatcher.dispatch(actionsEvents.confirm());
    expect(store.busy()).toBe(false);
  });
});
