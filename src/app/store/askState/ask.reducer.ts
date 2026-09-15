import { on, withReducer } from '@ngrx/signals/events';
import { askEvents } from './ask.events';
import { ASK_HISTORY_LIMIT, AskState } from './ask.state';

export function withAskReducer() {
  return withReducer<AskState>(
    on(askEvents.ask, ({ payload }) => ({
      question: payload.question,
      answer: '',
      status: 'streaming',
      error: null,
      scope: { projectSlug: payload.projectSlug, range: payload.range },
      panelOpen: true,
    })),
    on(askEvents.delta, ({ payload }, state) => ({ answer: state.answer + payload })),
    on(askEvents.done, (_, state) => ({
      status: 'done',
      history: [
        { question: state.question, answer: state.answer, askedAt: new Date().toISOString() },
        ...state.history,
      ].slice(0, ASK_HISTORY_LIMIT),
    })),
    on(askEvents.failed, ({ payload }) => ({ status: 'error', error: payload })),
    // Stopping mid-stream keeps whatever arrived.
    on(askEvents.cancel, (_, state) =>
      state.status === 'streaming' ? { status: state.answer ? 'done' : 'idle' } : {},
    ),
    on(askEvents.setPanelOpen, ({ payload }) => ({ panelOpen: payload })),
    on(askEvents.clear, () => ({
      question: '',
      answer: '',
      status: 'idle',
      error: null,
      scope: null,
    })),
  );
}
