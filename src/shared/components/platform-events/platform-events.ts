import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PlatformEvent } from '../../models/dashboard.model';
import { formatDateTime } from '../../utils/format';

function severityTone(severity: string): 'coral' | 'amber' | 'muted' {
  const s = severity.toUpperCase();
  if (s === 'ERROR' || s === 'CRITICAL' || s === 'FATAL') return 'coral';
  if (s === 'WARN' || s === 'WARNING') return 'amber';
  return 'muted';
}

/** Latest Bookvas platform events (max 20) with a severity chip. */
@Component({
  selector: 'pl-platform-events',
  standalone: true,
  templateUrl: './platform-events.html',
  styleUrl: './platform-events.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatformEvents {
  readonly events = input.required<PlatformEvent[]>();

  readonly rows = computed(() =>
    this.events()
      .slice(0, 20)
      .map((e) => ({
        ...e,
        when: formatDateTime(e.happenedAt),
        tone: severityTone(e.severity),
        typeLabel: e.eventType.replaceAll('_', ' ').toLowerCase(),
      })),
  );
}
