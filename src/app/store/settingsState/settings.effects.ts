import { inject } from '@angular/core';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEventHandlers } from '@ngrx/signals/events';
import { catchError, concatMap, map, of, switchMap, tap } from 'rxjs';
import { settingsEvents } from './settings.events';
import { SettingsState } from './settings.state';
import { SettingsApi } from '../../core/services/settings.api';
import { friendlyHttpError } from '../../core/services/http-error';
import { NotificationService } from '../../../shared/services/notification.service';

export function withSettingsEffects() {
  return signalStoreFeature(
    { state: type<SettingsState>() },
    withEventHandlers(() => {
      const events = inject(Events);
      const api = inject(SettingsApi);
      const notify = inject(NotificationService);

      return {
        load$: events.on(settingsEvents.load).pipe(
          switchMap(() =>
            api.get().pipe(
              map((settings) => settingsEvents.loadSuccess(settings)),
              catchError((err: unknown) =>
                of(settingsEvents.loadFailure(friendlyHttpError(err, 'Could not load settings.'))),
              ),
            ),
          ),
        ),

        update$: events.on(settingsEvents.update).pipe(
          concatMap(({ payload }) =>
            api.update(payload).pipe(
              tap(() => notify.success('Saved', 'Notification channel updated.')),
              map((settings) => settingsEvents.updateSuccess(settings)),
              catchError((err: unknown) => {
                const message = friendlyHttpError(err, 'Could not save settings.');
                notify.error('Settings', message);
                return of(settingsEvents.updateFailure(message));
              }),
            ),
          ),
        ),
      };
    }),
  );
}
