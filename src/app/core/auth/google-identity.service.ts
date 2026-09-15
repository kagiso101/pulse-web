import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

const GSI_SRC = 'https://accounts.google.com/gsi/client';

/**
 * Loads the Google Identity Services script once and renders the "Sign in with Google" button.
 * The credential (a Google ID token) is handed to the caller, who posts it to
 * `POST /api/auth/google` (contract §1). Nothing else from GIS is used — no One Tap prompt.
 */
@Injectable({ providedIn: 'root' })
export class GoogleIdentityService {
  private loading: Promise<void> | null = null;

  /** Resolves when `window.google.accounts.id` is available. Idempotent. */
  load(): Promise<void> {
    if (window.google?.accounts?.id) return Promise.resolve();
    if (this.loading) return this.loading;
    this.loading = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${GSI_SRC}"]`);
      const script = existing ?? document.createElement('script');
      const done = () => {
        if (window.google?.accounts?.id) resolve();
        else reject(new Error('Google Identity Services did not initialise.'));
      };
      script.addEventListener('load', done, { once: true });
      script.addEventListener(
        'error',
        () => {
          this.loading = null;
          reject(new Error('Could not load the Google sign-in script.'));
        },
        { once: true },
      );
      if (!existing) {
        script.src = GSI_SRC;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      } else if (window.google?.accounts?.id) {
        resolve();
      }
    });
    return this.loading;
  }

  /** Initialises GIS with the environment's client id and renders the dark pill button. */
  async renderButton(
    container: HTMLElement,
    onCredential: (idToken: string) => void,
  ): Promise<void> {
    await this.load();
    const gis = window.google?.accounts.id;
    if (!gis) throw new Error('Google Identity Services unavailable.');
    gis.initialize({
      client_id: environment.googleClientId,
      callback: (response) => {
        if (response?.credential) onCredential(response.credential);
      },
      auto_select: false,
      cancel_on_tap_outside: true,
      ux_mode: 'popup',
      use_fedcm_for_prompt: true,
    });
    container.replaceChildren();
    gis.renderButton(container, {
      type: 'standard',
      theme: 'filled_black',
      size: 'large',
      text: 'signin_with',
      shape: 'pill',
      logo_alignment: 'left',
      width: 320,
    });
  }
}
