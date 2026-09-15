import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AlertEvent, AlertRule, AlertRuleUpdate } from '../../../shared/models/alert.model';

/** Contract §2.4 — Alerts. */
@Injectable({ providedIn: 'root' })
export class AlertsApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/alerts`;

  /** `GET /api/alerts/rules`. */
  rules(): Observable<AlertRule[]> {
    return this.http.get<AlertRule[]>(`${this.base}/rules`);
  }

  /** `PUT /api/alerts/rules/{id}` body `{ enabled, threshold, channel }`. */
  updateRule(id: string, body: AlertRuleUpdate): Observable<AlertRule> {
    return this.http.put<AlertRule>(`${this.base}/rules/${encodeURIComponent(id)}`, body);
  }

  /** `GET /api/alerts/events?open=true|false&limit=50` (open = not acknowledged). */
  events(open: boolean, limit = 50): Observable<AlertEvent[]> {
    const params = new HttpParams().set('open', String(open)).set('limit', String(limit));
    return this.http.get<AlertEvent[]>(`${this.base}/events`, { params });
  }

  /** `POST /api/alerts/events/{id}/ack`. */
  ack(id: string): Observable<AlertEvent> {
    return this.http.post<AlertEvent>(`${this.base}/events/${encodeURIComponent(id)}/ack`, {});
  }
}
