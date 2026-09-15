import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withOverviewEffects } from './overview.effects';
import { withOverviewReducer } from './overview.reducer';
import { initialOverviewState } from './overview.state';

export const OverviewStore = signalStore(
  { providedIn: 'root' },
  withState(initialOverviewState),
  withOverviewEffects(),
  withOverviewReducer(),
  withDevtools('overview-store'),
);
