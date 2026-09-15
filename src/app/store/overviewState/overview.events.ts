import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { Overview } from '../../../shared/models/overview.model';
import { Range } from '../../../shared/models/range.model';

export const overviewEvents = eventGroup({
  source: 'Overview',
  events: {
    load: type<Range>(),
    loadSuccess: type<Overview>(),
    loadFailure: type<string>(),
  },
});
