import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withAlertsEffects } from './alerts.effects';
import { withAlertsReducer } from './alerts.reducer';
import { initialAlertsState } from './alerts.state';

export const AlertsStore = signalStore(
  { providedIn: 'root' },
  withState(initialAlertsState),
  withAlertsEffects(),
  withAlertsReducer(),
  withDevtools('alerts-store'),
);
