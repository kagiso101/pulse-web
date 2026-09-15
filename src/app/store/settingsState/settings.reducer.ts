import { on, withReducer } from '@ngrx/signals/events';
import { settingsEvents } from './settings.events';
import { SettingsState } from './settings.state';

export function withSettingsReducer() {
  return withReducer<SettingsState>(
    on(settingsEvents.load, () => ({ loading: true, error: null })),
    on(settingsEvents.loadSuccess, ({ payload }) => ({ settings: payload, loading: false })),
    on(settingsEvents.loadFailure, ({ payload }) => ({ loading: false, error: payload })),

    on(settingsEvents.update, () => ({ saving: true, error: null })),
    on(settingsEvents.updateSuccess, ({ payload }) => ({ settings: payload, saving: false })),
    on(settingsEvents.updateFailure, ({ payload }) => ({ saving: false, error: payload })),
  );
}
