import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RANGE_LABELS, RANGES } from '../../../shared/models/range.model';
import { ShellFacade } from '../../store/shellState/shell.facade';

/** Today · 7d · 30d segmented control, persisted by the shell store. */
@Component({
  selector: 'pl-range-toggle',
  standalone: true,
  templateUrl: './range-toggle.html',
  styleUrl: './range-toggle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeToggle {
  readonly shell = inject(ShellFacade);
  readonly ranges = RANGES;
  readonly labels = RANGE_LABELS;
}
