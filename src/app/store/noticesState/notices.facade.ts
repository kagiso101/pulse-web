import { Injectable, computed, inject } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { noticesEvents } from './notices.events';
import { NoticesStore } from './notices.store';

@Injectable({ providedIn: 'root' })
export class NoticesFacade {
  private readonly store = inject(NoticesStore);
  private readonly dispatch = injectDispatch(noticesEvents);

  // Selectors
  readonly items = this.store.items;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly panelOpen = this.store.panelOpen;
  readonly unreadCount = computed(() => this.store.items().length);

  // Methods
  load(): void {
    this.dispatch.load();
  }

  markRead(id: string): void {
    this.dispatch.markRead({ id });
  }

  setPanelOpen(open: boolean): void {
    this.dispatch.setPanelOpen(open);
  }

  togglePanel(): void {
    this.dispatch.setPanelOpen(!this.store.panelOpen());
  }
}
