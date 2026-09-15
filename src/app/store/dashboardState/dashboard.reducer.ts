import { on, withReducer } from '@ngrx/signals/events';
import { dashboardEvents } from './dashboard.events';
import { dashboardKey, DashboardState } from './dashboard.state';

export function withDashboardReducer() {
  return withReducer<DashboardState>(
    on(dashboardEvents.load, ({ payload }) => ({
      currentKey: dashboardKey(payload.slug, payload.range),
      loading: true,
      error: null,
    })),
    on(dashboardEvents.loadSuccess, ({ payload }, state) => ({
      byKey: { ...state.byKey, [payload.key]: payload.dashboard },
      loading: state.currentKey === payload.key ? false : state.loading,
      error: state.currentKey === payload.key ? null : state.error,
    })),
    on(dashboardEvents.loadFailure, ({ payload }, state) =>
      state.currentKey === payload.key ? { loading: false, error: payload.message } : {},
    ),
  );
}
