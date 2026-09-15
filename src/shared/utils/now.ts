import { DestroyRef, Signal, inject, signal } from '@angular/core';

/**
 * A `now` signal that ticks every `intervalMs` (default 30s) so "3 min ago" labels stay honest
 * without re-rendering on every second. Call inside an injection context (constructor/field).
 */
export function injectNow(intervalMs = 30_000): Signal<number> {
  const now = signal(Date.now());
  const id = setInterval(() => now.set(Date.now()), intervalMs);
  inject(DestroyRef).onDestroy(() => clearInterval(id));
  return now.asReadonly();
}
