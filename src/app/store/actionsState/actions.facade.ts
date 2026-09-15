import { Injectable, computed, inject } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { PendingAction } from '../../../shared/models/action.model';
import { actionsEvents } from './actions.events';
import { ActionsStore } from './actions.store';

@Injectable({ providedIn: 'root' })
export class ActionsFacade {
  private readonly store = inject(ActionsStore);
  private readonly dispatch = injectDispatch(actionsEvents);

  // Selectors
  readonly pending = this.store.pending;
  readonly busy = this.store.busy;
  readonly lastResult = this.store.lastResult;
  readonly error = this.store.error;
  readonly log = this.store.log;
  readonly logLoading = this.store.logLoading;
  readonly isOpen = computed(() => this.store.pending() !== null);

  // Methods
  /** Opens the confirm sheet. Nothing is sent until confirm(). */
  request(action: PendingAction): void {
    this.dispatch.request(action);
  }

  confirm(): void {
    this.dispatch.confirm();
  }

  cancel(): void {
    this.dispatch.cancel();
  }

  dismiss(): void {
    this.dispatch.dismiss();
  }

  loadLog(): void {
    this.dispatch.loadLog();
  }
}
