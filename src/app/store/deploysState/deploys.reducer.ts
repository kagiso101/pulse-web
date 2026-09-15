import { on, withReducer } from '@ngrx/signals/events';
import { deploysEvents } from './deploys.events';
import { DeploysState } from './deploys.state';

export function withDeploysReducer() {
  return withReducer<DeploysState>(
    on(deploysEvents.load, ({ payload }) => ({
      loading: true,
      error: null,
      projectId: payload.projectId,
    })),
    on(deploysEvents.loadSuccess, ({ payload }) => ({ items: payload, loading: false })),
    on(deploysEvents.loadFailure, ({ payload }) => ({ loading: false, error: payload })),
    on(deploysEvents.setProjectFilter, ({ payload }) => ({ projectId: payload })),
  );
}
