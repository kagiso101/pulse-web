import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CostReport, ManualCost } from '../../../shared/models/cost.model';

/** Contract §2.6 — Costs. */
@Injectable({ providedIn: 'root' })
export class CostsApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/costs`;

  /** `GET /api/costs?month=YYYY-MM` (default current month). */
  get(month?: string | null): Observable<CostReport> {
    let params = new HttpParams();
    if (month) params = params.set('month', month);
    return this.http.get<CostReport>(this.base, { params });
  }

  /** `PUT /api/costs/manual` body `{ provider, month, amountCents }`. */
  putManual(body: ManualCost): Observable<CostReport> {
    return this.http.put<CostReport>(`${this.base}/manual`, body);
  }
}
