import { Injectable, computed, inject } from '@angular/core';
import { injectDispatch } from '@ngrx/signals/events';
import { ProjectUpsert } from '../../../shared/models/project.model';
import { projectsEvents } from './projects.events';
import { ProjectsStore } from './projects.store';

@Injectable({ providedIn: 'root' })
export class ProjectsFacade {
  private readonly store = inject(ProjectsStore);
  private readonly dispatch = injectDispatch(projectsEvents);

  // Selectors
  readonly items = this.store.items;
  readonly loaded = this.store.loaded;
  readonly loading = this.store.loading;
  readonly saving = this.store.saving;
  readonly error = this.store.error;
  readonly tokenResult = this.store.tokenResult;

  /** Pills: active projects, sortOrder then name. */
  readonly activeProjects = computed(() =>
    this.store
      .items()
      .filter((p) => p.active)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)),
  );
  readonly inactiveProjects = computed(() => this.store.items().filter((p) => !p.active));
  readonly clientSites = computed(() =>
    this.activeProjects().filter((p) => p.kind === 'client_site'),
  );

  bySlug(slug: string | null) {
    return computed(() =>
      slug ? (this.store.items().find((p) => p.slug === slug) ?? null) : null,
    );
  }

  // Methods
  load(): void {
    this.dispatch.load();
  }

  create(body: ProjectUpsert): void {
    this.dispatch.create(body);
  }

  update(id: string, body: ProjectUpsert): void {
    this.dispatch.update({ id, body });
  }

  deactivate(id: string): void {
    this.dispatch.deactivate({ id });
  }

  generateToken(id: string): void {
    this.dispatch.generateToken({ id });
  }

  revokeToken(id: string): void {
    this.dispatch.revokeToken({ id });
  }

  clearTokenResult(): void {
    this.dispatch.clearTokenResult();
  }
}
