import { Injectable, computed, inject } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { deploysEvents } from './deploys.events';
import { DeploysStore } from './deploys.store';

@Injectable({ providedIn: 'root' })
export class DeploysFacade {
  private readonly store = inject(DeploysStore);
  private readonly dispatch = injectDispatch(deploysEvents);

  // Selectors
  readonly items = this.store.items;
  readonly projectId = this.store.projectId;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly initialLoading = computed(() => this.store.loading() && this.store.items().length === 0);

  // Methods
  load(projectId: string | null = null): void {
    this.dispatch.load({ projectId });
  }

  setProjectFilter(projectId: string | null): void {
    this.dispatch.setProjectFilter(projectId);
  }
}
