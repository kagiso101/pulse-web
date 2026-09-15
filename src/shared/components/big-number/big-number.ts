import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NumberUnit } from '../../models/overview.model';
import { formatByUnit, formatCount } from '../../utils/format';

/**
 * One headline figure: label, value in JetBrains Mono, unit-aware formatting.
 * null renders as "—" plus an optional muted caption (e.g. "needs Bookvas endpoint").
 */
@Component({
  selector: 'pl-big-number',
  standalone: true,
  templateUrl: './big-number.html',
  styleUrl: './big-number.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BigNumber {
  readonly label = input.required<string>();
  readonly value = input.required<number | null>();
  readonly unit = input<NumberUnit>('count');
  /** Shown under the dash when the value is null. */
  readonly caption = input<string | null>(null);
  /** Renders "value / denominator" (founder seats, sites up). */
  readonly denominator = input<number | null>(null);
  /** 'bad' → coral (only for problems), 'good' → green. */
  readonly tone = input<'neutral' | 'good' | 'bad'>('neutral');

  readonly display = computed(() => formatByUnit(this.value(), this.unit()));
  readonly denominatorDisplay = computed(() => {
    const d = this.denominator();
    return d === null ? null : formatCount(d);
  });
  readonly isNull = computed(() => this.value() === null);
}
