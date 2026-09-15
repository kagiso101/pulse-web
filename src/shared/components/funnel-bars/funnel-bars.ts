import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BookvasSection } from '../../models/dashboard.model';
import { dropoffPct, formatCount, formatPct } from '../../utils/format';

const STEP_LABELS: Record<string, string> = {
  booking_started: 'Booking started',
  slot_selected: 'Slot selected',
  deposit_initiated: 'Deposit initiated',
  purchase: 'Purchase',
};

/** Coral when more than half the people drop between two steps. */
export const DROPOFF_ALARM_PCT = 50;

@Component({
  selector: 'pl-funnel-bars',
  standalone: true,
  templateUrl: './funnel-bars.html',
  styleUrl: './funnel-bars.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FunnelBars {
  readonly funnel = input.required<BookvasSection['funnel']>();

  readonly rows = computed(() => {
    const { steps, dropoffs } = this.funnel();
    const max = Math.max(1, ...steps.map((s) => s.count ?? 0));
    return steps.map((step, i) => {
      const prev = i > 0 ? steps[i - 1] : null;
      const fromApi = prev
        ? (dropoffs.find((d) => d.from === prev.event && d.to === step.event)?.pct ?? null)
        : null;
      const pct = prev ? (fromApi ?? dropoffPct(prev.count, step.count)) : null;
      return {
        event: step.event,
        label: STEP_LABELS[step.event] ?? step.event.replaceAll('_', ' '),
        count: step.count,
        countDisplay: formatCount(step.count),
        width: step.count === null ? 0 : Math.max(2, (step.count / max) * 100),
        dropoff: pct,
        dropoffDisplay: pct === null ? null : `−${formatPct(pct, 0)}`,
        alarm: pct !== null && pct > DROPOFF_ALARM_PCT,
      };
    });
  });

  readonly noteText = computed(
    () =>
      this.funnel().note ??
      'Bookvas only sends booking_started today — the remaining funnel events are not wired yet. Showing the last known state.',
  );
}
