/** Contract §0.6 — the time range every read endpoint accepts (`range=`). */
export type Range = 'today' | '7d' | '30d';

export const RANGES: readonly Range[] = ['today', '7d', '30d'];

export const RANGE_LABELS: Record<Range, string> = {
  today: 'Today',
  '7d': '7d',
  '30d': '30d',
};
