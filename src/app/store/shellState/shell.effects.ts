import { inject } from '@angular/core';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEventHandlers } from '@ngrx/signals/events';
import { filter, fromEvent, interval, map, merge, tap } from 'rxjs';
import { shellEvents } from './shell.events';
import { RANGE_STORAGE_KEY, ShellState } from './shell.state';

const REFRESH_MS = 60_000;

const isVisible = () => typeof document === 'undefined' || document.visibilityState === 'visible';

export function withShellEffects() {
  return signalStoreFeature(
    { state: type<ShellState>() },
    withEventHandlers(() => {
      const events = inject(Events);

      const timer$ = interval(REFRESH_MS).pipe(filter(isVisible));
      const becameVisible$ =
        typeof document === 'undefined'
          ? interval(REFRESH_MS).pipe(filter(() => false))
          : fromEvent(document, 'visibilitychange').pipe(filter(isVisible));

      return {
        persistRange$: events.on(shellEvents.setRange).pipe(
          tap(({ payload }) => {
            try {
              localStorage.setItem(RANGE_STORAGE_KEY, payload);
            } catch {
              /* storage blocked — the range simply won't persist */
            }
          }),
        ),

        /** Refetch every 60s while the tab is visible, and as soon as it becomes visible again. */
        autoRefresh$: merge(timer$, becameVisible$).pipe(map(() => shellEvents.autoRefreshTick())),
      };
    }),
  );
}
