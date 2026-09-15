import { AlertEvent, AlertRule } from '../../../shared/models/alert.model';

export interface AlertsState {
  rules: AlertRule[];
  openEvents: AlertEvent[];
  loading: boolean;
  saving: boolean;
  /** Ids currently being acknowledged (per-row spinner). */
  acking: string[];
  error: string | null;
}

export const initialAlertsState: AlertsState = {
  rules: [],
  openEvents: [],
  loading: false,
  saving: false,
  acking: [],
  error: null,
};
