import { inject } from '@angular/core';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEventHandlers } from '@ngrx/signals/events';
import { catchError, map, of, switchMap } from 'rxjs';
import { overviewEvents } from './overview.events';
import { OverviewState } from './overview.state';
import { OverviewApi } from '../../core/services/overview.api';
import { friendlyHttpError } from '../../core/services/http-error';

export function withOverviewEffects() {
  return signalStoreFeature(
    { state: type<OverviewState>() },
    withEventHandlers(() => {
      const events = inject(Events);
      const api = inject(OverviewApi);

      return {
        load$: events.on(overviewEvents.load).pipe(
          switchMap(({ payload }) =>
            api.get(payload).pipe(
              map((overview) => overviewEvents.loadSuccess(overview)),
              catchError((err: unknown) =>
                of(
                  overviewEvents.loadFailure(
                    friendlyHttpError(err, 'Could not load the overview.'),
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
