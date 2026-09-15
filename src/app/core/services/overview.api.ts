import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Overview } from '../../../shared/models/overview.model';
import { Range } from '../../../shared/models/range.model';

/** Contract §2.2 — Overview ("All" view). */
@Injectable({ providedIn: 'root' })
export class OverviewApi {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  /** `GET /api/overview?range=`. */
  get(range: Range): Observable<Overview> {
    const params = new HttpParams().set('range', range);
    return this.http.get<Overview>(`${this.base}/api/overview`, { params });
  }
}
