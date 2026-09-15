import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withShellEffects } from './shell.effects';
import { withShellReducer } from './shell.reducer';
import { initialShellState } from './shell.state';

export const ShellStore = signalStore(
  { providedIn: 'root' },
  withState(initialShellState),
  withShellEffects(),
  withShellReducer(),
  withDevtools('shell-store'),
);
