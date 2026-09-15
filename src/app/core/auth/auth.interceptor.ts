import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

/** Adds `Authorization: Bearer <pulse JWT>` to every pulse-api request (and nowhere else). */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isPulseApi = req.url.startsWith(environment.apiBaseUrl) || req.url.startsWith('/api/');
  const token = isPulseApi ? inject(AuthService).token() : null;
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
