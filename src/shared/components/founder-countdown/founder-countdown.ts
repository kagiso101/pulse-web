import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BookvasSection } from '../../models/dashboard.model';
import { formatCount } from '../../utils/format';

/** Founder seats used / total with a progress bar. */
@Component({
  selector: 'pl-founder-countdown',
  standalone: true,
  templateUrl: './founder-countdown.html',
  styleUrl: './founder-countdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FounderCountdown {
  readonly founder = input.required<BookvasSection['founder']>();

  readonly used = computed(() => formatCount(this.founder().used));
  readonly total = computed(() => formatCount(this.founder().total));
  readonly pct = computed(() => {
    const { used, total } = this.founder();
    if (used === null || total === null || total <= 0) return 0;
    return Math.min(100, (used / total) * 100);
  });
  readonly remaining = computed(() => {
    const { used, total } = this.founder();
    if (used === null || total === null) return null;
    return Math.max(0, total - used);
  });
  readonly remainingText = computed(() => {
    const r = this.remaining();
    if (r === null) return 'Seat count not available yet.';
    if (r === 0) return 'All founder seats are claimed.';
    return `${formatCount(r)} seat${r === 1 ? '' : 's'} left at the founder price.`;
  });
}
