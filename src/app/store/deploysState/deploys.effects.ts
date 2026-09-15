import { inject } from '@angular/core';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEventHandlers } from '@ngrx/signals/events';
import { catchError, map, of, switchMap } from 'rxjs';
import { deploysEvents } from './deploys.events';
import { DeploysState } from './deploys.state';
import { DeploysApi } from '../../core/services/deploys.api';
import { friendlyHttpError } from '../../core/services/http-error';

export function withDeploysEffects() {
  return signalStoreFeature(
    { state: type<DeploysState>() },
    withEventHandlers(() => {
      const events = inject(Events);
      const api = inject(DeploysApi);

      return {
        load$: events.on(deploysEvents.load).pipe(
          switchMap(({ payload }) =>
            api.list(payload.projectId).pipe(
              map((items) => deploysEvents.loadSuccess(items)),
              catchError((err: unknown) =>
                of(deploysEvents.loadFailure(friendlyHttpError(err, 'Could not load deploys.'))),
              ),
            ),
          ),
        ),

        /** Changing the project pill filter reloads the timeline. */
        filter$: events
          .on(deploysEvents.setProjectFilter)
          .pipe(map(({ payload }) => deploysEvents.load({ projectId: payload }))),
      };
    }),
  );
}
