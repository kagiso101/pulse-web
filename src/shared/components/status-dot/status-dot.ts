import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { UpState } from '../../models/project.model';

const LABELS: Record<UpState, string> = { up: 'Up', down: 'Down', unknown: 'Unknown' };

/** Colour is never the only signal: the dot always carries an aria-label, optionally visible text. */
@Component({
  selector: 'pl-status-dot',
  standalone: true,
  templateUrl: './status-dot.html',
  styleUrl: './status-dot.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusDot {
  readonly state = input.required<UpState>();
  readonly showLabel = input(false);
  readonly label = computed(() => LABELS[this.state()]);
}
