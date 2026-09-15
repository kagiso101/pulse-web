import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { BigNumber } from './big-number';

function render(inputs: Record<string, unknown>) {
  const fixture = TestBed.createComponent(BigNumber);
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;
  return {
    fixture,
    value: el.querySelector('.big-number__value')?.textContent?.trim() ?? '',
    caption: el.querySelector('.big-number__caption')?.textContent?.trim() ?? null,
    label: el.querySelector('.big-number__label')?.textContent?.trim() ?? '',
  };
}

describe('BigNumber', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BigNumber] }).compileComponents();
  });

  it('renders an em dash for null', () => {
    const r = render({ label: 'Bookings this week', value: null });
    expect(r.value).toBe('—');
    expect(r.label).toBe('Bookings this week');
  });

  it('shows the caption only when the value is null', () => {
    const withNull = render({ label: 'Deposits', value: null, caption: 'needs Bookvas endpoint' });
    expect(withNull.caption).toBe('needs Bookvas endpoint');
    const withValue = render({ label: 'Deposits', value: 1250, unit: 'cents', caption: 'x' });
    expect(withValue.caption).toBeNull();
  });

  it('formats by unit in mono', () => {
    const r = render({ label: 'Visitors', value: 12345 });
    expect(r.value).toBe('12 345');
    expect(r.fixture.nativeElement.querySelector('.big-number__value').classList).toContain(
      'pl-num',
    );
    expect(render({ label: 'Deposits', value: 123450, unit: 'cents' }).value).toBe('R 1 234,50');
  });

  it('renders a denominator', () => {
    const r = render({ label: 'Founder seats', value: 3, denominator: 20 });
    expect(r.value.replace(/\s+/g, ' ')).toBe('3 / 20');
  });
});
