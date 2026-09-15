import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Bell, LucideAngularModule } from 'lucide-angular';
import { Notice } from '../../../shared/models/notice.model';
import { relativeTime } from '../../../shared/utils/format';
import { injectNow } from '../../../shared/utils/now';
import { NoticesFacade } from '../../store/noticesState/notices.facade';

/** Unread in-app notices (contract §2.12) — bell with a count, popover list, mark-read. */
@Component({
  selector: 'pl-notices-bell',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './notices-bell.html',
  styleUrl: './notices-bell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoticesBell {
  readonly notices = inject(NoticesFacade);
  private readonly router = inject(Router);
  readonly icons = { bell: Bell };

  private readonly now = injectNow();

  readonly rows = computed(() =>
    this.notices.items().map((n) => ({ ...n, when: relativeTime(n.createdAt, this.now()) })),
  );

  readonly label = computed(() => {
    const n = this.notices.unreadCount();
    return n === 0 ? 'Notices — none unread' : `Notices — ${n} unread`;
  });

  open(notice: Notice): void {
    this.notices.markRead(notice.id);
    if (notice.href) {
      this.notices.setPanelOpen(false);
      if (/^https?:\/\//.test(notice.href)) window.open(notice.href, '_blank', 'noopener');
      else this.router.navigateByUrl(notice.href);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.notices.setPanelOpen(false);
  }
}
