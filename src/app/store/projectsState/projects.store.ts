import { signalStore, withState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { withProjectsEffects } from './projects.effects';
import { withProjectsReducer } from './projects.reducer';
import { initialProjectsState } from './projects.state';

export const ProjectsStore = signalStore(
  { providedIn: 'root' },
  withState(initialProjectsState),
  withProjectsEffects(),
  withProjectsReducer(),
  withDevtools('projects-store'),
);
