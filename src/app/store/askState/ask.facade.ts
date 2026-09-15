import { Injectable, computed, inject } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { Range } from '../../../shared/models/range.model';
import { askEvents } from './ask.events';
import { AskStore } from './ask.store';

@Injectable({ providedIn: 'root' })
export class AskFacade {
  private readonly store = inject(AskStore);
  private readonly dispatch = injectDispatch(askEvents);

  // Selectors
  readonly question = this.store.question;
  readonly answer = this.store.answer;
  readonly status = this.store.status;
  readonly error = this.store.error;
  readonly scope = this.store.scope;
  readonly history = this.store.history;
  readonly panelOpen = this.store.panelOpen;
  readonly isStreaming = computed(() => this.store.status() === 'streaming');
  readonly hasContent = computed(
    () => this.store.status() !== 'idle' || this.store.history().length > 0,
  );

  // Methods
  ask(question: string, projectSlug: string | null, range: Range): void {
    const trimmed = question.trim();
    if (!trimmed) return;
    this.dispatch.ask({ question: trimmed, projectSlug, range });
  }

  cancel(): void {
    this.dispatch.cancel();
  }

  setPanelOpen(open: boolean): void {
    this.dispatch.setPanelOpen(open);
  }

  togglePanel(): void {
    this.dispatch.setPanelOpen(!this.store.panelOpen());
  }

  clear(): void {
    this.dispatch.clear();
  }
}
