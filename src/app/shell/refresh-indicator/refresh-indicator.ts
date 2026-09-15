import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LucideAngularModule, RefreshCw } from 'lucide-angular';
import { relativeTime } from '../../../shared/utils/format';
import { injectNow } from '../../../shared/utils/now';
import { ShellFacade } from '../../store/shellState/shell.facade';

/** "updated 3 min ago" from the latest snapshot + a manual refresh button. */
@Component({
  selector: 'pl-refresh-indicator',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './refresh-indicator.html',
  styleUrl: './refresh-indicator.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefreshIndicator {
  readonly shell = inject(ShellFacade);
  readonly icons = { refresh: RefreshCw };

  private readonly now = injectNow(30_000);

  readonly text = computed(() => {
    const at = this.shell.lastSnapshotAt();
    return at ? `updated ${relativeTime(at, this.now())}` : 'no snapshot yet';
  });

  readonly stale = computed(() => {
    const at = this.shell.lastSnapshotAt();
    // metrics run every 15 min; an hour without a snapshot means a connector or job is stuck
    return !!at && this.now() - Date.parse(at) > 60 * 60_000;
  });
}
