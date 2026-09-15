import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { LogOut, LucideAngularModule } from 'lucide-angular';
import { AuthService } from './core/auth/auth.service';
import { AuthFacade } from './store/authState/auth.facade';
import { ActionsFacade } from './store/actionsState/actions.facade';
import { NoticesFacade } from './store/noticesState/notices.facade';
import { ProjectsFacade } from './store/projectsState/projects.facade';
import { SettingsFacade } from './store/settingsState/settings.facade';
import { ShellFacade } from './store/shellState/shell.facade';
import { ProjectPills } from './shell/project-pills/project-pills';
import { RangeToggle } from './shell/range-toggle/range-toggle';
import { RefreshIndicator } from './shell/refresh-indicator/refresh-indicator';
import { NoticesBell } from './shell/notices-bell/notices-bell';
import { BottomNav } from './shell/bottom-nav/bottom-nav';
import { AskBar } from './shell/ask-bar/ask-bar';
import { ConfirmSheet } from '../shared/components/confirm-sheet/confirm-sheet';
import { Toasts } from '../shared/components/toasts/toasts';

/** Routes that render without the authenticated shell. */
const BARE_ROUTES = ['/login', '/view/'];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    LucideAngularModule,
    ProjectPills,
    RangeToggle,
    RefreshIndicator,
    NoticesBell,
    BottomNav,
    AskBar,
    ConfirmSheet,
    Toasts,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  readonly authFacade = inject(AuthFacade);
  readonly shell = inject(ShellFacade);
  readonly actions = inject(ActionsFacade);
  private readonly projects = inject(ProjectsFacade);
  private readonly settings = inject(SettingsFacade);
  private readonly notices = inject(NoticesFacade);

  readonly icons = { logout: LogOut };

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /** The shell is hidden on /login and on the public client view. */
  readonly showShell = computed(() => {
    const url = this.url();
    return !BARE_ROUTES.some((bare) => url.startsWith(bare)) && this.auth.isAuthenticated();
  });

  constructor() {
    // Registry (pills + red dots) and unread notices follow the 60s refresh tick.
    effect(() => {
      if (!this.showShell()) return;
      this.shell.refreshTick();
      this.projects.load();
      this.notices.load();
    });
    // Settings once per shell session — the Ask bar needs anthropicConfigured.
    effect(() => {
      if (this.showShell()) this.settings.load();
    });
  }

  logout(): void {
    this.authFacade.logout();
  }
}
