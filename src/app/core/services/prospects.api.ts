import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Prospect,
  ProspectImportResult,
  ProspectNextAction,
  ProspectStatus,
  ProspectUpsert,
} from '../../../shared/models/prospect.model';

export interface ProspectFilter {
  status?: ProspectStatus | null;
  overdue?: boolean;
}

/** Contract §2.5 — Prospects. */
@Injectable({ providedIn: 'root' })
export class ProspectsApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/api/prospects`;

  /** `GET /api/prospects?status=&overdue=true`. */
  list(filter: ProspectFilter = {}): Observable<Prospect[]> {
    let params = new HttpParams();
    if (filter.status) params = params.set('status', filter.status);
    if (filter.overdue) params = params.set('overdue', 'true');
    return this.http.get<Prospect[]>(this.base, { params });
  }

  /** `POST /api/prospects` → 201. */
  create(body: ProspectUpsert): Observable<Prospect> {
    return this.http.post<Prospect>(this.base, body);
  }

  /** `PUT /api/prospects/{id}`. */
  update(id: string, body: ProspectUpsert): Observable<Prospect> {
    return this.http.put<Prospect>(`${this.base}/${encodeURIComponent(id)}`, body);
  }

  /** `DELETE /api/prospects/{id}` → 204. */
  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${encodeURIComponent(id)}`);
  }

  /** `PATCH /api/prospects/{id}/status` body `{ status }`. */
  setStatus(id: string, status: ProspectStatus): Observable<Prospect> {
    return this.http.patch<Prospect>(`${this.base}/${encodeURIComponent(id)}/status`, { status });
  }

  /** `PATCH /api/prospects/{id}/next-action` body `{ nextAction, nextActionDate }`. */
  setNextAction(id: string, body: ProspectNextAction): Observable<Prospect> {
    return this.http.patch<Prospect>(`${this.base}/${encodeURIComponent(id)}/next-action`, body);
  }

  /** `POST /api/prospects/{id}/notes` body `{ note }` (appends with a timestamp line). */
  addNote(id: string, note: string): Observable<Prospect> {
    return this.http.post<Prospect>(`${this.base}/${encodeURIComponent(id)}/notes`, { note });
  }

  /** `POST /api/prospects/import` multipart `file` (CSV with header row). */
  importCsv(file: File): Observable<ProspectImportResult> {
    const form = new FormData();
    form.append('file', file, file.name);
    return this.http.post<ProspectImportResult>(`${this.base}/import`, form);
  }
}
