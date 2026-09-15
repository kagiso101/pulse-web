import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import {
  Prospect,
  ProspectImportResult,
  ProspectNextAction,
  ProspectStatus,
  ProspectUpsert,
} from '../../../shared/models/prospect.model';

export const prospectsEvents = eventGroup({
  source: 'Prospects',
  events: {
    load: type<void>(),
    loadSuccess: type<Prospect[]>(),
    loadFailure: type<string>(),

    setStatusFilter: type<ProspectStatus | null>(),

    create: type<ProspectUpsert>(),
    update: type<{ id: string; body: ProspectUpsert }>(),
    remove: type<{ id: string }>(),
    setStatus: type<{ id: string; status: ProspectStatus }>(),
    setNextAction: type<{ id: string; body: ProspectNextAction }>(),
    addNote: type<{ id: string; note: string }>(),
    /** Any single-prospect mutation that returns the updated row. */
    saveSuccess: type<Prospect>(),
    removeSuccess: type<{ id: string }>(),
    saveFailure: type<string>(),

    importCsv: type<{ file: File }>(),
    importSuccess: type<ProspectImportResult>(),
    importFailure: type<string>(),
    clearImportResult: type<void>(),
  },
});
