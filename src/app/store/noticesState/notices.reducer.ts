import { on, withReducer } from '@ngrx/signals/events';
import { noticesEvents } from './notices.events';
import { NoticesState } from './notices.state';

export function withNoticesReducer() {
  return withReducer<NoticesState>(
    on(noticesEvents.load, () => ({ loading: true, error: null })),
    on(noticesEvents.loadSuccess, ({ payload }) => ({ items: payload, loading: false })),
    on(noticesEvents.loadFailure, ({ payload }) => ({ loading: false, error: payload })),

    on(noticesEvents.markReadSuccess, ({ payload }, state) => ({
      items: state.items.filter((n) => n.id !== payload.id),
    })),
    on(noticesEvents.markReadFailure, ({ payload }) => ({ error: payload })),

    on(noticesEvents.setPanelOpen, ({ payload }) => ({ panelOpen: payload })),
  );
}
