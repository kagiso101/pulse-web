import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEventHandlers } from '@ngrx/signals/events';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { authEvents } from './auth.events';
import { AuthState } from './auth.state';
import { AuthApi } from '../../core/services/auth.api';
import { AuthService } from '../../core/auth/auth.service';
import { friendlyHttpError } from '../../core/services/http-error';

export function withAuthEffects() {
  return signalStoreFeature(
    { state: type<AuthState>() },
    withEventHandlers(() => {
      const events = inject(Events);
      const api = inject(AuthApi);
      const auth = inject(AuthService);
      const router = inject(Router);

      return {
        login$: events.on(authEvents.loginWithGoogle).pipe(
          exhaustMap(({ payload }) =>
            api.googleLogin(payload.idToken).pipe(
              tap((response) => {
                auth.saveSession(response);
                router.navigateByUrl('/');
              }),
              map((response) => authEvents.loginSuccess({ response })),
              catchError((err: unknown) => of(authEvents.loginFailure(loginMessage(err)))),
            ),
          ),
        ),

        logout$: events.on(authEvents.logout).pipe(tap(() => auth.logout())),
      };
    }),
  );
}

function loginMessage(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 403) return "That Google account isn't allowed to use Pulse.";
    if (err.status === 401) return "Google couldn't verify that sign-in. Try again.";
  }
  return friendlyHttpError(err, 'Sign-in failed. Try again.');
}
