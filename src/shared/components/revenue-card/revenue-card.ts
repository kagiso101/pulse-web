import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BookvasSection } from '../../models/dashboard.model';
import { formatCents, formatPct } from '../../utils/format';

/** Revenue this month vs last, projected. Shows "needs Bookvas endpoint" while unavailable. */
@Component({
  selector: 'pl-revenue-card',
  standalone: true,
  templateUrl: './revenue-card.html',
  styleUrl: './revenue-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RevenueCard {
  readonly revenue = input.required<BookvasSection['revenue']>();

  readonly thisMonth = computed(() => formatCents(this.revenue().thisMonthCents));
  readonly lastMonth = computed(() => formatCents(this.revenue().lastMonthCents));
  readonly projected = computed(() => formatCents(this.revenue().projectedCents));

  /** Change vs last month; null when either side is unknown or last month was zero. */
  readonly delta = computed(() => {
    const { thisMonthCents: t, lastMonthCents: l } = this.revenue();
    if (t === null || l === null || l === 0) return null;
    const pct = ((t - l) / l) * 100;
    return { pct, display: `${pct >= 0 ? '+' : '−'}${formatPct(Math.abs(pct), 0)}`, up: pct >= 0 };
  });
}
