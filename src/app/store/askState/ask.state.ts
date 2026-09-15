import { AskExchange } from '../../../shared/models/ask.model';
import { Range } from '../../../shared/models/range.model';

export type AskStatus = 'idle' | 'streaming' | 'done' | 'error';

export interface AskState {
  question: string;
  /** Streams in delta by delta. Plain text — line breaks only, no markdown. */
  answer: string;
  status: AskStatus;
  error: string | null;
  /** The scope the current answer was asked for. */
  scope: { projectSlug: string | null; range: Range } | null;
  /** Last 5 finished Q&As, newest first, in memory only. */
  history: AskExchange[];
  panelOpen: boolean;
}

export const ASK_HISTORY_LIMIT = 5;

export const initialAskState: AskState = {
  question: '',
  answer: '',
  status: 'idle',
  error: null,
  scope: null,
  history: [],
  panelOpen: false,
};
