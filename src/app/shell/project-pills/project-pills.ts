import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectsFacade } from '../../store/projectsState/projects.facade';
import { ShellFacade } from '../../store/shellState/shell.facade';

/** All + one pill per active project. Red dot when the project has open alerts. */
@Component({
  selector: 'pl-project-pills',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-pills.html',
  styleUrl: './project-pills.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectPills {
  readonly projects = inject(ProjectsFacade);
  readonly shell = inject(ShellFacade);

  alertsLabel(n: number): string {
    return n === 1 ? '1 open alert' : `${n} open alerts`;
  }
}
