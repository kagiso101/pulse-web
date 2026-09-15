import { Injectable, computed, inject } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { authEvents } from './auth.events';
import { AuthStore } from './auth.store';
import { AuthService } from '../../core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly store = inject(AuthStore);
  private readonly auth = inject(AuthService);
  private readonly dispatch = injectDispatch(authEvents);

  // Selectors
  readonly status = this.store.status;
  readonly error = this.store.error;
  readonly isAuthenticating = computed(() => this.store.status() === 'authenticating');
  /** The signed-in email — from the store after login, from storage on a fresh load. */
  readonly email = computed(() => this.store.email() ?? this.auth.email());
  readonly googleClientIdMissing = this.auth.googleClientIdMissing;

  // Methods
  loginWithGoogle(idToken: string): void {
    this.dispatch.loginWithGoogle({ idToken });
  }

  logout(): void {
    this.dispatch.logout();
  }

  resetStatus(): void {
    this.dispatch.resetAuthStatus();
  }
}
