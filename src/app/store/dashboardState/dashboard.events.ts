import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { ProjectDashboard } from '../../../shared/models/dashboard.model';
import { Range } from '../../../shared/models/range.model';

export const dashboardEvents = eventGroup({
  source: 'Dashboard',
  events: {
    load: type<{ slug: string; range: Range }>(),
    loadSuccess: type<{ key: string; dashboard: ProjectDashboard }>(),
    loadFailure: type<{ key: string; message: string }>(),
  },
});
