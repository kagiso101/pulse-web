import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { EmailHealth } from '../../models/dashboard.model';
import { formatCount, relativeTime } from '../../utils/format';
import { injectNow } from '../../utils/now';

/** Bookvas transactional email health. Coral only when something failed in the last 24h. */
@Component({
  selector: 'pl-email-health-card',
  standalone: true,
  templateUrl: './email-health-card.html',
  styleUrl: './email-health-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailHealthCard {
  readonly health = input.required<EmailHealth | null>();

  private readonly now = injectNow();

  readonly alarm = computed(() => (this.health()?.failed24h ?? 0) > 0);
  readonly view = computed(() => {
    const h = this.health();
    if (!h) return null;
    return {
      sent24h: formatCount(h.sent24h),
      failed24h: formatCount(h.failed24h),
      sent7d: formatCount(h.sent7d),
      failed7d: formatCount(h.failed7d),
      lastSent: h.lastSentAt ? relativeTime(h.lastSentAt, this.now()) : 'never',
      smtpConfigured: h.smtpConfigured,
    };
  });
}
