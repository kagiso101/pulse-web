import { inject } from '@angular/core';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEventHandlers } from '@ngrx/signals/events';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { dashboardEvents } from './dashboard.events';
import { dashboardKey, DashboardState, parseDashboardKey } from './dashboard.state';
import { DashboardApi } from '../../core/services/dashboard.api';
import { friendlyHttpError } from '../../core/services/http-error';
import { actionsEvents } from '../actionsState/actions.events';

export function withDashboardEffects() {
  return signalStoreFeature(
    { state: type<DashboardState>() },
    withEventHandlers((store) => {
      const events = inject(Events);
      const api = inject(DashboardApi);

      return {
        load$: events.on(dashboardEvents.load).pipe(
          switchMap(({ payload }) => {
            const key = dashboardKey(payload.slug, payload.range);
            return api.get(payload.slug, payload.range).pipe(
              map((dashboard) => dashboardEvents.loadSuccess({ key, dashboard })),
              catchError((err: unknown) =>
                of(
                  dashboardEvents.loadFailure({
                    key,
                    message: friendlyHttpError(err, 'Could not load this project.'),
                  }),
                ),
              ),
            );
          }),
        ),

        /** A successful action (grace, comp, founder, restart, redeploy) refreshes the open dashboard. */
        reloadAfterAction$: events.on(actionsEvents.completed).pipe(
          filter(({ payload }) => payload.result === 'ok'),
          map(() => store.currentKey()),
          filter((key): key is string => key !== null),
          map((key) => parseDashboardKey(key)),
          filter((parsed): parsed is { slug: string; range: 'today' | '7d' | '30d' } => !!parsed),
          map((parsed) => dashboardEvents.load(parsed)),
        ),
      };
    }),
  );
}
