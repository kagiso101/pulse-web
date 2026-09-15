import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withNoticesEffects } from './notices.effects';
import { withNoticesReducer } from './notices.reducer';
import { initialNoticesState } from './notices.state';

export const NoticesStore = signalStore(
  { providedIn: 'root' },
  withState(initialNoticesState),
  withNoticesEffects(),
  withNoticesReducer(),
  withDevtools('notices-store'),
);
