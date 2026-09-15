import { Injectable, computed, inject } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { Range } from '../../../shared/models/range.model';
import { overviewEvents } from './overview.events';
import { OverviewStore } from './overview.store';

@Injectable({ providedIn: 'root' })
export class OverviewFacade {
  private readonly store = inject(OverviewStore);
  private readonly dispatch = injectDispatch(overviewEvents);

  // Selectors
  readonly data = this.store.data;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly headline = computed(() => this.store.data()?.headline ?? null);
  readonly projects = computed(() => this.store.data()?.projects ?? []);
  readonly needsYou = computed(() => this.store.data()?.needsYou ?? []);
  readonly summary = computed(() => this.store.data()?.summary ?? null);
  /** First load only — later refreshes keep the numbers on screen. */
  readonly initialLoading = computed(() => this.store.loading() && this.store.data() === null);

  // Methods
  load(range: Range): void {
    this.dispatch.load(range);
  }
}
