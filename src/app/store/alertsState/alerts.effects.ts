import { inject } from '@angular/core';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEventHandlers } from '@ngrx/signals/events';
import { catchError, concatMap, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { alertsEvents } from './alerts.events';
import { AlertsState } from './alerts.state';
import { AlertsApi } from '../../core/services/alerts.api';
import { friendlyHttpError } from '../../core/services/http-error';
import { NotificationService } from '../../../shared/services/notification.service';

export function withAlertsEffects() {
  return signalStoreFeature(
    { state: type<AlertsState>() },
    withEventHandlers(() => {
      const events = inject(Events);
      const api = inject(AlertsApi);
      const notify = inject(NotificationService);

      return {
        loadRules$: events.on(alertsEvents.loadRules).pipe(
          switchMap(() =>
            api.rules().pipe(
              map((rules) => alertsEvents.loadRulesSuccess(rules)),
              catchError((err: unknown) =>
                of(
                  alertsEvents.loadRulesFailure(
                    friendlyHttpError(err, 'Could not load alert rules.'),
                  ),
                ),
              ),
            ),
          ),
        ),

        updateRule$: events.on(alertsEvents.updateRule).pipe(
          concatMap(({ payload }) =>
            api.updateRule(payload.id, payload.body).pipe(
              map((rule) => alertsEvents.updateRuleSuccess(rule)),
              catchError((err: unknown) => {
                const message = friendlyHttpError(err, 'Could not save the rule.');
                notify.error('Alert rule', message);
                return of(alertsEvents.updateRuleFailure(message));
              }),
            ),
          ),
        ),

        loadOpenEvents$: events.on(alertsEvents.loadOpenEvents).pipe(
          switchMap(() =>
            api.events(true).pipe(
              map((list) => alertsEvents.loadOpenEventsSuccess(list)),
              catchError((err: unknown) =>
                of(
                  alertsEvents.loadOpenEventsFailure(
                    friendlyHttpError(err, 'Could not load alerts.'),
                  ),
                ),
              ),
            ),
          ),
        ),

        ack$: events.on(alertsEvents.ack).pipe(
          mergeMap(({ payload }) =>
            api.ack(payload.id).pipe(
              tap(() => notify.success('Acknowledged', 'Cleared from Needs you.')),
              map((ev) => alertsEvents.ackSuccess(ev)),
              catchError((err: unknown) => {
                const message = friendlyHttpError(err, 'Could not acknowledge the alert.');
                notify.error('Alert', message);
                return of(alertsEvents.ackFailure(message));
              }),
            ),
          ),
        ),
      };
    }),
  );
}
