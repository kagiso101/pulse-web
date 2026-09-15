import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClientView } from '../../../shared/models/client-view.model';

/** Contract §3 — Public client view (no auth, rate-limited 60/min/IP). */
@Injectable({ providedIn: 'root' })
export class ClientViewApi {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  /** `GET /api/public/client-view/{token}` — 404 for invalid or revoked tokens. */
  get(token: string): Observable<ClientView> {
    return this.http.get<ClientView>(
      `${this.base}/api/public/client-view/${encodeURIComponent(token)}`,
    );
  }
}
