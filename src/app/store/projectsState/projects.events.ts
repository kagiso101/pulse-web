import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { Project, ProjectUpsert } from '../../../shared/models/project.model';

export const projectsEvents = eventGroup({
  source: 'Projects',
  events: {
    load: type<void>(),
    loadSuccess: type<Project[]>(),
    loadFailure: type<string>(),

    create: type<ProjectUpsert>(),
    update: type<{ id: string; body: ProjectUpsert }>(),
    deactivate: type<{ id: string }>(),
    saveSuccess: type<Project>(),
    deactivateSuccess: type<{ id: string }>(),
    saveFailure: type<string>(),

    generateToken: type<{ id: string }>(),
    generateTokenSuccess: type<{ projectId: string; token: string; url: string }>(),
    revokeToken: type<{ id: string }>(),
    revokeTokenSuccess: type<{ id: string }>(),
    tokenFailure: type<string>(),
    clearTokenResult: type<void>(),
  },
});
