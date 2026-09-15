import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Any 401/403 from pulse-api ends the session: clear storage, one toast, land on /login.
 * Exempt: the Google login call itself (its 403 means "not the allow-listed account", reported
 * inline by the login page) and the public client view (its 404/403 are the page's business).
 */
export const sessionExpiryInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  return next(req).pipe(
    catchError((err: unknown) => {
      const exempt = req.url.includes('/api/auth/google') || req.url.includes('/api/public/');
      if (
        !exempt &&
        err instanceof HttpErrorResponse &&
        (err.status === 401 || err.status === 403)
      ) {
        auth.sessionExpired();
      }
      return throwError(() => err);
    }),
  );
};
