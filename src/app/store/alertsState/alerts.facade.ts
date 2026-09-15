import { Injectable, inject } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { AlertRuleUpdate } from '../../../shared/models/alert.model';
import { alertsEvents } from './alerts.events';
import { AlertsStore } from './alerts.store';

@Injectable({ providedIn: 'root' })
export class AlertsFacade {
  private readonly store = inject(AlertsStore);
  private readonly dispatch = injectDispatch(alertsEvents);

  // Selectors
  readonly rules = this.store.rules;
  readonly openEvents = this.store.openEvents;
  readonly loading = this.store.loading;
  readonly saving = this.store.saving;
  readonly acking = this.store.acking;
  readonly error = this.store.error;

  // Methods
  loadRules(): void {
    this.dispatch.loadRules();
  }

  updateRule(id: string, body: AlertRuleUpdate): void {
    this.dispatch.updateRule({ id, body });
  }

  loadOpenEvents(): void {
    this.dispatch.loadOpenEvents();
  }

  ack(id: string): void {
    this.dispatch.ack({ id });
  }
}
