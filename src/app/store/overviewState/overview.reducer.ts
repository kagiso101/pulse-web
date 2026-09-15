import { on, withReducer } from '@ngrx/signals/events';
import { overviewEvents } from './overview.events';
import { OverviewState } from './overview.state';
import { alertsEvents } from '../alertsState/alerts.events';
import { prospectsEvents } from '../prospectsState/prospects.events';

export function withOverviewReducer() {
  return withReducer<OverviewState>(
    on(overviewEvents.load, ({ payload }) => ({ loading: true, error: null, range: payload })),
    on(overviewEvents.loadSuccess, ({ payload }) => ({
      data: payload,
      loading: false,
      error: null,
    })),
    on(overviewEvents.loadFailure, ({ payload }) => ({ loading: false, error: payload })),

    // Acknowledging an alert clears it from "Needs you" immediately.
    on(alertsEvents.ackSuccess, ({ payload }, state) => ({
      data: state.data
        ? {
            ...state.data,
            needsYou: state.data.needsYou.filter(
              (item) => !(item.type === 'alert' && item.id === payload.id),
            ),
          }
        : null,
    })),

    // A prospect that is no longer overdue leaves "Needs you" too.
    on(prospectsEvents.saveSuccess, ({ payload }, state) => ({
      data:
        state.data && !payload.overdue
          ? {
              ...state.data,
              needsYou: state.data.needsYou.filter(
                (item) => !(item.type === 'prospect' && item.id === payload.id),
              ),
            }
          : state.data,
    })),
  );
}
