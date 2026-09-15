import { Injectable, signal } from '@angular/core';

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  severity: ToastSeverity;
  summary: string;
  detail?: string;
  duration: number;
}

/** Signal-backed toast queue (same shape as bookr-admin's NotificationService). */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly messages = signal<Toast[]>([]);
  private nextId = 0;

  readonly toasts = this.messages.asReadonly();

  show(message: Omit<Toast, 'id' | 'duration'> & { duration?: number }): void {
    const id = this.nextId++;
    const toast: Toast = { ...message, id, duration: message.duration ?? 5000 };
    this.messages.update((prev) => [...prev, toast]);
    if (toast.duration > 0) {
      setTimeout(() => this.remove(id), toast.duration);
    }
  }

  success(summary: string, detail?: string, duration?: number): void {
    this.show({ severity: 'success', summary, detail, duration });
  }

  error(summary: string, detail?: string, duration?: number): void {
    this.show({ severity: 'error', summary, detail, duration: duration ?? 8000 });
  }

  warning(summary: string, detail?: string, duration?: number): void {
    this.show({ severity: 'warning', summary, detail, duration });
  }

  info(summary: string, detail?: string, duration?: number): void {
    this.show({ severity: 'info', summary, detail, duration });
  }

  remove(id: number): void {
    this.messages.update((prev) => prev.filter((m) => m.id !== id));
  }

  clear(): void {
    this.messages.set([]);
  }
}
