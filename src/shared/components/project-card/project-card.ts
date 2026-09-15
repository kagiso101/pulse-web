import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectCard as ProjectCardModel } from '../../models/overview.model';
import { PROJECT_KIND_LABELS } from '../../models/project.model';
import { formatByUnit } from '../../utils/format';
import { Sparkline } from '../sparkline/sparkline';
import { StatusDot } from '../status-dot/status-dot';

/** One project on the All view: name, kind, three numbers, sparkline, status, open alerts. */
@Component({
  selector: 'pl-project-card',
  standalone: true,
  imports: [RouterLink, Sparkline, StatusDot],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCard {
  readonly card = input.required<ProjectCardModel>();

  readonly kindLabel = computed(() => PROJECT_KIND_LABELS[this.card().kind]);
  readonly numbers = computed(() =>
    this.card()
      .numbers.slice(0, 3)
      .map((n) => ({ ...n, display: formatByUnit(n.value, n.unit) })),
  );
  readonly alertLabel = computed(() => {
    const n = this.card().openAlerts;
    return n === 1 ? '1 open alert' : `${n} open alerts`;
  });
}
