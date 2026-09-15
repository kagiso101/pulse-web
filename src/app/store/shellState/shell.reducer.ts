import { on, withReducer } from '@ngrx/signals/events';
import { shellEvents } from './shell.events';
import { ShellState } from './shell.state';
import { overviewEvents } from '../overviewState/overview.events';
import { dashboardEvents } from '../dashboardState/dashboard.events';
import { prospectsEvents } from '../prospectsState/prospects.events';
import { costsEvents } from '../costsState/costs.events';
import { deploysEvents } from '../deploysState/deploys.events';

export function withShellReducer() {
  return withReducer<ShellState>(
    on(shellEvents.setRange, ({ payload }) => ({ range: payload })),
    on(shellEvents.selectProject, ({ payload }) => ({ selectedSlug: payload })),
    on(shellEvents.refreshRequested, (_, state) => ({
      refreshing: true,
      refreshTick: state.refreshTick + 1,
    })),
    on(shellEvents.autoRefreshTick, (_, state) => ({ refreshTick: state.refreshTick + 1 })),
    on(shellEvents.snapshotSeen, ({ payload }) => ({ lastSnapshotAt: payload })),

    // The two snapshot-bearing reads stamp "updated n min ago" and settle a refresh.
    on(overviewEvents.loadSuccess, ({ payload }) => ({
      lastSnapshotAt: payload.lastSnapshotAt,
      refreshing: false,
    })),
    on(dashboardEvents.loadSuccess, ({ payload }) => ({
      lastSnapshotAt: payload.dashboard.project.status.lastSnapshotAt,
      refreshing: false,
    })),
    // Any other page load settling also ends the spinner.
    on(
      overviewEvents.loadFailure,
      dashboardEvents.loadFailure,
      prospectsEvents.loadSuccess,
      prospectsEvents.loadFailure,
      costsEvents.loadSuccess,
      costsEvents.loadFailure,
      deploysEvents.loadSuccess,
      deploysEvents.loadFailure,
      () => ({ refreshing: false }),
    ),
  );
}
