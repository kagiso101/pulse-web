import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { ActionResult } from '../../models/action.model';

const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

let nextId = 0;

/**
 * Every action goes through this (spec §5.5): a bottom sheet on phone / centred dialog on
 * desktop that states in plain language exactly what will happen, then Cancel · Confirm.
 * The ActionResult is shown inline — green ok / coral failed — and failures are never hidden.
 * Focus-trapped; Escape closes.
 */
@Component({
  selector: 'pl-confirm-sheet',
  standalone: true,
  templateUrl: './confirm-sheet.html',
  styleUrl: './confirm-sheet.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmSheet {
  readonly open = input.required<boolean>();
  readonly title = input.required<string>();
  readonly sentence = input.required<string>();
  readonly busy = input(false);
  readonly result = input<ActionResult | null>(null);
  readonly error = input<string | null>(null);
  readonly confirmLabel = input('Confirm');

  readonly confirm = output<void>();
  readonly cancel = output<void>();
  readonly dismiss = output<void>();

  readonly titleId = `pl-sheet-title-${nextId++}`;
  readonly descId = `pl-sheet-desc-${nextId++}`;

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private previouslyFocused: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const isOpen = this.open();
      const panel = this.panel()?.nativeElement;
      if (isOpen && panel) {
        this.previouslyFocused = document.activeElement as HTMLElement | null;
        // let the sheet paint, then move focus inside
        setTimeout(() => this.focusFirst(panel), 0);
      } else if (!isOpen && this.previouslyFocused) {
        this.previouslyFocused.focus?.();
        this.previouslyFocused = null;
      }
    });
  }

  onBackdrop(): void {
    if (this.busy()) return;
    this.result() ? this.dismiss.emit() : this.cancel.emit();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      if (this.busy()) return;
      this.result() ? this.dismiss.emit() : this.cancel.emit();
      return;
    }
    if (event.key !== 'Tab') return;
    const panel = this.panel()?.nativeElement;
    if (!panel) return;
    const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === panel)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private focusFirst(panel: HTMLElement): void {
    // Prefer Cancel (the safe choice) so a stray Enter never confirms an action.
    const cancel = panel.querySelector<HTMLElement>('[data-focus-first]');
    (cancel ?? panel.querySelector<HTMLElement>(FOCUSABLE) ?? panel).focus();
  }
}
