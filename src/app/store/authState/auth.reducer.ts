import { on, withReducer } from '@ngrx/signals/events';
import { authEvents } from './auth.events';
import { AuthState } from './auth.state';

export function withAuthReducer() {
  return withReducer<AuthState>(
    on(authEvents.loginWithGoogle, () => ({ status: 'authenticating', error: null })),
    on(authEvents.loginSuccess, ({ payload }) => ({
      email: payload.response.email,
      status: 'authenticated',
      error: null,
    })),
    on(authEvents.loginFailure, ({ payload }) => ({ status: 'error', error: payload })),
    on(authEvents.logout, () => ({ email: null, status: 'idle', error: null })),
    on(authEvents.resetAuthStatus, () => ({ status: 'idle', error: null })),
  );
}
