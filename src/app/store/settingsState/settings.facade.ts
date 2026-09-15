import { Injectable, computed, inject } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { NotificationChannel } from '../../../shared/models/settings.model';
import { settingsEvents } from './settings.events';
import { SettingsStore } from './settings.store';

@Injectable({ providedIn: 'root' })
export class SettingsFacade {
  private readonly store = inject(SettingsStore);
  private readonly dispatch = injectDispatch(settingsEvents);

  // Selectors
  readonly settings = this.store.settings;
  readonly loading = this.store.loading;
  readonly saving = this.store.saving;
  readonly error = this.store.error;
  /** Ask is disabled only when Settings has been loaded and says Anthropic is not configured. */
  readonly askEnabled = computed(() => this.store.settings()?.anthropicConfigured !== false);

  // Methods
  load(): void {
    this.dispatch.load();
  }

  setNotificationChannel(notificationChannel: NotificationChannel): void {
    this.dispatch.update({ notificationChannel });
  }
}
