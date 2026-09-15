import { Injectable, computed, inject } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import {
  PROSPECT_STATUSES,
  ProspectNextAction,
  ProspectStatus,
  ProspectUpsert,
} from '../../../shared/models/prospect.model';
import { prospectsEvents } from './prospects.events';
import { ProspectsStore } from './prospects.store';

@Injectable({ providedIn: 'root' })
export class ProspectsFacade {
  private readonly store = inject(ProspectsStore);
  private readonly dispatch = injectDispatch(prospectsEvents);

  // Selectors
  readonly items = this.store.items;
  readonly loaded = this.store.loaded;
  readonly loading = this.store.loading;
  readonly saving = this.store.saving;
  readonly creating = this.store.creating;
  readonly error = this.store.error;
  readonly statusFilter = this.store.statusFilter;
  readonly importing = this.store.importing;
  readonly importResult = this.store.importResult;

  /** Filter chip applied; overdue first, then soonest next action, then most recently touched. */
  readonly filtered = computed(() => {
    const filter = this.store.statusFilter();
    return this.store
      .items()
      .filter((p) => !filter || p.status === filter)
      .sort((a, b) => {
        if (a.overdue !== b.overdue) return a.overdue ? -1 : 1;
        const da = a.nextActionDate ?? '9999';
        const db = b.nextActionDate ?? '9999';
        if (da !== db) return da < db ? -1 : 1;
        return b.updatedAt.localeCompare(a.updatedAt);
      });
  });

  readonly countsByStatus = computed(() => {
    const counts = Object.fromEntries(PROSPECT_STATUSES.map((s) => [s, 0])) as Record<
      ProspectStatus,
      number
    >;
    for (const p of this.store.items()) counts[p.status] = (counts[p.status] ?? 0) + 1;
    return counts;
  });

  readonly overdueCount = computed(() => this.store.items().filter((p) => p.overdue).length);

  // Methods
  load(): void {
    this.dispatch.load();
  }

  setStatusFilter(status: ProspectStatus | null): void {
    this.dispatch.setStatusFilter(status);
  }

  create(body: ProspectUpsert): void {
    this.dispatch.create(body);
  }

  update(id: string, body: ProspectUpsert): void {
    this.dispatch.update({ id, body });
  }

  remove(id: string): void {
    this.dispatch.remove({ id });
  }

  setStatus(id: string, status: ProspectStatus): void {
    this.dispatch.setStatus({ id, status });
  }

  setNextAction(id: string, body: ProspectNextAction): void {
    this.dispatch.setNextAction({ id, body });
  }

  addNote(id: string, note: string): void {
    this.dispatch.addNote({ id, note });
  }

  importCsv(file: File): void {
    this.dispatch.importCsv({ file });
  }

  clearImportResult(): void {
    this.dispatch.clearImportResult();
  }
}
