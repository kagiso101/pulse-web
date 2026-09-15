import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { LucideAngularModule, Star } from 'lucide-angular';
import { PendingAction } from '../../models/action.model';
import { TenantRow } from '../../models/dashboard.model';
import {
  compPeriodAction,
  extendGraceAction,
  toggleFounderAction,
} from '../../utils/action-sentences';
import { formatDate } from '../../utils/format';

type Tone = 'green' | 'amber' | 'coral' | 'muted';

function tone(status: string | null): Tone {
  const s = (status ?? '').toUpperCase();
  if (s === 'ACTIVE' || s === 'TRIAL' || s === 'TRIALING') return 'green';
  if (s === 'GRACE' || s === 'PAST_DUE' || s === 'PENDING') return 'amber';
  if (s === 'SUSPENDED' || s === 'CANCELLED' || s === 'CANCELED' || s === 'INACTIVE')
    return 'coral';
  return 'muted';
}

/**
 * Tenant rows with the three per-tenant actions (spec §5.5). Nothing is sent from here —
 * each button emits a PendingAction that the shell's ConfirmSheet must confirm first.
 */
@Component({
  selector: 'pl-tenant-leaderboard',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './tenant-leaderboard.html',
  styleUrl: './tenant-leaderboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantLeaderboard {
  readonly tenants = input.required<TenantRow[]>();
  readonly busy = input(false);
  readonly action = output<PendingAction>();

  readonly icons = { star: Star };

  readonly rows = computed(() =>
    [...this.tenants()]
      .sort(
        (a, b) =>
          Number(b.isFounder) - Number(a.isFounder) || a.businessName.localeCompare(b.businessName),
      )
      .map((t) => ({
        ...t,
        subTone: tone(t.subscriptionStatus),
        tenantTone: tone(t.status),
        graceDisplay: t.graceUntil ? formatDate(t.graceUntil) : null,
        canActOnSubscription: !!t.subscriptionId,
        since: formatDate(t.createdAt),
      })),
  );

  extendGrace(t: TenantRow): void {
    const a = extendGraceAction(t);
    if (a) this.action.emit(a);
  }

  comp(t: TenantRow): void {
    const a = compPeriodAction(t);
    if (a) this.action.emit(a);
  }

  toggleFounder(t: TenantRow): void {
    this.action.emit(toggleFounderAction(t));
  }
}
