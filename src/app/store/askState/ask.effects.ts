import { inject } from '@angular/core';
import { signalStoreFeature, type } from '@ngrx/signals';
import { Events, withEventHandlers } from '@ngrx/signals/events';
import { map, switchMap, takeUntil } from 'rxjs';
import { askEvents } from './ask.events';
import { AskState } from './ask.state';
import { AskApi } from '../../core/services/ask.api';
import { AskStreamEvent } from '../../../shared/models/ask.model';

function toEvent(ev: AskStreamEvent) {
  switch (ev.type) {
    case 'delta':
      return askEvents.delta(ev.text);
    case 'done':
      return askEvents.done({
        model: ev.model,
        inputTokens: ev.inputTokens,
        outputTokens: ev.outputTokens,
      });
    case 'error':
      return askEvents.failed(ev.message);
  }
}

export function withAskEffects() {
  return signalStoreFeature(
    { state: type<AskState>() },
    withEventHandlers(() => {
      const events = inject(Events);
      const api = inject(AskApi);

      return {
        /** switchMap: a new question aborts the previous stream; cancel aborts it too. */
        ask$: events.on(askEvents.ask).pipe(
          switchMap(({ payload }) =>
            api
              .ask({
                question: payload.question,
                projectSlug: payload.projectSlug,
                range: payload.range,
              })
              .pipe(takeUntil(events.on(askEvents.cancel)), map(toEvent)),
          ),
        ),
      };
    }),
  );
}
