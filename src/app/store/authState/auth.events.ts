import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { AuthResponse } from '../../../shared/models/auth.model';

export const authEvents = eventGroup({
  source: 'Auth',
  events: {
    /** A Google ID token arrived from the GIS button callback. */
    loginWithGoogle: type<{ idToken: string }>(),
    loginSuccess: type<{ response: AuthResponse }>(),
    loginFailure: type<string>(),
    logout: type<void>(),
    resetAuthStatus: type<void>(),
  },
});
