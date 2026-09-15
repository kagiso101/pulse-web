import { Range } from './range.model';

/** Contract §2.10 — Ask (read-only AI). */
export interface AskRequest {
  question: string;
  projectSlug?: string | null;
  range?: Range;
}

/** Parsed `text/event-stream` events, in order: many `delta`, then one `done` OR one `error`. */
export type AskStreamEvent =
  | { type: 'delta'; text: string }
  | { type: 'done'; model: string; inputTokens: number; outputTokens: number }
  | { type: 'error'; message: string };

export interface AskExchange {
  question: string;
  answer: string;
  askedAt: string;
}

export const ASK_SUGGESTIONS: readonly string[] = [
  'How did Bookvas do this week?',
  'Which prospects are overdue?',
  "What's the cost trend?",
];
