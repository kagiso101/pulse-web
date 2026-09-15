import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

/** Stacked toasts; errors use role=alert, everything else role=status. */
@Component({
  selector: 'pl-toasts',
  standalone: true,
  templateUrl: './toasts.html',
  styleUrl: './toasts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toasts {
  readonly notifications = inject(NotificationService);
}
