import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { DeployList } from '../../shared/components/deploy-list/deploy-list';
import { DeploysFacade } from '../../app/store/deploysState/deploys.facade';
import { ProjectsFacade } from '../../app/store/projectsState/projects.facade';
import { ShellFacade } from '../../app/store/shellState/shell.facade';

/** Deploys (spec §5.8): the release log across every project, filterable by project pill. */
@Component({
  selector: 'app-deploys',
  standalone: true,
  imports: [DeployList],
  templateUrl: './deploys.html',
  styleUrl: './deploys.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeploysPage {
  readonly deploys = inject(DeploysFacade);
  readonly projects = inject(ProjectsFacade);
  private readonly shell = inject(ShellFacade);

  readonly projectNames = computed(() =>
    Object.fromEntries(this.projects.items().map((p) => [p.id, p.name])),
  );

  constructor() {
    this.shell.selectProject(null);
    effect(() => {
      this.shell.refreshTick();
      untracked(() => this.deploys.load(this.deploys.projectId()));
    });
  }

  setFilter(projectId: string | null): void {
    if (projectId !== this.deploys.projectId()) this.deploys.setProjectFilter(projectId);
  }
}
