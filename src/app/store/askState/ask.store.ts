import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withAskEffects } from './ask.effects';
import { withAskReducer } from './ask.reducer';
import { initialAskState } from './ask.state';

export const AskStore = signalStore(
  { providedIn: 'root' },
  withState(initialAskState),
  withAskEffects(),
  withAskReducer(),
  withDevtools('ask-store'),
);
