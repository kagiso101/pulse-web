import { inject } from '@angular/core';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEventHandlers } from '@ngrx/signals/events';
import { catchError, concatMap, map, of, switchMap, tap } from 'rxjs';
import { costsEvents } from './costs.events';
import { CostsState } from './costs.state';
import { CostsApi } from '../../core/services/costs.api';
import { friendlyHttpError } from '../../core/services/http-error';
import { NotificationService } from '../../../shared/services/notification.service';
import { formatCents, formatMonth } from '../../../shared/utils/format';
import { PROVIDER_LABELS } from '../../../shared/models/cost.model';

export function withCostsEffects() {
  return signalStoreFeature(
    { state: type<CostsState>() },
    withEventHandlers(() => {
      const events = inject(Events);
      const api = inject(CostsApi);
      const notify = inject(NotificationService);

      return {
        load$: events.on(costsEvents.load).pipe(
          switchMap(({ payload }) =>
            api.get(payload).pipe(
              map((report) => costsEvents.loadSuccess(report)),
              catchError((err: unknown) =>
                of(costsEvents.loadFailure(friendlyHttpError(err, 'Could not load costs.'))),
              ),
            ),
          ),
        ),

        saveManual$: events.on(costsEvents.saveManual).pipe(
          concatMap(({ payload }) =>
            api.putManual(payload).pipe(
              tap(() =>
                notify.success(
                  'Cost saved',
                  `${PROVIDER_LABELS[payload.provider]} · ${formatMonth(payload.month)} · ${formatCents(payload.amountCents)}`,
                ),
              ),
              map((report) => costsEvents.saveManualSuccess(report)),
              catchError((err: unknown) => {
                const message = friendlyHttpError(err, 'Could not save the cost entry.');
                notify.error('Cost entry', message);
                return of(costsEvents.saveManualFailure(message));
              }),
            ),
          ),
        ),
      };
    }),
  );
}
