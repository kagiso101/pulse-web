import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withActionsEffects } from './actions.effects';
import { withActionsReducer } from './actions.reducer';
import { initialActionsState } from './actions.state';

export const ActionsStore = signalStore(
  { providedIn: 'root' },
  withState(initialActionsState),
  withActionsEffects(),
  withActionsReducer(),
  withDevtools('actions-store'),
);
