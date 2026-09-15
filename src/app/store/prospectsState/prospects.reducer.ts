import { on, withReducer } from '@ngrx/signals/events';
import { prospectsEvents } from './prospects.events';
import { ProspectsState } from './prospects.state';
import { Prospect } from '../../../shared/models/prospect.model';

function upsert(items: Prospect[], prospect: Prospect): Prospect[] {
  return items.some((p) => p.id === prospect.id)
    ? items.map((p) => (p.id === prospect.id ? prospect : p))
    : [prospect, ...items];
}

export function withProspectsReducer() {
  return withReducer<ProspectsState>(
    on(prospectsEvents.load, () => ({ loading: true, error: null })),
    on(prospectsEvents.loadSuccess, ({ payload }) => ({
      items: payload,
      loaded: true,
      loading: false,
      error: null,
    })),
    on(prospectsEvents.loadFailure, ({ payload }) => ({ loading: false, error: payload })),

    on(prospectsEvents.setStatusFilter, ({ payload }) => ({ statusFilter: payload })),

    on(prospectsEvents.create, () => ({ creating: true, error: null })),
    on(
      prospectsEvents.update,
      prospectsEvents.remove,
      prospectsEvents.setStatus,
      prospectsEvents.setNextAction,
      prospectsEvents.addNote,
      ({ payload }, state) => ({ saving: [...state.saving, payload.id], error: null }),
    ),
    on(prospectsEvents.saveSuccess, ({ payload }, state) => ({
      creating: false,
      saving: state.saving.filter((id) => id !== payload.id),
      items: upsert(state.items, payload),
    })),
    on(prospectsEvents.removeSuccess, ({ payload }, state) => ({
      saving: state.saving.filter((id) => id !== payload.id),
      items: state.items.filter((p) => p.id !== payload.id),
    })),
    on(prospectsEvents.saveFailure, ({ payload }) => ({
      creating: false,
      saving: [],
      error: payload,
    })),

    on(prospectsEvents.importCsv, () => ({ importing: true, importResult: null, error: null })),
    on(prospectsEvents.importSuccess, ({ payload }) => ({
      importing: false,
      importResult: payload,
    })),
    on(prospectsEvents.importFailure, ({ payload }) => ({ importing: false, error: payload })),
    on(prospectsEvents.clearImportResult, () => ({ importResult: null })),
  );
}
