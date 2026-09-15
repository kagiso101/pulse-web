import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { Notice } from '../../../shared/models/notice.model';

export const noticesEvents = eventGroup({
  source: 'Notices',
  events: {
    load: type<void>(),
    loadSuccess: type<Notice[]>(),
    loadFailure: type<string>(),

    markRead: type<{ id: string }>(),
    markReadSuccess: type<{ id: string }>(),
    markReadFailure: type<string>(),

    setPanelOpen: type<boolean>(),
  },
});
