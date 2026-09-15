import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { formatCents, formatMonth, formatRandsWhole } from '../../utils/format';

export interface TrendPoint {
  month: string;
  totalCents: number;
}

/** Six small monthly bars for the cost trend; the selected month is highlighted. */
@Component({
  selector: 'pl-trend-bars',
  standalone: true,
  templateUrl: './trend-bars.html',
  styleUrl: './trend-bars.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrendBars {
  readonly trend = input.required<TrendPoint[]>();
  readonly highlight = input<string | null>(null);

  readonly bars = computed(() => {
    const points = [...this.trend()].sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
    const max = Math.max(1, ...points.map((p) => p.totalCents));
    return points.map((p) => ({
      month: p.month,
      label: formatMonth(p.month).split(' ')[0],
      height: Math.max(2, (p.totalCents / max) * 100),
      amount: formatRandsWhole(p.totalCents),
      title: `${formatMonth(p.month)}: ${formatCents(p.totalCents)}`,
      active: p.month === this.highlight(),
    }));
  });
}
