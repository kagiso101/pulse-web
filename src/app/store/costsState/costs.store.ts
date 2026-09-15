import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withCostsEffects } from './costs.effects';
import { withCostsReducer } from './costs.reducer';
import { initialCostsState } from './costs.state';

export const CostsStore = signalStore(
  { providedIn: 'root' },
  withState(initialCostsState),
  withCostsEffects(),
  withCostsReducer(),
  withDevtools('costs-store'),
);
