import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RANGE_LABELS } from '../../shared/models/range.model';
import { relativeTime, formatDate } from '../../shared/utils/format';
import { injectNow } from '../../shared/utils/now';
import { BigNumber } from '../../shared/components/big-number/big-number';
import { ProjectCard } from '../../shared/components/project-card/project-card';
import { AlertsFacade } from '../../app/store/alertsState/alerts.facade';
import { OverviewFacade } from '../../app/store/overviewState/overview.facade';
import { ShellFacade } from '../../app/store/shellState/shell.facade';

const GAP_CAPTION = 'needs Bookvas endpoint';

/** The morning view (spec §5.2). */
@Component({
  selector: 'app-all',
  standalone: true,
  imports: [RouterLink, BigNumber, ProjectCard],
  templateUrl: './all.html',
  styleUrl: './all.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllPage {
  readonly shell = inject(ShellFacade);
  readonly overview = inject(OverviewFacade);
  readonly alerts = inject(AlertsFacade);

  private readonly now = injectNow();
  readonly gapCaption = GAP_CAPTION;

  readonly rangeLabel = computed(() => RANGE_LABELS[this.shell.range()]);
  readonly sitesTone = computed(() => {
    const h = this.overview.headline();
    if (!h) return 'neutral' as const;
    return h.sitesUp < h.sitesTotal ? ('bad' as const) : ('good' as const);
  });
  readonly summaryDate = computed(() => {
    const s = this.overview.summary();
    return s ? formatDate(s.date) : '';
  });
  readonly needsYou = computed(() =>
    this.overview.needsYou().map((item) => ({
      ...item,
      sinceLabel: relativeTime(item.since, this.now()),
      internal: item.href.startsWith('/'),
    })),
  );

  constructor() {
    this.shell.selectProject(null);
    // Range change, 60s tick or manual refresh → reload.
    effect(() => {
      const range = this.shell.range();
      this.shell.refreshTick();
      this.overview.load(range);
    });
  }

  isAcking(id: string): boolean {
    return this.alerts.acking().includes(id);
  }
}
