import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProjectDashboard } from '../../../shared/models/dashboard.model';
import { Range } from '../../../shared/models/range.model';

/** Contract §2.3 — Project dashboard. */
@Injectable({ providedIn: 'root' })
export class DashboardApi {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  /** `GET /api/projects/{slug}/dashboard?range=`. */
  get(slug: string, range: Range): Observable<ProjectDashboard> {
    const params = new HttpParams().set('range', range);
    return this.http.get<ProjectDashboard>(
      `${this.base}/api/projects/${encodeURIComponent(slug)}/dashboard`,
      { params },
    );
  }
}
