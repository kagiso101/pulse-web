import { on, withReducer } from '@ngrx/signals/events';
import { alertsEvents } from './alerts.events';
import { AlertsState } from './alerts.state';

export function withAlertsReducer() {
  return withReducer<AlertsState>(
    on(alertsEvents.loadRules, alertsEvents.loadOpenEvents, () => ({ loading: true, error: null })),
    on(alertsEvents.loadRulesSuccess, ({ payload }) => ({ rules: payload, loading: false })),
    on(alertsEvents.loadOpenEventsSuccess, ({ payload }) => ({
      openEvents: payload,
      loading: false,
    })),
    on(alertsEvents.loadRulesFailure, alertsEvents.loadOpenEventsFailure, ({ payload }) => ({
      loading: false,
      error: payload,
    })),

    on(alertsEvents.updateRule, () => ({ saving: true, error: null })),
    on(alertsEvents.updateRuleSuccess, ({ payload }, state) => ({
      saving: false,
      rules: state.rules.map((r) => (r.id === payload.id ? payload : r)),
    })),
    on(alertsEvents.updateRuleFailure, ({ payload }) => ({ saving: false, error: payload })),

    on(alertsEvents.ack, ({ payload }, state) => ({ acking: [...state.acking, payload.id] })),
    on(alertsEvents.ackSuccess, ({ payload }, state) => ({
      acking: state.acking.filter((id) => id !== payload.id),
      openEvents: state.openEvents.filter((e) => e.id !== payload.id),
    })),
    on(alertsEvents.ackFailure, ({ payload }) => ({ acking: [], error: payload })),
  );
}
