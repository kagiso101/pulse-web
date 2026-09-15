import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PendingAction } from '../../shared/models/action.model';
import { PROJECT_KIND_LABELS } from '../../shared/models/project.model';
import { RANGE_LABELS } from '../../shared/models/range.model';
import { redeployNetlifyAction, restartCloudRunAction } from '../../shared/utils/action-sentences';
import { formatMs, formatPct, relativeTime, shortSha } from '../../shared/utils/format';
import { injectNow } from '../../shared/utils/now';
import { DeployList } from '../../shared/components/deploy-list/deploy-list';
import { EmailHealthCard } from '../../shared/components/email-health-card/email-health-card';
import { FounderCountdown } from '../../shared/components/founder-countdown/founder-countdown';
import { FunnelBars } from '../../shared/components/funnel-bars/funnel-bars';
import { PlatformEvents } from '../../shared/components/platform-events/platform-events';
import { RankedList, RankedRow } from '../../shared/components/ranked-list/ranked-list';
import { RevenueCard } from '../../shared/components/revenue-card/revenue-card';
import { StatusDot } from '../../shared/components/status-dot/status-dot';
import { TenantLeaderboard } from '../../shared/components/tenant-leaderboard/tenant-leaderboard';
import { TrafficChart } from '../../shared/components/traffic-chart/traffic-chart';
import { ActionsFacade } from '../../app/store/actionsState/actions.facade';
import { DashboardFacade } from '../../app/store/dashboardState/dashboard.facade';
import { ShellFacade } from '../../app/store/shellState/shell.facade';

/** Project view (spec §5.3–5.5): header, traffic, Bookvas layer for kind=product, deploys. */
@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    RouterLink,
    StatusDot,
    TrafficChart,
    RankedList,
    FunnelBars,
    RevenueCard,
    FounderCountdown,
    EmailHealthCard,
    TenantLeaderboard,
    PlatformEvents,
    DeployList,
  ],
  templateUrl: './project.html',
  styleUrl: './project.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectPage {
  /** Route param, bound by withComponentInputBinding. */
  readonly slug = input.required<string>();

  readonly shell = inject(ShellFacade);
  readonly dashboard = inject(DashboardFacade);
  readonly actions = inject(ActionsFacade);

  private readonly now = injectNow();

  readonly d = this.dashboard.dashboard;
  readonly rangeLabel = computed(() => RANGE_LABELS[this.shell.range()]);
  readonly kindLabel = computed(() => {
    const d = this.d();
    return d ? PROJECT_KIND_LABELS[d.project.kind] : '';
  });
  readonly uptime = computed(() => formatPct(this.d()?.header.uptimePct ?? null, 2));
  readonly uptimeBad = computed(() => {
    const u = this.d()?.header.uptimePct ?? null;
    return u !== null && u < 99;
  });
  readonly latency = computed(() => formatMs(this.d()?.header.latencyMs ?? null));
  readonly lastDeploy = computed(() => {
    const ld = this.d()?.header.lastDeploy ?? null;
    return ld
      ? { sha: shortSha(ld.sha), branch: ld.branch, when: relativeTime(ld.deployedAt, this.now()) }
      : null;
  });

  readonly topPages = computed<RankedRow[]>(() =>
    (this.d()?.traffic.topPages ?? []).map((p) => ({ label: p.path, value: p.views })),
  );
  readonly sources = computed<RankedRow[]>(() =>
    (this.d()?.traffic.sources ?? []).map((s) => ({ label: s.source, value: s.sessions })),
  );
  readonly keyEvents = computed<RankedRow[]>(() =>
    (this.d()?.traffic.keyEvents ?? []).map((e) => ({ label: e.event, value: e.count })),
  );

  constructor() {
    effect(() => {
      const slug = this.slug();
      const range = this.shell.range();
      this.shell.refreshTick();
      this.shell.selectProject(slug);
      this.dashboard.load(slug, range);
    });
  }

  onAction(action: PendingAction): void {
    this.actions.request(action);
  }

  restart(service: string): void {
    this.actions.request(restartCloudRunAction(service));
  }

  redeploy(siteId: string, projectName: string): void {
    this.actions.request(redeployNetlifyAction(siteId, projectName));
  }

  hostOf(url: string): string {
    try {
      return new URL(url).host;
    } catch {
      return url;
    }
  }
}
