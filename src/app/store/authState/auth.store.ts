import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withAuthEffects } from './auth.effects';
import { withAuthReducer } from './auth.reducer';
import { initialAuthState } from './auth.state';

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialAuthState),
  withAuthEffects(),
  withAuthReducer(),
  withDevtools('auth-store'),
);
