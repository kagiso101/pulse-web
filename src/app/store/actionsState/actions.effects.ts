import { inject } from '@angular/core';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEventHandlers } from '@ngrx/signals/events';
import { EMPTY, Observable, catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { actionsEvents } from './actions.events';
import { ActionsState } from './actions.state';
import { ActionsApi } from '../../core/services/actions.api';
import { friendlyHttpError } from '../../core/services/http-error';
import { ActionResult, PendingAction } from '../../../shared/models/action.model';

export function withActionsEffects() {
  return signalStoreFeature(
    { state: type<ActionsState>() },
    withEventHandlers((store) => {
      const events = inject(Events);
      const api = inject(ActionsApi);

      const call = (action: PendingAction): Observable<ActionResult> => {
        switch (action.kind) {
          case 'extend-grace':
            return api.extendGrace(action.subscriptionId, action.days);
          case 'comp-period':
            return api.compPeriod(action.subscriptionId, action.days);
          case 'toggle-founder':
            return api.toggleFounder(action.tenantId);
          case 'cloud-run-restart':
            return api.restartCloudRun(action.service);
          case 'netlify-redeploy':
            return api.redeployNetlify(action.siteId);
        }
      };

      return {
        /** Confirm posts `{ confirm: true }` for whatever is pending. exhaustMap: one at a time. */
        confirm$: events.on(actionsEvents.confirm).pipe(
          exhaustMap(() => {
            const pending = store.pending();
            if (!pending) return EMPTY;
            return call(pending).pipe(
              map((result) => actionsEvents.completed(result)),
              catchError((err: unknown) =>
                of(actionsEvents.failed(friendlyHttpError(err, 'The action could not be sent.'))),
              ),
            );
          }),
        ),

        loadLog$: events.on(actionsEvents.loadLog).pipe(
          switchMap(() =>
            api.log().pipe(
              map((log) => actionsEvents.loadLogSuccess(log)),
              catchError((err: unknown) =>
                of(
                  actionsEvents.loadLogFailure(
                    friendlyHttpError(err, 'Could not load the action log.'),
                  ),
                ),
              ),
            ),
          ),
        ),
      };
    }),
  );
}
