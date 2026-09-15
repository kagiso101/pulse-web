import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../../../shared/models/api-error.model';

/**
 * Maps any HTTP failure to one friendly sentence for a `*Failure` event.
 *  - status 0   → the request never reached pulse-api (down, CORS, offline)
 *  - 429        → rate limited (auth 10/min, actions 20/min, ask 10/min)
 *  - 502 / 503  → an upstream connector failed / is not configured
 *  - otherwise  → the server's own `message` when it sent one, else the fallback
 */
export function friendlyHttpError(err: unknown, fallback = 'Something went wrong.'): string {
  if (!(err instanceof HttpErrorResponse)) {
    return err instanceof Error && err.message ? err.message : fallback;
  }
  const serverMessage = extractServerMessage(err);
  switch (err.status) {
    case 0:
      return "Can't reach the Pulse API";
    case 429:
      return 'Slow down a moment';
    case 502:
    case 503:
      return serverMessage
        ? `A connector is unavailable · ${serverMessage}`
        : 'A connector is unavailable';
    case 401:
      return 'Your session has ended — sign in again';
    case 403:
      return serverMessage ?? 'Not allowed';
    case 404:
      return serverMessage ?? 'Not found';
    default:
      return serverMessage ?? fallback;
  }
}

function extractServerMessage(err: HttpErrorResponse): string | null {
  const body = err.error as Partial<ApiError> | string | null | undefined;
  if (body && typeof body === 'object' && typeof body.message === 'string' && body.message) {
    return body.message;
  }
  return null;
}
