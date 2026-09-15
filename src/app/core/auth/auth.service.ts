import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';
import { AuthResponse } from '../../../shared/models/auth.model';
import { environment } from '../../../environments/environment';

export const TOKEN_KEY = 'pulse_token';
export const EMAIL_KEY = 'pulse_email';
export const GOOGLE_CLIENT_ID_PLACEHOLDER = 'REPLACE_WITH_GOOGLE_CLIENT_ID';

/**
 * Session storage + JWT expiry check. The Google sign-in itself lives in GoogleIdentityService
 * and the auth store; this service is what guards and interceptors talk to.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  readonly email = signal<string | null>(readStorage(EMAIL_KEY));

  /** Prevents toast spam when several in-flight requests 401 together (60s poll). */
  private expiring = false;

  /** True when the Google OAuth client id has not been set in the environment file yet. */
  readonly googleClientIdMissing =
    !environment.googleClientId || environment.googleClientId === GOOGLE_CLIENT_ID_PLACEHOLDER;

  saveSession(res: AuthResponse): void {
    writeStorage(TOKEN_KEY, res.token);
    writeStorage(EMAIL_KEY, res.email);
    this.email.set(res.email);
    this.expiring = false;
  }

  token(): string | null {
    return readStorage(TOKEN_KEY);
  }

  /** Client-side check of the JWT `exp` claim — the server is still the authority. */
  isAuthenticated(): boolean {
    const payload = this.tokenPayload();
    return !!payload && typeof payload['exp'] === 'number' && payload['exp'] * 1000 > Date.now();
  }

  clearSession(): void {
    removeStorage(TOKEN_KEY);
    removeStorage(EMAIL_KEY);
    this.email.set(null);
  }

  logout(): void {
    this.clearSession();
    window.google?.accounts.id.disableAutoSelect();
    this.router.navigate(['/login']);
  }

  /**
   * A 401/403 arrived mid-session: clear the session, land on /login, show exactly ONE toast.
   * Later 401s during the redirect are silenced.
   */
  sessionExpired(): void {
    if (this.expiring) return;
    this.expiring = true;
    const hadSession = !!this.token();
    this.clearSession();
    if (hadSession) {
      this.notification.warning('Session ended', 'Please sign in again.');
    }
    this.router.navigate(['/login']);
  }

  private tokenPayload(): Record<string, unknown> | null {
    const token = this.token();
    if (!token) return null;
    try {
      const part = token.split('.')[1] ?? '';
      return JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/'))) as Record<
        string,
        unknown
      >;
    } catch {
      return null;
    }
  }
}

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode / blocked storage — the session simply won't persist */
  }
}
function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
