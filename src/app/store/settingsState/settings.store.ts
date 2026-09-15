import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withSettingsEffects } from './settings.effects';
import { withSettingsReducer } from './settings.reducer';
import { initialSettingsState } from './settings.state';

export const SettingsStore = signalStore(
  { providedIn: 'root' },
  withState(initialSettingsState),
  withSettingsEffects(),
  withSettingsReducer(),
  withDevtools('settings-store'),
);
