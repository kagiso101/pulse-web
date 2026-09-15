import { on, withReducer } from '@ngrx/signals/events';
import { projectsEvents } from './projects.events';
import { ProjectsState } from './projects.state';
import { Project } from '../../../shared/models/project.model';

function upsert(items: Project[], project: Project): Project[] {
  return items.some((p) => p.id === project.id)
    ? items.map((p) => (p.id === project.id ? project : p))
    : [...items, project];
}

export function withProjectsReducer() {
  return withReducer<ProjectsState>(
    on(projectsEvents.load, () => ({ loading: true, error: null })),
    on(projectsEvents.loadSuccess, ({ payload }) => ({
      items: payload,
      loaded: true,
      loading: false,
      error: null,
    })),
    on(projectsEvents.loadFailure, ({ payload }) => ({ loading: false, error: payload })),

    on(projectsEvents.create, projectsEvents.update, projectsEvents.deactivate, () => ({
      saving: true,
      error: null,
    })),
    on(projectsEvents.saveSuccess, ({ payload }, state) => ({
      saving: false,
      items: upsert(state.items, payload),
    })),
    on(projectsEvents.deactivateSuccess, ({ payload }, state) => ({
      saving: false,
      items: state.items.map((p) => (p.id === payload.id ? { ...p, active: false } : p)),
    })),
    on(projectsEvents.saveFailure, ({ payload }) => ({ saving: false, error: payload })),

    on(projectsEvents.generateToken, projectsEvents.revokeToken, () => ({
      saving: true,
      tokenResult: null,
      error: null,
    })),
    on(projectsEvents.generateTokenSuccess, ({ payload }, state) => ({
      saving: false,
      tokenResult: payload,
      items: state.items.map((p) =>
        p.id === payload.projectId ? { ...p, hasClientViewToken: true } : p,
      ),
    })),
    on(projectsEvents.revokeTokenSuccess, ({ payload }, state) => ({
      saving: false,
      tokenResult: state.tokenResult?.projectId === payload.id ? null : state.tokenResult,
      items: state.items.map((p) =>
        p.id === payload.id ? { ...p, hasClientViewToken: false } : p,
      ),
    })),
    on(projectsEvents.tokenFailure, ({ payload }) => ({ saving: false, error: payload })),
    on(projectsEvents.clearTokenResult, () => ({ tokenResult: null })),
  );
}
