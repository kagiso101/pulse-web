import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ConfirmSheet } from './confirm-sheet';

function render(inputs: Record<string, unknown>) {
  const fixture = TestBed.createComponent(ConfirmSheet);
  fixture.componentRef.setInput('open', true);
  fixture.componentRef.setInput('title', 'Extend grace period');
  fixture.componentRef.setInput(
    'sentence',
    "Extend Nomsa's Nails' grace period by 5 days on Bookvas.",
  );
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  return fixture;
}

const buttons = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLButtonElement>('button'));
const byText = (el: HTMLElement, text: string) =>
  buttons(el).find((b) => b.textContent?.trim() === text);

describe('ConfirmSheet', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ConfirmSheet] }).compileComponents();
  });

  it('renders the title and the plain-language sentence', () => {
    const el = render({}).nativeElement as HTMLElement;
    expect(el.querySelector('.sheet__title')?.textContent).toContain('Extend grace period');
    expect(el.querySelector('.sheet__sentence')?.textContent).toContain(
      "Extend Nomsa's Nails' grace period by 5 days on Bookvas.",
    );
    expect(el.querySelector('[role="dialog"]')?.getAttribute('aria-modal')).toBe('true');
  });

  it('renders nothing when closed', () => {
    const fixture = TestBed.createComponent(ConfirmSheet);
    fixture.componentRef.setInput('open', false);
    fixture.componentRef.setInput('title', 't');
    fixture.componentRef.setInput('sentence', 's');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('.sheet')).toBeNull();
  });

  it('emits confirm when Confirm is pressed and cancel on Cancel', () => {
    const fixture = render({});
    const el = fixture.nativeElement as HTMLElement;
    let confirmed = 0;
    let cancelled = 0;
    fixture.componentInstance.confirm.subscribe(() => confirmed++);
    fixture.componentInstance.cancel.subscribe(() => cancelled++);

    byText(el, 'Confirm')?.click();
    expect(confirmed).toBe(1);
    byText(el, 'Cancel')?.click();
    expect(cancelled).toBe(1);
  });

  it('disables both buttons while busy', () => {
    const el = render({ busy: true }).nativeElement as HTMLElement;
    expect(byText(el, 'Cancel')?.disabled).toBe(true);
    expect(byText(el, 'Working…')?.disabled).toBe(true);
  });

  it('shows a failed result in coral and offers Close, never hiding the message', () => {
    const fixture = render({
      result: { result: 'failed', message: 'Bookvas rejected the request', actionLogId: 'log-1' },
    });
    const el = fixture.nativeElement as HTMLElement;
    const result = el.querySelector('.sheet__result');
    expect(result?.classList).toContain('pl-result--failed');
    expect(result?.textContent).toContain('Bookvas rejected the request');
    expect(byText(el, 'Confirm')).toBeUndefined();

    let dismissed = 0;
    fixture.componentInstance.dismiss.subscribe(() => dismissed++);
    byText(el, 'Close')?.click();
    expect(dismissed).toBe(1);
  });

  it('shows an ok result in green', () => {
    const el = render({ result: { result: 'ok', message: 'Grace extended', actionLogId: 'log-2' } })
      .nativeElement as HTMLElement;
    expect(el.querySelector('.sheet__result')?.classList).toContain('pl-result--ok');
  });

  it('Escape cancels', () => {
    const fixture = render({});
    let cancelled = 0;
    fixture.componentInstance.cancel.subscribe(() => cancelled++);
    const panel = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('.sheet');
    panel?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(cancelled).toBe(1);
  });
});
