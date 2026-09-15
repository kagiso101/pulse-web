import { on, withReducer } from '@ngrx/signals/events';
import { actionsEvents } from './actions.events';
import { ActionsState } from './actions.state';

export function withActionsReducer() {
  return withReducer<ActionsState>(
    on(actionsEvents.request, ({ payload }) => ({
      pending: payload,
      busy: false,
      lastResult: null,
      error: null,
    })),
    // Cancel is ignored while the request is in flight — the result must be seen.
    on(actionsEvents.cancel, (_, state) =>
      state.busy ? {} : { pending: null, lastResult: null, error: null },
    ),
    on(actionsEvents.confirm, (_, state) => (state.pending ? { busy: true, error: null } : {})),
    on(actionsEvents.completed, ({ payload }) => ({ busy: false, lastResult: payload })),
    on(actionsEvents.failed, ({ payload }) => ({ busy: false, error: payload })),
    on(actionsEvents.dismiss, () => ({
      pending: null,
      busy: false,
      lastResult: null,
      error: null,
    })),

    on(actionsEvents.loadLog, () => ({ logLoading: true })),
    on(actionsEvents.loadLogSuccess, ({ payload }) => ({ log: payload, logLoading: false })),
    on(actionsEvents.loadLogFailure, () => ({ logLoading: false })),
  );
}
