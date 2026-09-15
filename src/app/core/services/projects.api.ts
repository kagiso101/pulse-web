import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ClientViewTokenResponse,
  Project,
  ProjectUpsert,
} from '../../../shared/models/project.model';

/** Contract §2.1 — Projects (registry). */
@Injectable({ providedIn: 'root' })
export class ProjectsApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/projects`;

  /** `GET /api/projects` → active first, by sortOrder; includes inactive with `active:false`. */
  list(): Observable<Project[]> {
    return this.http.get<Project[]>(this.base);
  }

  /** `POST /api/projects` → 201. */
  create(body: ProjectUpsert): Observable<Project> {
    return this.http.post<Project>(this.base, body);
  }

  /** `PUT /api/projects/{id}`. */
  update(id: string, body: ProjectUpsert): Observable<Project> {
    return this.http.put<Project>(`${this.base}/${encodeURIComponent(id)}`, body);
  }

  /** `DELETE /api/projects/{id}` → 204 (soft delete: active=false). */
  deactivate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${encodeURIComponent(id)}`);
  }

  /** `POST /api/projects/{id}/client-view-token` — raw token returned ONCE. */
  createClientViewToken(id: string): Observable<ClientViewTokenResponse> {
    return this.http.post<ClientViewTokenResponse>(
      `${this.base}/${encodeURIComponent(id)}/client-view-token`,
      {},
    );
  }

  /** `DELETE /api/projects/{id}/client-view-token` → 204. */
  revokeClientViewToken(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${encodeURIComponent(id)}/client-view-token`);
  }
}
