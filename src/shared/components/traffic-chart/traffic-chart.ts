import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { formatCount, formatDate } from '../../utils/format';

export interface TrafficPoint {
  date: string;
  activeUsers: number;
  sessions: number;
}

const W = 100;
const H = 100;

/**
 * Visitors (activeUsers, green line + area) and sessions (muted line) over the range.
 * The plot is an SVG stretched to the box; axis labels are HTML so they never scale.
 */
@Component({
  selector: 'pl-traffic-chart',
  standalone: true,
  templateUrl: './traffic-chart.html',
  styleUrl: './traffic-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrafficChart {
  readonly series = input.required<TrafficPoint[]>();
  readonly compact = input(false);

  readonly viewBox = `0 0 ${W} ${H}`;

  readonly max = computed(() =>
    Math.max(1, ...this.series().map((p) => Math.max(p.activeUsers, p.sessions))),
  );

  private path(key: 'activeUsers' | 'sessions'): string {
    const s = this.series();
    if (s.length === 0) return '';
    const pts = s.length === 1 ? [s[0], s[0]] : s;
    const max = this.max();
    const step = W / (pts.length - 1);
    return pts
      .map(
        (p, i) =>
          `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(2)} ${(H - (p[key] / max) * H).toFixed(2)}`,
      )
      .join(' ');
  }

  readonly usersPath = computed(() => this.path('activeUsers'));
  readonly sessionsPath = computed(() => this.path('sessions'));
  readonly usersArea = computed(() => {
    const p = this.usersPath();
    return p ? `${p} L${W} ${H} L0 ${H} Z` : '';
  });

  readonly isEmpty = computed(() => this.series().length === 0);
  readonly maxLabel = computed(() => formatCount(this.max()));
  readonly midLabel = computed(() => formatCount(Math.round(this.max() / 2)));

  /** First · middle · last date (or hour for "today"). */
  readonly xLabels = computed(() => {
    const s = this.series();
    if (s.length === 0) return [];
    const pick = [0, Math.floor((s.length - 1) / 2), s.length - 1];
    return [...new Set(pick)].map((i) => xLabel(s[i].date));
  });

  readonly totals = computed(() => ({
    users: formatCount(this.series().reduce((a, p) => a + p.activeUsers, 0)),
    sessions: formatCount(this.series().reduce((a, p) => a + p.sessions, 0)),
  }));

  readonly ariaLabel = computed(
    () =>
      `Visitors and sessions over ${this.series().length} points; ${this.totals().users} visitors, ${this.totals().sessions} sessions in total`,
  );
}

function xLabel(date: string): string {
  // hourly points for "today" arrive as ISO instants → show HH:00; daily as YYYY-MM-DD → "15 Sep"
  if (date.length > 10) {
    const d = new Date(date);
    if (!Number.isNaN(d.getTime())) return `${String(d.getHours()).padStart(2, '0')}:00`;
  }
  return formatDate(date);
}
