import { ActionLog, ActionResult, PendingAction } from '../../../shared/models/action.model';

export interface ActionsState {
  pending: PendingAction | null;
  busy: boolean;
  lastResult: ActionResult | null;
  error: string | null;
  log: ActionLog[];
  logLoading: boolean;
}

export const initialActionsState: ActionsState = {
  pending: null,
  busy: false,
  lastResult: null,
  error: null,
  log: [],
  logLoading: false,
};
