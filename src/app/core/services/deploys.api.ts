import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DeployEvent } from '../../../shared/models/deploy.model';

/** Contract §2.7 — Deploys. */
@Injectable({ providedIn: 'root' })
export class DeploysApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/deploys`;

  /** `GET /api/deploys?projectId=&limit=50` newest first. */
  list(projectId?: string | null, limit = 50): Observable<DeployEvent[]> {
    let params = new HttpParams().set('limit', String(limit));
    if (projectId) params = params.set('projectId', projectId);
    return this.http.get<DeployEvent[]>(this.base, { params });
  }
}
