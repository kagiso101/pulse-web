import { inject } from '@angular/core';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEventHandlers } from '@ngrx/signals/events';
import { catchError, concatMap, map, of, switchMap, tap } from 'rxjs';
import { projectsEvents } from './projects.events';
import { ProjectsState } from './projects.state';
import { ProjectsApi } from '../../core/services/projects.api';
import { friendlyHttpError } from '../../core/services/http-error';
import { NotificationService } from '../../../shared/services/notification.service';

export function withProjectsEffects() {
  return signalStoreFeature(
    { state: type<ProjectsState>() },
    withEventHandlers(() => {
      const events = inject(Events);
      const api = inject(ProjectsApi);
      const notify = inject(NotificationService);

      const saveFailure = (fallback: string) => (err: unknown) => {
        const message = friendlyHttpError(err, fallback);
        notify.error('Project not saved', message);
        return of(projectsEvents.saveFailure(message));
      };

      return {
        load$: events.on(projectsEvents.load).pipe(
          switchMap(() =>
            api.list().pipe(
              map((items) => projectsEvents.loadSuccess(items)),
              catchError((err: unknown) =>
                of(projectsEvents.loadFailure(friendlyHttpError(err, 'Could not load projects.'))),
              ),
            ),
          ),
        ),

        create$: events.on(projectsEvents.create).pipe(
          concatMap(({ payload }) =>
            api.create(payload).pipe(
              tap((p) => notify.success('Project added', `${p.name} is in the registry.`)),
              map((p) => projectsEvents.saveSuccess(p)),
              catchError(saveFailure('Could not add the project.')),
            ),
          ),
        ),

        update$: events.on(projectsEvents.update).pipe(
          concatMap(({ payload }) =>
            api.update(payload.id, payload.body).pipe(
              tap((p) => notify.success('Project saved', p.name)),
              map((p) => projectsEvents.saveSuccess(p)),
              catchError(saveFailure('Could not save the project.')),
            ),
          ),
        ),

        deactivate$: events.on(projectsEvents.deactivate).pipe(
          concatMap(({ payload }) =>
            api.deactivate(payload.id).pipe(
              tap(() => notify.info('Project deactivated', 'Its pill is gone; data is kept.')),
              map(() => projectsEvents.deactivateSuccess({ id: payload.id })),
              catchError(saveFailure('Could not deactivate the project.')),
            ),
          ),
        ),

        generateToken$: events.on(projectsEvents.generateToken).pipe(
          concatMap(({ payload }) =>
            api.createClientViewToken(payload.id).pipe(
              map((res) =>
                projectsEvents.generateTokenSuccess({
                  projectId: payload.id,
                  token: res.token,
                  url: res.url,
                }),
              ),
              catchError((err: unknown) => {
                const message = friendlyHttpError(err, 'Could not create the client link.');
                notify.error('Client link', message);
                return of(projectsEvents.tokenFailure(message));
              }),
            ),
          ),
        ),

        revokeToken$: events.on(projectsEvents.revokeToken).pipe(
          concatMap(({ payload }) =>
            api.revokeClientViewToken(payload.id).pipe(
              tap(() => notify.info('Client link revoked', 'The old link no longer works.')),
              map(() => projectsEvents.revokeTokenSuccess({ id: payload.id })),
              catchError((err: unknown) => {
                const message = friendlyHttpError(err, 'Could not revoke the client link.');
                notify.error('Client link', message);
                return of(projectsEvents.tokenFailure(message));
              }),
            ),
          ),
        ),
      };
    }),
  );
}
