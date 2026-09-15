import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withDeploysEffects } from './deploys.effects';
import { withDeploysReducer } from './deploys.reducer';
import { initialDeploysState } from './deploys.state';

export const DeploysStore = signalStore(
  { providedIn: 'root' },
  withState(initialDeploysState),
  withDeploysEffects(),
  withDeploysReducer(),
  withDevtools('deploys-store'),
);
