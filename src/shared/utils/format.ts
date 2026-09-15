import { NumberUnit } from '../models/overview.model';

/** What the UI shows when a value is null — the contract uses null for "not available". */
export const EM_DASH = '—';

const THIN_SPACE = ' ';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function groupThousands(intPart: string): string {
  return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, THIN_SPACE);
}

/** Counts: thin-space thousands, no decimals. `1234` → "1 234"; null → "—". */
export function formatCount(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return EM_DASH;
  const rounded = Math.round(n);
  const sign = rounded < 0 ? '-' : '';
  return sign + groupThousands(String(Math.abs(rounded)));
}

/** Money in integer cents → "R 1 234,50" (SA style: thin-space thousands, comma decimals). */
export function formatCents(cents: number | null | undefined): string {
  if (cents === null || cents === undefined || !Number.isFinite(cents)) return EM_DASH;
  const rounded = Math.round(cents);
  const sign = rounded < 0 ? '-' : '';
  const abs = Math.abs(rounded);
  const rands = groupThousands(String(Math.floor(abs / 100)));
  const minor = String(abs % 100).padStart(2, '0');
  return `${sign}R${THIN_SPACE}${rands},${minor}`;
}

/** Money without minor units, for compact bars/labels: "R 1 234". */
export function formatRandsWhole(cents: number | null | undefined): string {
  if (cents === null || cents === undefined || !Number.isFinite(cents)) return EM_DASH;
  const rounded = Math.round(cents / 100);
  const sign = rounded < 0 ? '-' : '';
  return `${sign}R${THIN_SPACE}${groupThousands(String(Math.abs(rounded)))}`;
}

/** Percentages: "99,9%". */
export function formatPct(p: number | null | undefined, digits = 1): string {
  if (p === null || p === undefined || !Number.isFinite(p)) return EM_DASH;
  return p.toFixed(digits).replace('.', ',') + '%';
}

/** Latency: "342 ms". */
export function formatMs(ms: number | null | undefined): string {
  if (ms === null || ms === undefined || !Number.isFinite(ms)) return EM_DASH;
  return `${formatCount(ms)}${THIN_SPACE}ms`;
}

/** Contract §2.2 `ProjectCard.numbers[].unit`. */
export function formatByUnit(value: number | null | undefined, unit: NumberUnit): string {
  switch (unit) {
    case 'cents':
      return formatCents(value);
    case 'pct':
      return formatPct(value);
    case 'ms':
      return formatMs(value);
    default:
      return formatCount(value);
  }
}

/** Human relative time from an ISO instant: "just now", "3 min ago", "2 h ago", "yesterday", "5 d ago", else a date. */
export function relativeTime(iso: string | null | undefined, now: number = Date.now()): string {
  if (!iso) return EM_DASH;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return EM_DASH;
  const diff = now - t; // positive = past
  const abs = Math.abs(diff);
  const sec = Math.round(abs / 1000);
  const min = Math.round(abs / 60_000);
  const hrs = Math.round(abs / 3_600_000);
  const days = Math.round(abs / 86_400_000);
  const past = diff >= 0;
  const wrap = (s: string) => (past ? `${s} ago` : `in ${s}`);

  if (sec < 45) return 'just now';
  if (min < 60) return wrap(`${min} min`);
  if (hrs < 24) return wrap(`${hrs} h`);
  if (days === 1) return past ? 'yesterday' : 'tomorrow';
  if (days < 30) return wrap(`${days} d`);
  return formatDate(iso);
}

/** "15 Sep" this year, "15 Sep 2025" otherwise. Accepts ISO instants and YYYY-MM-DD. */
export function formatDate(iso: string | null | undefined, now: number = Date.now()): string {
  if (!iso) return EM_DASH;
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(d.getTime())) return EM_DASH;
  const sameYear = d.getFullYear() === new Date(now).getFullYear();
  return `${d.getDate()} ${MONTHS[d.getMonth()]}${sameYear ? '' : ' ' + d.getFullYear()}`;
}

/** "15 Sep, 07:03" for timelines. */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return EM_DASH;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return EM_DASH;
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${formatDate(iso)}, ${hh}:${mm}`;
}

/** "2026-09" → "Sep 2026". */
export function formatMonth(yyyyMm: string | null | undefined): string {
  if (!yyyyMm || !/^\d{4}-\d{2}$/.test(yyyyMm)) return EM_DASH;
  const [y, m] = yyyyMm.split('-').map(Number);
  return `${MONTHS[(m ?? 1) - 1] ?? '?'} ${y}`;
}

/** Git sha → 7 chars. */
export function shortSha(sha: string | null | undefined): string {
  if (!sha) return EM_DASH;
  return sha.slice(0, 7);
}

/** Current month as YYYY-MM (local time). */
export function currentMonth(now: Date = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/** Today as YYYY-MM-DD (local time). */
export function todayIso(now: Date = new Date()): string {
  return `${currentMonth(now)}-${String(now.getDate()).padStart(2, '0')}`;
}

/** Parse a rand amount typed by a human ("1 234,50", "1234.5", "R 99") into integer cents; null if invalid. */
export function randsToCents(input: string | number | null | undefined): number | null {
  if (input === null || input === undefined) return null;
  if (typeof input === 'number') return Number.isFinite(input) ? Math.round(input * 100) : null;
  const cleaned = input
    .replace(/[Rr\s  ]/g, '')
    .replace(/,/g, '.')
    .trim();
  if (!cleaned || !/^-?\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  return Math.round(parseFloat(cleaned) * 100);
}

/** Drop-off between two funnel steps as a percentage (null when the first step is empty/unknown). */
export function dropoffPct(from: number | null, to: number | null): number | null {
  if (from === null || to === null || from <= 0) return null;
  return Math.max(0, Math.min(100, ((from - to) / from) * 100));
}
