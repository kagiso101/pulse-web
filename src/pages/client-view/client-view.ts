import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { ClientView } from '../../shared/models/client-view.model';
import { formatDateTime, formatPct } from '../../shared/utils/format';
import { RankedList, RankedRow } from '../../shared/components/ranked-list/ranked-list';
import { StatusDot } from '../../shared/components/status-dot/status-dot';
import { TrafficChart } from '../../shared/components/traffic-chart/traffic-chart';
import { ClientViewApi } from '../../app/core/services/client-view.api';
import { friendlyHttpError } from '../../app/core/services/http-error';

type ViewState =
  | { status: 'loading' }
  | { status: 'ok'; view: ClientView }
  | { status: 'notfound' }
  | { status: 'error'; message: string };

/**
 * Public, read-only client card (contract §3). No shell, no auth. This is the one page that
 * talks to an API service directly: it has no store because nothing else in the app reads it.
 */
@Component({
  selector: 'app-client-view',
  standalone: true,
  imports: [StatusDot, TrafficChart, RankedList],
  templateUrl: './client-view.html',
  styleUrl: './client-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientViewPage {
  readonly token = input.required<string>();

  private readonly api = inject(ClientViewApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly state = signal<ViewState>({ status: 'loading' });

  readonly view = computed(() => {
    const s = this.state();
    return s.status === 'ok' ? s.view : null;
  });
  readonly uptime = computed(() => formatPct(this.view()?.uptimePct30d ?? null, 2));
  readonly generatedAt = computed(() => formatDateTime(this.view()?.generatedAt ?? null));
  readonly topPages = computed<RankedRow[]>(() =>
    (this.view()?.traffic?.topPages ?? []).map((p) => ({ label: p.path, value: p.views })),
  );

  constructor() {
    effect(() => {
      const token = this.token();
      untracked(() => this.load(token));
    });
  }

  private load(token: string): void {
    this.state.set({ status: 'loading' });
    this.api
      .get(token)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (view) => this.state.set({ status: 'ok', view }),
        error: (err: unknown) =>
          this.state.set(
            err instanceof HttpErrorResponse && err.status === 404
              ? { status: 'notfound' }
              : { status: 'error', message: friendlyHttpError(err, 'Could not load this view.') },
          ),
      });
  }

  hostOf(url: string): string {
    try {
      return new URL(url).host;
    } catch {
      return url;
    }
  }
}
