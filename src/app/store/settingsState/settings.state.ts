import { Settings } from '../../../shared/models/settings.model';

export interface SettingsState {
  settings: Settings | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialSettingsState: SettingsState = {
  settings: null,
  loading: false,
  saving: false,
  error: null,
};
