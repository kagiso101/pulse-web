import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ActionLog, ActionResult, ConfirmBody } from '../../../shared/models/action.model';

/** Contract §2.9 — Actions. Every POST carries `{ confirm: true }`; rate-limited 20/min. */
@Injectable({ providedIn: 'root' })
export class ActionsApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/actions`;

  /** `POST /api/actions/bookvas/subscriptions/{subscriptionId}/extend-grace` `{ confirm, days? }` (default 5). */
  extendGrace(subscriptionId: string, days?: number): Observable<ActionResult> {
    return this.http.post<ActionResult>(
      `${this.base}/bookvas/subscriptions/${encodeURIComponent(subscriptionId)}/extend-grace`,
      body(days),
    );
  }

  /** `POST /api/actions/bookvas/subscriptions/{subscriptionId}/comp-period` `{ confirm, days? }` (default 30). */
  compPeriod(subscriptionId: string, days?: number): Observable<ActionResult> {
    return this.http.post<ActionResult>(
      `${this.base}/bookvas/subscriptions/${encodeURIComponent(subscriptionId)}/comp-period`,
      body(days),
    );
  }

  /** `POST /api/actions/bookvas/tenants/{tenantId}/toggle-founder` `{ confirm }`. */
  toggleFounder(tenantId: string): Observable<ActionResult> {
    return this.http.post<ActionResult>(
      `${this.base}/bookvas/tenants/${encodeURIComponent(tenantId)}/toggle-founder`,
      body(),
    );
  }

  /** `POST /api/actions/cloud-run/{service}/restart` `{ confirm }` — service must be a registry cloudRunService. */
  restartCloudRun(service: string): Observable<ActionResult> {
    return this.http.post<ActionResult>(
      `${this.base}/cloud-run/${encodeURIComponent(service)}/restart`,
      body(),
    );
  }

  /** `POST /api/actions/netlify/{siteId}/redeploy` `{ confirm }` — siteId must be a registry netlifySiteId. */
  redeployNetlify(siteId: string): Observable<ActionResult> {
    return this.http.post<ActionResult>(
      `${this.base}/netlify/${encodeURIComponent(siteId)}/redeploy`,
      body(),
    );
  }

  /** `GET /api/actions/log?limit=50`. */
  log(limit = 50): Observable<ActionLog[]> {
    const params = new HttpParams().set('limit', String(limit));
    return this.http.get<ActionLog[]>(`${this.base}/log`, { params });
  }
}

function body(days?: number): ConfirmBody {
  return days === undefined ? { confirm: true } : { confirm: true, days };
}
