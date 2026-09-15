import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Notice } from '../../../shared/models/notice.model';

/** Contract §2.12 — Notices (in-app). */
@Injectable({ providedIn: 'root' })
export class NoticesApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/notices`;

  /** `GET /api/notices?unread=true`. */
  list(unread = true): Observable<Notice[]> {
    const params = new HttpParams().set('unread', String(unread));
    return this.http.get<Notice[]>(this.base, { params });
  }

  /** `POST /api/notices/{id}/read` → 204. */
  markRead(id: string): Observable<void> {
    return this.http.post<void>(`${this.base}/${encodeURIComponent(id)}/read`, {});
  }
}
