import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { DeployEvent } from '../../../shared/models/deploy.model';

export const deploysEvents = eventGroup({
  source: 'Deploys',
  events: {
    load: type<{ projectId: string | null }>(),
    loadSuccess: type<DeployEvent[]>(),
    loadFailure: type<string>(),
    setProjectFilter: type<string | null>(),
  },
});
