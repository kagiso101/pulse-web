import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withDashboardEffects } from './dashboard.effects';
import { withDashboardReducer } from './dashboard.reducer';
import { initialDashboardState } from './dashboard.state';

export const DashboardStore = signalStore(
  { providedIn: 'root' },
  withState(initialDashboardState),
  withDashboardEffects(),
  withDashboardReducer(),
  withDevtools('dashboard-store'),
);
