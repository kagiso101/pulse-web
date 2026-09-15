export type AuthStatus = 'idle' | 'authenticating' | 'authenticated' | 'error';

export interface AuthState {
  email: string | null;
  status: AuthStatus;
  error: string | null;
}

export const initialAuthState: AuthState = {
  email: null,
  status: 'idle',
  error: null,
};
