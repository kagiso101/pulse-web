import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DeployEvent } from '../../models/deploy.model';
import { relativeTime, shortSha } from '../../utils/format';
import { injectNow } from '../../utils/now';

const SOURCE_LABELS: Record<DeployEvent['source'], string> = {
  netlify: 'Netlify',
  cloudrun: 'Cloud Run',
  github: 'GitHub',
};

/** Deploy timeline rows: sha (7, mono) · branch · message · environment · source · relative time. */
@Component({
  selector: 'pl-deploy-list',
  standalone: true,
  templateUrl: './deploy-list.html',
  styleUrl: './deploy-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeployList {
  readonly deploys = input.required<DeployEvent[]>();
  /** projectId → name, for the cross-project timeline. */
  readonly projectNames = input<Record<string, string>>({});
  readonly emptyText = input('No deploys recorded yet.');

  private readonly now = injectNow();

  readonly rows = computed(() => {
    const now = this.now();
    const names = this.projectNames();
    return this.deploys().map((d) => ({
      ...d,
      shaShort: shortSha(d.sha),
      when: relativeTime(d.deployedAt, now),
      sourceLabel: SOURCE_LABELS[d.source] ?? d.source,
      projectName: d.projectId ? (names[d.projectId] ?? null) : null,
    }));
  });
}
