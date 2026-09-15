import { Project } from '../../../shared/models/project.model';

export interface ProjectsState {
  items: Project[];
  loaded: boolean;
  loading: boolean;
  saving: boolean;
  error: string | null;
  /** The raw client-view token — shown ONCE after generation, then gone. */
  tokenResult: { projectId: string; token: string; url: string } | null;
}

export const initialProjectsState: ProjectsState = {
  items: [],
  loaded: false,
  loading: false,
  saving: false,
  error: null,
  tokenResult: null,
};
