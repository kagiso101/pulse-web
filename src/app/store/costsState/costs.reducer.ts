import { on, withReducer } from '@ngrx/signals/events';
import { costsEvents } from './costs.events';
import { CostsState } from './costs.state';
import { currentMonth } from '../../../shared/utils/format';

export function withCostsReducer() {
  return withReducer<CostsState>(
    on(costsEvents.load, ({ payload }) => ({
      loading: true,
      error: null,
      month: payload ?? currentMonth(),
    })),
    on(costsEvents.loadSuccess, ({ payload }) => ({
      report: payload,
      month: payload.month,
      loading: false,
      error: null,
    })),
    on(costsEvents.loadFailure, ({ payload }) => ({ loading: false, error: payload })),

    on(costsEvents.saveManual, () => ({ saving: true, error: null })),
    on(costsEvents.saveManualSuccess, ({ payload }) => ({
      report: payload,
      month: payload.month,
      saving: false,
    })),
    on(costsEvents.saveManualFailure, ({ payload }) => ({ saving: false, error: payload })),
  );
}
