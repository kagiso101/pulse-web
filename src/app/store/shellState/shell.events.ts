import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { Range } from '../../../shared/models/range.model';

export const shellEvents = eventGroup({
  source: 'Shell',
  events: {
    setRange: type<Range>(),
    selectProject: type<string | null>(),
    /** Manual refresh button. */
    refreshRequested: type<void>(),
    /** 60s timer while the tab is visible, and when the tab becomes visible again. */
    autoRefreshTick: type<void>(),
    /** A response carried a `lastSnapshotAt`. */
    snapshotSeen: type<string | null>(),
  },
});
