import { describe, expect, it } from 'vitest';
import {
  dropoffPct,
  EM_DASH,
  formatByUnit,
  formatCents,
  formatCount,
  formatMonth,
  formatPct,
  randsToCents,
  relativeTime,
  shortSha,
} from './format';

const THIN = ' ';

describe('formatCount', () => {
  it('groups thousands with a thin space', () => {
    expect(formatCount(1234)).toBe(`1${THIN}234`);
    expect(formatCount(1234567)).toBe(`1${THIN}234${THIN}567`);
  });
  it('leaves small numbers alone', () => {
    expect(formatCount(0)).toBe('0');
    expect(formatCount(999)).toBe('999');
  });
  it('renders null as an em dash', () => {
    expect(formatCount(null)).toBe(EM_DASH);
    expect(formatCount(undefined)).toBe(EM_DASH);
  });
  it('rounds and keeps the sign', () => {
    expect(formatCount(-1500.4)).toBe(`-1${THIN}500`);
  });
});

describe('formatCents', () => {
  it('formats cents as rands with comma decimals', () => {
    expect(formatCents(123450)).toBe(`R${THIN}1${THIN}234,50`);
  });
  it('pads minor units', () => {
    expect(formatCents(5)).toBe(`R${THIN}0,05`);
    expect(formatCents(100)).toBe(`R${THIN}1,00`);
  });
  it('handles zero and null', () => {
    expect(formatCents(0)).toBe(`R${THIN}0,00`);
    expect(formatCents(null)).toBe(EM_DASH);
  });
  it('keeps negatives', () => {
    expect(formatCents(-250)).toBe(`-R${THIN}2,50`);
  });
});

describe('formatPct / formatByUnit', () => {
  it('uses a comma decimal', () => {
    expect(formatPct(99.94)).toBe('99,9%');
    expect(formatPct(100)).toBe('100,0%');
    expect(formatPct(null)).toBe(EM_DASH);
  });
  it('dispatches on unit', () => {
    expect(formatByUnit(2000, 'count')).toBe(`2${THIN}000`);
    expect(formatByUnit(2000, 'cents')).toBe(`R${THIN}20,00`);
    expect(formatByUnit(50, 'pct')).toBe('50,0%');
    expect(formatByUnit(342, 'ms')).toBe(`342${THIN}ms`);
    expect(formatByUnit(null, 'ms')).toBe(EM_DASH);
  });
});

describe('relativeTime', () => {
  const now = Date.parse('2026-09-15T10:00:00Z');
  const at = (iso: string) => relativeTime(iso, now);

  it('says just now inside 45 seconds', () => {
    expect(at('2026-09-15T09:59:40Z')).toBe('just now');
  });
  it('counts minutes and hours', () => {
    expect(at('2026-09-15T09:57:00Z')).toBe('3 min ago');
    expect(at('2026-09-15T08:00:00Z')).toBe('2 h ago');
  });
  it('says yesterday and days', () => {
    expect(at('2026-09-14T10:00:00Z')).toBe('yesterday');
    expect(at('2026-09-10T10:00:00Z')).toBe('5 d ago');
  });
  it('falls back to a date after a month', () => {
    expect(at('2026-07-01T10:00:00Z')).toBe('1 Jul');
    expect(at('2025-07-01T10:00:00Z')).toBe('1 Jul 2025');
  });
  it('handles the future and bad input', () => {
    expect(at('2026-09-15T10:05:00Z')).toBe('in 5 min');
    expect(relativeTime(null)).toBe(EM_DASH);
    expect(relativeTime('nope')).toBe(EM_DASH);
  });
});

describe('small helpers', () => {
  it('shortSha takes 7 chars', () => {
    expect(shortSha('abcdef1234567')).toBe('abcdef1');
    expect(shortSha(null)).toBe(EM_DASH);
  });
  it('formatMonth reads YYYY-MM', () => {
    expect(formatMonth('2026-09')).toBe('Sep 2026');
    expect(formatMonth('bad')).toBe(EM_DASH);
  });
  it('randsToCents parses human input', () => {
    expect(randsToCents('1 234,50')).toBe(123450);
    expect(randsToCents('R 99')).toBe(9900);
    expect(randsToCents('12.5')).toBe(1250);
    expect(randsToCents(3)).toBe(300);
    expect(randsToCents('abc')).toBeNull();
    expect(randsToCents('')).toBeNull();
  });
  it('dropoffPct clamps and guards', () => {
    expect(dropoffPct(100, 25)).toBe(75);
    expect(dropoffPct(0, 5)).toBeNull();
    expect(dropoffPct(null, 5)).toBeNull();
    expect(dropoffPct(10, 20)).toBe(0);
  });
});
