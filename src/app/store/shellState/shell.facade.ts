import { Injectable, inject } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { Range } from '../../../shared/models/range.model';
import { shellEvents } from './shell.events';
import { ShellStore } from './shell.store';

@Injectable({ providedIn: 'root' })
export class ShellFacade {
  private readonly store = inject(ShellStore);
  private readonly dispatch = injectDispatch(shellEvents);

  // Selectors
  readonly range = this.store.range;
  readonly selectedSlug = this.store.selectedSlug;
  readonly lastSnapshotAt = this.store.lastSnapshotAt;
  readonly refreshing = this.store.refreshing;
  readonly refreshTick = this.store.refreshTick;

  // Methods
  setRange(range: Range): void {
    this.dispatch.setRange(range);
  }

  selectProject(slug: string | null): void {
    this.dispatch.selectProject(slug);
  }

  refresh(): void {
    this.dispatch.refreshRequested();
  }
}
