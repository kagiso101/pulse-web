import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withProspectsEffects } from './prospects.effects';
import { withProspectsReducer } from './prospects.reducer';
import { initialProspectsState } from './prospects.state';

export const ProspectsStore = signalStore(
  { providedIn: 'root' },
  withState(initialProspectsState),
  withProspectsEffects(),
  withProspectsReducer(),
  withDevtools('prospects-store'),
);
