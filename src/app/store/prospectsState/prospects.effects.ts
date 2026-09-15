import { inject } from '@angular/core';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEventHandlers } from '@ngrx/signals/events';
import {
  Observable,
  catchError,
  concatMap,
  exhaustMap,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { prospectsEvents } from './prospects.events';
import { ProspectsState } from './prospects.state';
import { ProspectsApi } from '../../core/services/prospects.api';
import { friendlyHttpError } from '../../core/services/http-error';
import { NotificationService } from '../../../shared/services/notification.service';
import { Prospect } from '../../../shared/models/prospect.model';

export function withProspectsEffects() {
  return signalStoreFeature(
    { state: type<ProspectsState>() },
    withEventHandlers(() => {
      const events = inject(Events);
      const api = inject(ProspectsApi);
      const notify = inject(NotificationService);

      /** Shared tail for every single-row mutation: map to saveSuccess, or a toasted saveFailure. */
      const save = (call: Observable<Prospect>, fallback: string) =>
        call.pipe(
          map((p) => prospectsEvents.saveSuccess(p)),
          catchError((err: unknown) => {
            const message = friendlyHttpError(err, fallback);
            notify.error('Prospect', message);
            return of(prospectsEvents.saveFailure(message));
          }),
        );

      return {
        load$: events.on(prospectsEvents.load).pipe(
          switchMap(() =>
            api.list().pipe(
              map((items) => prospectsEvents.loadSuccess(items)),
              catchError((err: unknown) =>
                of(
                  prospectsEvents.loadFailure(friendlyHttpError(err, 'Could not load prospects.')),
                ),
              ),
            ),
          ),
        ),

        create$: events
          .on(prospectsEvents.create)
          .pipe(
            concatMap(({ payload }) =>
              save(
                api.create(payload).pipe(tap((p) => notify.success('Prospect added', p.name))),
                'Could not add the prospect.',
              ),
            ),
          ),

        update$: events
          .on(prospectsEvents.update)
          .pipe(
            mergeMap(({ payload }) =>
              save(api.update(payload.id, payload.body), 'Could not save the prospect.'),
            ),
          ),

        remove$: events.on(prospectsEvents.remove).pipe(
          mergeMap(({ payload }) =>
            api.remove(payload.id).pipe(
              tap(() => notify.info('Prospect removed')),
              map(() => prospectsEvents.removeSuccess({ id: payload.id })),
              catchError((err: unknown) => {
                const message = friendlyHttpError(err, 'Could not remove the prospect.');
                notify.error('Prospect', message);
                return of(prospectsEvents.saveFailure(message));
              }),
            ),
          ),
        ),

        setStatus$: events
          .on(prospectsEvents.setStatus)
          .pipe(
            mergeMap(({ payload }) =>
              save(api.setStatus(payload.id, payload.status), 'Could not change the status.'),
            ),
          ),

        setNextAction$: events
          .on(prospectsEvents.setNextAction)
          .pipe(
            mergeMap(({ payload }) =>
              save(api.setNextAction(payload.id, payload.body), 'Could not save the next action.'),
            ),
          ),

        addNote$: events
          .on(prospectsEvents.addNote)
          .pipe(
            mergeMap(({ payload }) =>
              save(api.addNote(payload.id, payload.note), 'Could not add the note.'),
            ),
          ),

        importCsv$: events.on(prospectsEvents.importCsv).pipe(
          exhaustMap(({ payload }) =>
            api.importCsv(payload.file).pipe(
              tap((r) =>
                notify.success('CSV imported', `${r.imported} imported, ${r.skipped} skipped.`),
              ),
              // report the result, then reload the list
              mergeMap((r) => of(prospectsEvents.importSuccess(r), prospectsEvents.load())),
              catchError((err: unknown) => {
                const message = friendlyHttpError(err, 'Could not import the CSV.');
                notify.error('CSV import', message);
                return of(prospectsEvents.importFailure(message));
              }),
            ),
          ),
        ),
      };
    }),
  );
}
