import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { GoogleIdentityService } from '../../app/core/auth/google-identity.service';
import { AuthFacade } from '../../app/store/authState/auth.facade';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  readonly auth = inject(AuthFacade);
  private readonly gis = inject(GoogleIdentityService);

  private readonly buttonHost = viewChild.required<ElementRef<HTMLElement>>('gsi');

  /** Set when the Google script itself could not load (offline, blocked, CSP). */
  readonly scriptError = signal<string | null>(null);
  readonly buttonReady = signal(false);

  constructor() {
    afterNextRender(() => {
      if (this.auth.googleClientIdMissing) return;
      this.gis
        .renderButton(this.buttonHost().nativeElement, (idToken) =>
          this.auth.loginWithGoogle(idToken),
        )
        .then(() => this.buttonReady.set(true))
        .catch((err: unknown) =>
          this.scriptError.set(
            err instanceof Error ? err.message : 'Could not load the Google sign-in button.',
          ),
        );
    });
  }
}
