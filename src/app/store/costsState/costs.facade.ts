import { Injectable, computed, inject } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { ManualCost } from '../../../shared/models/cost.model';
import { costsEvents } from './costs.events';
import { CostsStore } from './costs.store';

@Injectable({ providedIn: 'root' })
export class CostsFacade {
  private readonly store = inject(CostsStore);
  private readonly dispatch = injectDispatch(costsEvents);

  // Selectors
  readonly report = this.store.report;
  readonly month = this.store.month;
  readonly loading = this.store.loading;
  readonly saving = this.store.saving;
  readonly error = this.store.error;
  readonly byProvider = computed(() =>
    [...(this.store.report()?.byProvider ?? [])].sort((a, b) => b.amountCents - a.amountCents),
  );
  readonly trend = computed(() => this.store.report()?.trend ?? []);
  readonly initialLoading = computed(() => this.store.loading() && this.store.report() === null);

  // Methods
  load(month: string | null = null): void {
    this.dispatch.load(month);
  }

  saveManual(body: ManualCost): void {
    this.dispatch.saveManual(body);
  }
}
