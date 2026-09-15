import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { Range } from '../../../shared/models/range.model';

export const askEvents = eventGroup({
  source: 'Ask',
  events: {
    ask: type<{ question: string; projectSlug: string | null; range: Range }>(),
    delta: type<string>(),
    done: type<{ model: string; inputTokens: number; outputTokens: number }>(),
    failed: type<string>(),
    cancel: type<void>(),
    setPanelOpen: type<boolean>(),
    clear: type<void>(),
  },
});
