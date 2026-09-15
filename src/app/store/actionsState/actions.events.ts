import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { ActionLog, ActionResult, PendingAction } from '../../../shared/models/action.model';

export const actionsEvents = eventGroup({
  source: 'Actions',
  events: {
    /** Opens the ConfirmSheet with the plain-language sentence. */
    request: type<PendingAction>(),
    cancel: type<void>(),
    /** The user pressed Confirm — the effect posts `{ confirm: true }`. */
    confirm: type<void>(),
    /** The API answered (result may be 'ok' or 'failed' — both are shown, never hidden). */
    completed: type<ActionResult>(),
    /** The HTTP call itself failed (network, 429, 5xx). */
    failed: type<string>(),
    /** Closes the sheet after a result has been read. */
    dismiss: type<void>(),

    loadLog: type<void>(),
    loadLogSuccess: type<ActionLog[]>(),
    loadLogFailure: type<string>(),
  },
});
