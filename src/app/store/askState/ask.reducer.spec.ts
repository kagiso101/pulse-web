import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Dispatcher } from '@ngrx/signals/events';
import { beforeEach, describe, expect, it } from 'vitest';
import { AskStore } from './ask.store';
import { askEvents } from './ask.events';

describe('ask reducer', () => {
  let store: InstanceType<typeof AskStore>;
  let dispatcher: Dispatcher;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    store = TestBed.inject(AskStore);
    dispatcher = TestBed.inject(Dispatcher);
  });

  // The ask effect calls fetch; the answer stream is driven here by dispatching the parsed
  // events directly, which is what the reducer sees in production.
  const start = (question = 'How did Bookvas do this week?') =>
    dispatcher.dispatch(askEvents.ask({ question, projectSlug: 'bookvas', range: '7d' }));

  it('starts idle and closed', () => {
    expect(store.status()).toBe('idle');
    expect(store.panelOpen()).toBe(false);
    expect(store.history()).toEqual([]);
  });

  it('ask opens the panel, records the scope and clears the old answer', () => {
    start();
    expect(store.status()).toBe('streaming');
    expect(store.panelOpen()).toBe(true);
    expect(store.question()).toBe('How did Bookvas do this week?');
    expect(store.scope()).toEqual({ projectSlug: 'bookvas', range: '7d' });
    expect(store.answer()).toBe('');
  });

  it('deltas append in order', () => {
    start();
    dispatcher.dispatch(askEvents.delta('Bookvas had '));
    dispatcher.dispatch(askEvents.delta('12 bookings.'));
    expect(store.answer()).toBe('Bookvas had 12 bookings.');
  });

  it('done finishes the answer and pushes it onto the history (newest first, max 5)', () => {
    for (let i = 1; i <= 6; i++) {
      start(`Q${i}`);
      dispatcher.dispatch(askEvents.delta(`A${i}`));
      dispatcher.dispatch(askEvents.done({ model: 'm', inputTokens: 1, outputTokens: 1 }));
    }
    expect(store.status()).toBe('done');
    expect(store.history()).toHaveLength(5);
    expect(store.history()[0]).toMatchObject({ question: 'Q6', answer: 'A6' });
    expect(store.history()[4]).toMatchObject({ question: 'Q2', answer: 'A2' });
  });

  it('an error event is shown inline and does not enter the history', () => {
    start();
    dispatcher.dispatch(askEvents.failed('Ask is not configured on the API yet.'));
    expect(store.status()).toBe('error');
    expect(store.error()).toBe('Ask is not configured on the API yet.');
    expect(store.history()).toEqual([]);
  });

  it('cancel keeps a partial answer, or returns to idle when nothing arrived', () => {
    start();
    dispatcher.dispatch(askEvents.cancel());
    expect(store.status()).toBe('idle');

    start();
    dispatcher.dispatch(askEvents.delta('partial'));
    dispatcher.dispatch(askEvents.cancel());
    expect(store.status()).toBe('done');
    expect(store.answer()).toBe('partial');
  });

  it('clear resets the exchange but keeps the history', () => {
    start();
    dispatcher.dispatch(askEvents.delta('x'));
    dispatcher.dispatch(askEvents.done({ model: 'm', inputTokens: 0, outputTokens: 0 }));
    dispatcher.dispatch(askEvents.clear());
    expect(store.status()).toBe('idle');
    expect(store.answer()).toBe('');
    expect(store.history()).toHaveLength(1);
  });
});
