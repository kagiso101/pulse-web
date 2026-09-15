import { inject } from '@angular/core';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEventHandlers } from '@ngrx/signals/events';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { noticesEvents } from './notices.events';
import { NoticesState } from './notices.state';
import { NoticesApi } from '../../core/services/notices.api';
import { friendlyHttpError } from '../../core/services/http-error';
import { NotificationService } from '../../../shared/services/notification.service';

export function withNoticesEffects() {
  return signalStoreFeature(
    { state: type<NoticesState>() },
    withEventHandlers(() => {
      const events = inject(Events);
      const api = inject(NoticesApi);
      const notify = inject(NotificationService);

      return {
        load$: events.on(noticesEvents.load).pipe(
          switchMap(() =>
            api.list(true).pipe(
              map((items) => noticesEvents.loadSuccess(items)),
              catchError((err: unknown) =>
                of(noticesEvents.loadFailure(friendlyHttpError(err, 'Could not load notices.'))),
              ),
            ),
          ),
        ),

        markRead$: events.on(noticesEvents.markRead).pipe(
          mergeMap(({ payload }) =>
            api.markRead(payload.id).pipe(
              map(() => noticesEvents.markReadSuccess({ id: payload.id })),
              catchError((err: unknown) => {
                const message = friendlyHttpError(err, 'Could not mark the notice as read.');
                notify.error('Notices', message);
                return of(noticesEvents.markReadFailure(message));
              }),
            ),
          ),
        ),
      };
    }),
  );
}
