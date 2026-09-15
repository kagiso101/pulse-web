import { Injectable, computed, inject } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { Range } from '../../../shared/models/range.model';
import { dashboardEvents } from './dashboard.events';
import { DashboardStore } from './dashboard.store';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private readonly store = inject(DashboardStore);
  private readonly dispatch = injectDispatch(dashboardEvents);

  // Selectors
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly dashboard = computed(() => {
    const key = this.store.currentKey();
    return key ? (this.store.byKey()[key] ?? null) : null;
  });
  readonly initialLoading = computed(() => this.store.loading() && this.dashboard() === null);

  // Methods
  load(slug: string, range: Range): void {
    this.dispatch.load({ slug, range });
  }
}
