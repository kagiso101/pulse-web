import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { Settings, SettingsUpdate } from '../../../shared/models/settings.model';

export const settingsEvents = eventGroup({
  source: 'Settings',
  events: {
    load: type<void>(),
    loadSuccess: type<Settings>(),
    loadFailure: type<string>(),

    update: type<SettingsUpdate>(),
    updateSuccess: type<Settings>(),
    updateFailure: type<string>(),
  },
});
