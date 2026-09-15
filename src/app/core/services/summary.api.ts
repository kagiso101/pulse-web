import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DailySummary } from '../../../shared/models/summary.model';

/** Contract §2.8 — Summary. */
@Injectable({ providedIn: 'root' })
export class SummaryApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/summary`;

  /** `GET /api/summary/latest` → `DailySummary | null`. */
  latest(): Observable<DailySummary | null> {
    return this.http.get<DailySummary | null>(`${this.base}/latest`);
  }

  /** `GET /api/summary?limit=14`. */
  list(limit = 14): Observable<DailySummary[]> {
    const params = new HttpParams().set('limit', String(limit));
    return this.http.get<DailySummary[]>(this.base, { params });
  }
}
