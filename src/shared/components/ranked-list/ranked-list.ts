import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { formatCount } from '../../utils/format';

export interface RankedRow {
  label: string;
  value: number;
}

/** Top pages · Sources · Key events — a label, a proportional bar and a mono count. */
@Component({
  selector: 'pl-ranked-list',
  standalone: true,
  templateUrl: './ranked-list.html',
  styleUrl: './ranked-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankedList {
  readonly title = input.required<string>();
  readonly rows = input.required<RankedRow[]>();
  readonly valueLabel = input('');
  readonly emptyText = input('Nothing recorded in this range.');

  readonly items = computed(() => {
    const rows = this.rows();
    const max = Math.max(1, ...rows.map((r) => r.value));
    return rows.map((r) => ({
      ...r,
      display: formatCount(r.value),
      width: Math.max(1.5, (r.value / max) * 100),
    }));
  });
}
