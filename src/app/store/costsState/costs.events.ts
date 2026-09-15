import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { CostReport, ManualCost } from '../../../shared/models/cost.model';

export const costsEvents = eventGroup({
  source: 'Costs',
  events: {
    /** `null` = the API's default (current month). */
    load: type<string | null>(),
    loadSuccess: type<CostReport>(),
    loadFailure: type<string>(),

    saveManual: type<ManualCost>(),
    saveManualSuccess: type<CostReport>(),
    saveManualFailure: type<string>(),
  },
});
